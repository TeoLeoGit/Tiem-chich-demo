const Signup = require('../models/signup.model');
const Customer = require('../models/customer.model');
const mongoose = require('mongoose');

class SignupController {
    async getNewSignups(req, res, next) {
        if(req.isAuthenticated()) {
            let options = {
                populate: 'vaccines.item',
                page: 1,
                limit: 10,
            };

            let filter = { status: 'Submitted'}
            if(req.params.page) options['page'] = parseInt(req.params.page)
            await Signup.loadWithPagination(filter, options)
                .then(result => {
                    let pages = []
                    let currentPage = result.page;
                    let totalPages = result.totalPages;
                    pages.push({page: currentPage})
                    for (let i = currentPage + 1; i < currentPage + 5; i++)
                        if(i <= totalPages)
                            pages.push({page: i})
                    
                    let hasPrev = true
                    if (currentPage == 1) hasPrev = false
                    let hasNext = true
                    if( pages[pages.length - 1].page == totalPages) hasNext = false;

                    let prevAndNextInPages = { prev: currentPage - 1, next: pages[pages.length - 1].page + 1}
                    let prevAndNext = { prev: currentPage - 1, next: currentPage + 1}
                                       
                    res.render('signups', {
                        signups: result.docs,
                        page: pages,
                        hasPrev: hasPrev,
                        hasNext: hasNext,
                        prevAndNext: prevAndNext,
                        prevAndNextInPages: prevAndNextInPages
                    })
                })
                .catch(next); 
            }
            else   
                res.redirect('/login')
    }

    async receiveSignup(req, res, next) {
        // console.log(req.body)
        if(req.isAuthenticated()) {
            Signup.updateSignupById(req.body, { status: 'Received'})
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/signups');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async declineSignup(req, res, next) {
        // console.log(req.body)
        if(req.isAuthenticated()) {
            Signup.updateSignupById(req.body, { status: 'Rejected'})
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/orders');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async createSignup(req, res, next) {
        //console.log(req.body)
        let stopExcution = false;
        let register = {};
        if(req.body.registerId) {
            //check for existence customer
            await Customer.getCustomerById(req.body.registerId)
                .then(function(result) {
                    let customers = []
                    result.records.forEach(function(record) {
                        customers.push(record._fields[0])
                    });

                    //check for existence customer
                    if (customers.length === 0) {
                        res.render('vaccines', {
                            orderInform: 'Failed! Please check your customer code again.'
                        })
                        stopExcution = true;
                        return;
                    }

                    let properties = customers[0].properties;
                    register["id"] = req.body.registerId;
                    register["name"] = properties.name;
                    register["email"] = properties.email;
                    register["address"] = properties.address;
                })
                .catch(function(error) {
                    console.log(error);
                    stopExcution = true;
                    res.render('vaccines', {
                        orderInform: 'Failed! Please check your customer code again.'
                    })
                });
        }
        else {
            register["name"] = req.body.fullname;
            register["email"] = req.body.email;
            register["address"] = req.body.address;

        }

        if (stopExcution) return;

        let contact = {};
        if(req.body.contact) {
            contact["name"] = req.body.contact;
            contact["relationship"] = req.body.relationship;
        }
        
        let vaccines = []
        if(Array.isArray(req.body.vaccines))
            req.body.vaccines.forEach(x => { vaccines.push({item: x})})
        else
            vaccines.push({item: req.body.vaccines})
        
        let signup = {
            _id: mongoose.Types.ObjectId(),
            register: register,
            contact: contact,
            phone: req.body.phone,
            date: req.body.date,
            vaccines: vaccines,
            facility: req.body.facility
        }

        Signup.addSignup(signup)
            .then(function (result) {
                let returnString = 'Success!'
                if(!result) returnString = 'Failed! Please check your information or your customer code again.'
                res.render('vaccines', {
                    orderInform: returnString
                })
            })
            .catch(next);
    }
}

module.exports = new SignupController();