const Order = require('../models/order.model');
const Customer = require('../models/customer.model');

const mongoose = require('mongoose');
const { multipleMongooseToObject, mongooseToObject} = require('../utils/mongooseUtil');

class OrderController {
    async getReceivedOrders(req, res, next) {
        if(req.isAuthenticated()) {
            let options = {
                populate: 'products.item',
                page: 1,
                limit: 10,
            };  

            let filter = { status: 2}
            if(req.params.page) options['page'] = parseInt(req.params.page)
            await Order.loadPerPage(filter, options)
                .then(result => {
                    let pages = []
                    let currentPage = result.page;
                    let totalPages = result.totalPages;
                    pages.push({page: currentPage})
                    for (let i = currentPage + 1; i < currentPage + 5; i++)
                        if(i <= totalPages)
                            pages.push({page: i})
                    
                    //console.log(pages)
                    let hasPrev = true
                    if (currentPage == 1) hasPrev = false
                    let hasNext = true
                    if( pages[pages.length - 1].page == totalPages) hasNext = false;

                    let prevAndNextInPages = { prev: currentPage - 1, next: pages[pages.length - 1].page + 1}
                    let prevAndNext = { prev: currentPage - 1, next: currentPage + 1}
                                       
                    res.render('receivedOrders/receivedOrders', {
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

    async receiveOrder(req, res, next) {
        // console.log(req.body)
        if(req.isAuthenticated()) {
            Order.updateOrderById(req.body, { status: 'Received'})
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/orders');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

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
        let buyer = {};
        if(req.body.buyerId) {
            buyer["id"] = req.body.buyerId

        }
        else {
            buyer["name"] = req.body.buyerName
        }

        let receiver = {};
        if(req.body.receiverId) receiver["id"] = req.body.receiverId
        else {
            receiver["name"] = req.body.receiverName;
            receiver["relationship"] = req.body.relationship;
            receiver["email"] = req.body.email;
            receiver["address"] = req.body.address;
        }
        
        let vaccines = []
        req.body.vaccines.forEach(x => { vaccines.push({item: x})})

        let order = {
            _id: mongoose.Types.ObjectId(),
            buyer: buyer,
            receiver: receiver,
            phone: req.body.phone,
            vaccines: vaccines,
            facility: req.body.facility
        }
        
        //check for existence customer
        //let customer = await Customer.findCustomer(receiver.name, order.phone)
        Customer.addCustomer(receiver.name, order.phone);

        Order.addOrder(order)
            .then(function (result) {
                let returnString = 'Success!'
                if(!result) returnString = 'Failed! Please check your information or your customer code again.'
                //console.log(result)
                res.render('vaccines', {
                    orderInform: returnString
                })
            })
            .catch(next);
    }
}

module.exports = new OrderController();