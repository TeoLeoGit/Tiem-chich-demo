const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
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
    avataUrl: String,
    phone: String,
    address: String,
    activeFlag: {
        type: Number,
        default: 1
    },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = {
    async loadAll() {
        return await Admin.find({activeFlag: 1})
    },

    async getAdmin(filter) {
        return await Admin.findOne(filter).exec();
    },

    async getAdminById(id) {
        return await Admin.findOne({_id: id}).exec();
    },


    async createAdmin(requiredInfos) {
        return await Admin.create(requiredInfos)
    },

    async updateAdminById(id, update) {
        
        if (update.password) {
            console.log(update.password)
            update.password = await bcrypt.hash(update.password, 10);
        }
        
        return await Admin.findOneAndUpdate(id, update, {
            new: true
        });
    },
}