const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    buyer: {
        id: { type: String },
        name: { type: String },
    },
    receiver: {
        id: { type: String },
        name: { type: String },
        relationship: { type: String },
        email: { type: String },
        address: { type: String }
    },
    phone: {
         type: String,
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
        auto: 0
    },
    status: {
        type: String, 
        required: true, 
        default: "Submitted"
    },
});

orderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', orderSchema);
module.exports  = {
    async loadWithPagination(filter, options) {
        return await Order.paginate(filter, options)
    },

    async updateOrderById(id, update) {
        return await Order.findOneAndUpdate(id, update, {
            new: true
        });
    },

    async addOrder(order) {
        return await Order.create(order);
    },

    async getOrderById(id) {
        return await Order.findOne(id).populate('vaccines.item');;
    }

}