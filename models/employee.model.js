const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    address: String,
    activeFlag: {
        type: Number,
        default: 1
    },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = {
    async loadAll() {
        return await Employee.find({activeFlag: 1})
    },

    async getEmployee(filter) {
        return await Employee.findOne(filter).exec();
    },

    async getEmployeeById(id) {
        return await Employee.findOne({_id: id}).exec();
    },

}