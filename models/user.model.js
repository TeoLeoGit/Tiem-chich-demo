const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: String,
    status: String,
    confirmationCode: String,
    createdAt: Date
});

userSchema.plugin(mongoosePaginate);
const User = mongoose.model('User', userSchema);
module.exports  = {
    async loadAll() {
        return await User.find({activeFlag: 1})
    },

    async getUserById(id) {
        return await User.findOne(id).exec();
    },

    async loadPerPage(filter, options) {
        options.lean = true //lean to convert to plain js object
        console.log(options)
        return await User.paginate(filter, options) 
    },

    async blockUserById(id) {
        let update = { status: "Deactivate" };
        return await User.findOneAndUpdate(id, update, {
            new: true
          });
    },

    async unblockUserById(id) {
        let update = { status: "Active" };
        return await User.findOneAndUpdate(id, update, {
            new: true
          });
    },

    async getUserById(id) {
        return await User.findOne(id).exec();
    },

}