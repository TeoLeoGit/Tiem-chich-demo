const authService = require('../models/authService')

exports.register = async (req, res, next) => {
    if(req.isAuthenticated()) {
        const { username, password, firstname, lastname} = req.body;
        // console.log(req.body)
        try {
            if(!username || !password || !firstname || !lastname) {
                res.render('adminAccounts', {errorCode: 1})
            } else {
                await authService.register(username, password, firstname, lastname)
                                .then(admin => console.log(admin)); //
                res.redirect('/admins')
            }
        } catch(err) {
            console.log(err)
            res.render('adminAccounts', {errorCode: 2})
        }
    }
    else   
        res.redirect('/login')
    
}