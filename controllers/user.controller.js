const User = require('../models/user.model')
const Order = require('../models/order.model');
const mongoose = require('mongoose');
const { multipleMongooseToObject, mongooseToObject} = require('../utils/mongooseUtil');

class UserController {
    async getUserDetail(req, res, next) {
        // console.log(req.query)
        if(req.isAuthenticated()) {
            await User.getUserById(req.query)
                .then(customer => {
                    let orders = undefined
                    Order.getMostRecentOrderOfUser({userId: customer._id})
                        .then(results => {
                            orders = results
                            console.log(orders)
                            res.render('userAccounts/userDetail', {
                                customer: mongooseToObject(customer),
                                orders: orders
                            })
                        })
                        .catch(next);
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async getUsers(req, res, next) {
        if(req.isAuthenticated()) {
            let options = {
                page: 1,
                limit: 10,
            };

            let filter = { activeFlag: 1}
            if(req.params.page) options['page'] = parseInt(req.params.page)
            await User.loadPerPage(filter, options)
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
                    if (currentPage === 1) hasPrev = false
                    let hasNext = true
                    if( pages[pages.length - 1].page === totalPages) hasNext = false;

                    let prevAndNextInPages = { prev: currentPage - 1, next: pages[pages.length - 1].page + 1}
                    let prevAndNext = { prev: currentPage - 1, next: currentPage + 1}
                    
                    result.docs.forEach(doc => { 
                        doc["isBanned"] = false
                        if (doc.status === 'Deactivate')
                            doc.isBanned = true
                        return doc })
                    
                    res.render('userAccounts/userAccountsList', {
                        users: result.docs,
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

    blockUser(req, res, next) {
        console.log(req.body)
        if(req.isAuthenticated()) {
            User.blockUserById(req.body)
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/userAccounts');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    unblockUser(req, res, next) {
        console.log(req.body)
        if(req.isAuthenticated()) {
            User.unblockUserById(req.body)
                .then(function (err) {
                    if(!err) res.json()
                    res.redirect('/userAccounts');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

}

module.exports = new UserController();