const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const signupSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    register: {
        id: { type: String },
        name: { type: String },
        email: { type: String },
        address: { type: String },
    },
    contact: {
        id: { type: String },
        name: { type: String },
        relationship: { type: String }
    },
    phone: {
         type: String,
         required: true
    },
    date: {
        type: Date,
        required: true
   },
    facility: {
        type: String,
        required: true
    },
    vaccines: [{
        item: {type: Schema.Types.ObjectId, ref: 'Vaccine'},
        _id : false
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String, 
        required: true, 
        default: "Submitted"
    },
});

signupSchema.plugin(mongoosePaginate);
const Signup = mongoose.model('Signup', signupSchema);
module.exports  = {
    async loadWithPagination(filter, options) {
        return await Signup.paginate(filter, options)
    },

    async updateSignupById(id, update) {
        return await Signup.findOneAndUpdate(id, update, {
            new: true
        });
    },

    async addSignup(signup) {
        return await Signup.create(signup);
    },

    async getSignupById(id) {
        return await Signup.findOne(id).populate('vaccines.item');;
    }

}