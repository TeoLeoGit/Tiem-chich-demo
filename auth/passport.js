const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Admin = require('../models/admin.model')

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
},
    async function (username, password, done) {
        // console.log(username, password)
        try {
            let admin = await Admin.getAdmin({ username: username})
            // console.log(admin)
            if (!admin) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            let match = await validPassword(admin, password)
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, admin);
        }
            catch(err) { return done(err); }
    }
))

async function validPassword( admin, pwd ) {
    return bcrypt.compare(pwd, admin.password);
}

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    Admin.getAdminById(id)
        .then(admin => {done(null, admin)})
        .catch(err => { done(null, false)})

    //   done(err, user);

});

module.exports = passport;