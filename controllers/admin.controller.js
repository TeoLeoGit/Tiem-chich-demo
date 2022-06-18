const Admin = require('../models/admin.model');
const driveAPI = require('../apis');
const mongoose = require('mongoose');
const fs = require('fs');
const { multipleMongooseToObject} = require('../utils/mongooseUtil');


class AdminController {
    index(req, res, next) {
        if(req.isAuthenticated()) {
            Admin.loadAll()
                .then(admins => {
                    console.log(admins);
                    res.render('adminAccounts', { admins: multipleMongooseToObject(admins)})
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    async updateAdmin(req, res, next) {
        if(req.isAuthenticated()) {
            console.log(req.body)
            let update = {}
            if(req.file) {
                const filePath = req.file.path
                let imgUrl = await driveAPI.uploadAdminImage(filePath, req.file.originalname)
                update["avataUrl"] = imgUrl
            }
            if(req.body.firstname) update["firstname"] = req.body.firstname
            if(req.body.lastname) update["lastname"] = req.body.lastname
            if(req.body.email) update["email"] = req.body.email
            if(req.body.phone) update["phone"] = req.body.phone
            if(req.body.address) update["address"] = req.body.address
            if(req.body.password) update["password"] = req.body.password
            
            let id = req.session.passport.user._id;
            
            await Admin.updateAdminById(id, update)
                .then(admin => {
                    console.log(admin)
                    if(req.file) {
                        fs.unlink(req.file.path, function (err) {
                            if (err) console.log(err);
                            // console.log('File deleted!');
                        });
                    }
                    req.login(admin, function(err) {
                        if (err) return next(err)
                        //res.send(200)
                    })
                    res.redirect('/adminProfile');
                })
                .catch(next);
        }
        else   
            res.redirect('/login')
    }

    
}

module.exports = new AdminController();