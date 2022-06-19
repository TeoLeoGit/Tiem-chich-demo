const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Employee = require('../models/employee.model')

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
},
    async function (username, password, done) {
        // console.log(username, password)
        try {
            let employee = await Employee.getEmployee({ username: username})
            // console.log(employee)
            if (!employee) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            let match = await validPassword(employee, password)
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, employee);
        }
            catch(err) { return done(err); }
    }
))

async function validPassword( employee, pwd ) {
    if (pwd === employee.password)
         return true;
    return false
}

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    Employee.getEmployeeById(id)
        .then(employee => {done(null, employee)})
        .catch(err => { done(null, false)})

    //   done(err, user);

});

module.exports = passport;