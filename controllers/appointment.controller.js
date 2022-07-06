const Appointment = require('../models/appointment.model');
const Order = require('../models/order.model');
const Signup = require('../models/signup.model');
const Customer = require('../models/customer.model');
const Facility = require('../models/facility.model');
const Vaccine = require('../models/vaccine.model')

//const { mongooseToObject} = require('../utils/mongooseUtil');

class AppointmentController {
    async index(req, res, next) {
        res.render('appointments')
    }

    async findAppointments(req, res, next) {
        let stopExecution = false;
        let options = {
            skip: 0,
            limit: 10,
        };
        let appointments = []

        if(req.params.page) options['skip'] = parseInt(req.params.page);
        await Appointment.findAppointmentsOfCustomer(req.query.customerId, options)
            .then(result => {
                let i = 0;
                //console.log(result.records[0]._fields[1])
                result.records.forEach(function(record) {
                    appointments.push(record._fields[0].properties)
                    appointments[i].facility = result.records[0]._fields[1]
                    i++;
                });
            })
            .catch(function(error) {
                console.log(error);
                stopExecution = true;
                res.render('appointments', {
                    alert: 'Error while finding the data.'
                })
            });
        
        if (stopExecution) return;
        for (let i = 0; i < appointments.length; i++) {
            let vaccines = appointments[i].vaccines;
            //console.log(appointments[i])
            for (let j = 0; j < vaccines.length; j++) {
                if (stopExecution) break;
                await Vaccine.getVaccineById({_id: vaccines[j]})
                                .then(function(result) {
                                    //console.log(result)
                                    appointments[i].vaccines[j] = result.name
                                })
                                .catch(function(error) {
                                    console.log(error)
                                    stopExecution = true;
                                    res.render('appointments', {
                                        alert: 'Vaccine data error.'
                                    })
                                });
            }
        }
        if (stopExecution) return;
        let nextPage = options.page + 1;
        let prevPage = (options.page > 1) ? (options.page - 1) : options.page

        res.render('appointments', {
            customerId: req.query.customerId,
            appointments: appointments,
            currentPage: options.page,
            subRoute: '/search',
            prevPage: prevPage,
            nextPage: nextPage,
        })
    }

    async createAppointmentForOrder(req, res, next) {
        let stopExcution = false;
        //console.log(req.body)
        let orderId = req.body._id;
        let appointmentInfos = {}
        let order = {}
        
        if (orderId) {
            await Order.getOrderById({_id: orderId})
                    .then(function(result) {
                        //console.log(result)
                        if(Object.keys(result).length === 0) {
                            res.render('addAppointment', {
                                alert: 'Error! Cannot find order.'
                            })
                            stopExcution = true;
                        }
                        else {
                            order = result
                            if (order.receiver.id) appointmentInfos.customerId = order.receiver.id;

                            appointmentInfos.customerName = order.receiver.name;
                            appointmentInfos.facility = order.facility;
                            appointmentInfos.vaccines = order.vaccines;
                            appointmentInfos.date = req.body.date;
                            appointmentInfos.orderId = orderId;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        stopExcution = true;
                        res.render('addAppointment', {
                            alert: 'Error while finding the order.'
                        })
                    });
        } else {
            res.render('addAppointment', {
                alert: 'Error! Cannot find order.'
            })
            stopExcution = true;
        }

        if (stopExcution) return;

        let receiver = {}
        let contact = {}

        if (!appointmentInfos.customerId) {
            receiver.name = order.receiver.name;
            receiver.phone = order.phone;
            receiver.email = order.receiver.email;
            receiver.address = order.receiver.address;
            await Customer.addCustomer(receiver)
                        .then(function(result) {
                            let customer = result.records[0]._fields[0];
                            //console.log(customer)
                            receiver.id = customer.properties.id
                            appointmentInfos.customerId = customer.properties.id
                        })
                        .catch(function(error) {
                            console.log(error);
                            stopExcution = true;
                            res.render('addAppointment', {
                                alert: 'Error while adding new customer.'
                            })
                        });
            
        } else receiver.id = appointmentInfos.customerId

        if (stopExcution) return;
        if (!order.buyer.id ) {
            if (order.receiver.relationship === 'Bản thân') contact.id = receiver.id
            else {
                contact.name = order.buyer.name;
                contact.phone = order.phone;
                contact.email = order.receiver.email;
                contact.address = order.receiver.address;
                await Customer.addCustomer(contact)
                            .then(function(result) {
                                let customer = result.records[0]._fields[0];
                                //console.log(customer)
                                contact.id = customer.properties.id
                            })
                            .catch(function(error) {
                                console.log(error);
                                stopExcution = true;
                                res.render('addAppointment', {
                                    alert: 'Error while adding contact.'
                                })
                            });
            }
        } else contact.id = order.buyer.id

        if (stopExcution) return;
        let hasRelationship = false;
        if (order.receiver.relationship === 'Bản thân')
            hasRelationship = true
        if (!hasRelationship) {
            await Customer.getRelationship(receiver.id, contact.id)
                            .then(function(result) {
                                if (result.records.length === 0) {
                                    hasRelationship = false;
                                }
                                else
                                    hasRelationship = true;
                            })
                            .catch(function(error) {
                                console.log(error);
                                stopExcution = true;
                                res.render('addAppointment', {
                                    alert: 'Error while trying to find the relationship.'
                                })
                            });
        }
        
        if (stopExcution) return;
        if (!hasRelationship) {
            await Customer.createRelationship(receiver.id, contact.id, order.receiver.relationship)
                            .catch(function(error) {
                                console.log(error);
                                stopExcution = true;
                                res.render('addAppointment', {
                                    alert: 'Error while adding relationship.'
                                })
                            });
        }
        
        if (stopExcution) return;
        let update = {}
        let addedBuyer = order.buyer
        let addedReceiver = order.receiver
        if (!order.buyer.id) {
            addedBuyer.id = contact.id
            update.buyer = addedBuyer
        }
        if (!order.receiver.id) {
            addedReceiver.id = receiver.id
            update.receiver = addedReceiver
        } 
        if (req.body.status) update.status = 'Received';

        if(req.body.status || Object.keys(update).length !== 0) {
            
            await Order.updateOrderById({ _id: order._id }, update)
                            .catch(function(error) {
                                console.log(error);
                                stopExcution = true;
                                res.render('addAppointment', {
                                    alert: 'Error while trying to update order status.'
                                })
                            });
        }
        
        if (stopExcution) return;
        appointmentInfos.vaccines = appointmentInfos.vaccines.map(x =>  x.item._id.toString())
        
        await Appointment.addAppointmentForOrder(appointmentInfos)
                    .then(function(result) {
                        //console.log(result);

                        let appointments = {}
                        result.records.forEach(function(record) {
                            appointments = record._fields[0]
                        });
                        //console.log(appointments);
                        res.render('addAppointment', {
                            alert: 'Success',
                            appointment: appointments
                        })
                    })
                    .catch(function(error) {
                        console.log(error);
                        res.render('addAppointment', {
                            alert: 'Error adding appoinment.'
                        })
                    });
    }

    async createAppointmentForSignup(req, res, next) {
        console.log(req.body)
        let stopExcution = false;
        let signupId = req.body._id;
        let appointmentInfos = {}
        let signup = {}
        if (signupId) {
            await Signup.getSignupById({_id: signupId})
                    .then(function(result) {
                        console.log(result)
                        if(Object.keys(result).length === 0) {
                            res.render('addAppointment', {
                                alert: 'Error! Cannot find sinup form.'
                            })
                            stopExcution = true;
                        }
                        else {
                            signup = result;
                            appointmentInfos.customerId = signup.register.id;
                            appointmentInfos.facility = signup.facility;
                            appointmentInfos.vaccines = signup.vaccines;
                            appointmentInfos.date = req.body.date;
                            appointmentInfos.signupId = signupId;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        stopExcution = true;
                        res.render('addAppointment', {
                            alert: 'Error while adding new appointment.'
                        })
                    });
        }

        if (stopExcution) return;

        let register = {}
        let contact = {}

        if (!appointmentInfos.customerId) {
            register.name = signup.register.name;
            register.phone = signup.phone;
            register.email = signup.register.email;
            register.address = signup.register.address;
            await Customer.addCustomer(register)
                        .then(function(result) {
                            let customer = result.records[0]._fields[0];
                            //console.log(customer)
                            register.id = customer.properties.id
                            appointmentInfos.customerId = customer.properties.id
                        })
                        .catch(function(error) {
                            console.log(error);
                            stopExcution = true;
                            res.render('addAppointment', {
                                alert: 'Error while adding new customer.'
                            })
                        });
            
        } else register.id = appointmentInfos.customerId

        if (stopExcution) return;
        if (!signup.contact.id ) {
            contact.name = signup.contact.name;
            contact.phone = signup.phone;
            contact.email = signup.register.email;
            contact.address = signup.register.address;
            await Customer.addCustomer(contact)
                        .then(function(result) {
                            let customer = result.records[0]._fields[0];
                            //console.log(customer)
                            contact.id = customer.properties.id
                        })
                        .catch(function(error) {
                            console.log(error);
                            stopExcution = true;
                            res.render('addAppointment', {
                                alert: 'Error while adding contact.'
                            })
                        });
        } else contact.id = signup.contact.id

        if (stopExcution) return;
        let hasRelationship = false;
        await Customer.getRelationship(contact.id, register.id)
                        .then(function(result) {
                            if (result.records.length === 0) {
                                hasRelationship = false;
                            }
                            else
                                hasRelationship = true;
                        })
                        .catch(function(error) {
                            console.log(error);
                            stopExcution = true;
                            res.render('addAppointment', {
                                alert: 'Error while trying to find the relationship.'
                            })
                        });
        
        if (stopExcution) return;
        if (!hasRelationship) {
            await Customer.createRelationship(contact.id, register.id, signup.contact.relationship)
                            .catch(function(error) {
                                console.log(error);
                                stopExcution = true;
                                res.render('addAppointment', {
                                    alert: 'Error while adding relationship.'
                                })
                            });
        }
        
        if (stopExcution) return;
        let update = {}
        let addedContact = signup.contact
        let addedRegister = signup.register
        if (!signup.contact.id) {
            addedContact.id = contact.id
            update.contact = addedContact
        }
        if (!signup.register.id) {
            addedRegister.id = register.id
            update.register = addedRegister
        } 
        if (req.body.status) update.status = 'Received';

        if(req.body.status || Object.keys(update).length !== 0) {
            
            await Signup.updateSignupById({ _id: signup._id }, update)
                            .catch(function(error) {
                                console.log(error);
                                stopExcution = true;
                                res.render('addAppointment', {
                                    alert: 'Error while trying to update sign up status.'
                                })
                            });
        }
        
        if (stopExcution) return;
        appointmentInfos.vaccines = appointmentInfos.vaccines.map(x =>  x.item._id.toString())
        Appointment.addAppointmentForSignup(appointmentInfos)
                    .then(function(result) {
                        //console.log(result);
                        let appointments = {}
                        result.records.forEach(function(record) {
                            appointments = record._fields[0]
                        });
                        res.render('addAppointment', {
                            alert: 'Success',
                            appointment: appointments
                        })
                    })
                    .catch(next);
    }

    async appointmentForOrderSite(req, res, next) {
        if(req.isAuthenticated()) {
            // let model = await Facility.getAllFacilities();
            // let facilities = []
            // model.records.forEach(function(record) {
            //         facilities.push(record._fields[0])
            //     });
            Order.getOrderById({_id: req.query._id})
                .then(function (result) {
                    res.render('addAppointment',
                    {
                        order: result,
                    });
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async appointmentForSignupSite(req, res, next) {
        if(req.isAuthenticated()) {
            // let model = await Facility.getAllFacilities();
            // let facilities = []
            // model.records.forEach(function(record) {
            //         facilities.push(record._fields[0])
            //     });
            Signup.getSignupById({_id: req.query._id})
                .then(function (result) {
                    res.render('addAppointment', { 
                        signup: result,
                    });
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

}

module.exports = new AppointmentController();