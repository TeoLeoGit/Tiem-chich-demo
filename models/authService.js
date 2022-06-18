const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');

exports.register = async (username, password, firstname, lastname) => {
    const admin = await Admin.getAdmin({username: username});
    if(admin) {
        throw new Error('Username already registered')
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return Admin.createAdmin({username: username, 
        password: hashPassword, 
        firstname: firstname, 
        lastname: lastname })

}