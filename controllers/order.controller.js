const Order = require('../models/order.model');
const Customer = require('../models/customer.model');

const mongoose = require('mongoose');

class OrderController {
    async getNewOrders(req, res, next) {
        if(req.isAuthenticated()) {
            let options = {
                populate: 'vaccines.item',
                page: 1,
                limit: 10,
            };

            let filter = { status: 'Submitted'}
            if(req.params.page) options['page'] = parseInt(req.params.page)
            await Order.loadWithPagination(filter, options)
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
                                       
                    res.render('orders', {
                        orders: result.docs,
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

    // async receiveOrder(req, res, next) {
    //     // console.log(req.body)
    //     if(req.isAuthenticated()) {
    //         Order.updateOrderById(req.body, { status: 'Received'})
    //             .then(function (err) {
    //                 if(!err) res.json()
    //                 res.redirect('/orders');
    //             })
    //             .catch(next);
    //     }
    //     else   
    //         res.redirect('/login')
    // }

    async declineOrder(req, res, next) {
        // console.log(req.body)
        if(req.isAuthenticated()) {
            Order.updateOrderById(req.body, { status: 'Rejected'})
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/orders');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async createOrder(req, res, next) {
        //console.log(req.body)
        let stopExcution = false;
        let buyer = {};
        let receiver = {};
        let phone = req.body.phone
        if(req.body.buyerId) {
            //check for existence customer
            await Customer.getCustomerById(req.body.buyerId)
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
                    buyer["id"] = req.body.buyerId;
                    buyer["name"] = properties.name;

                    if(req.body.receiverName) {
                        receiver["name"] = req.body.receiverName;
                        receiver["relationship"] = req.body.relationship;
                        receiver["email"] = req.body.email;
                        receiver["address"] = req.body.address;
                    } else {
                        receiver["id"] = properties.id;
                        receiver["name"] = properties.name;
                        receiver["relationship"] = 'B???n th??n';
                        receiver["email"] = properties.email;
                        receiver["address"] = properties.address;
                        phone = properties.phone;
                    }
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
            buyer["name"] = req.body.buyerName
        }
        
        if (stopExcution) return;

        if(req.body.receiverName) {
            receiver["name"] = req.body.receiverName;
            receiver["relationship"] = req.body.relationship;
            receiver["email"] = req.body.email;
            receiver["address"] = req.body.address;
        }

        if (req.body.phone) {
            await Customer.findCustomer(receiver.name, req.body.phone)
                            .then(result => {
                                console.log(result.records[0])
                                if (result.records.length > 0)
                                    receiver.id = result.records[0]._fields[0].properties.id
                            });
                            
            await Customer.findCustomer(buyer.name, req.body.phone)
                            .then(result => {
                                console.log(result.records[0])
                                if (result.records.length > 0)
                                buyer.id = result.records[0]._fields[0].properties.id
                            });
                            
        }
        console.log(buyer)
        console.log(receiver)

        let vaccines = []
        if(Array.isArray(req.body.vaccines))
            req.body.vaccines.forEach(x => { vaccines.push({item: x})})
        else
            vaccines.push({item: req.body.vaccines})

        let order = {
            _id: mongoose.Types.ObjectId(),
            buyer: buyer,
            receiver: receiver,
            phone: phone,
            vaccines: vaccines,
            facility: req.body.facility
        }

        Order.addOrder(order)
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

module.exports = new OrderController();