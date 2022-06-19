const express = require('express');
const passport = require('../auth/passport');
const router = express.Router();

router.get('/login', function (req, res, next) {
    //assign req.flash to a variable or it will be undefined after first use
    let message = req.flash('error')[0]
    console.log(message)
    res.render('login', {
        message: message, 
        layout: false});       
});

router.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true}),
    function (req, res) {
        console.log('passport auth success')
        if(req.user)
            res.redirect('/');
        else
            res.redirect('/login');
    }
)

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
module.exports = router;