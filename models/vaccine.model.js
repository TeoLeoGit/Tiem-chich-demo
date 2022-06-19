const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const vaccineSchema = new Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true
    },
    prevention: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    activeFlag: {
        type: Number,
        required: true,
        default: 1
    },
});

vaccineSchema.plugin(mongoosePaginate);
const Vaccine = mongoose.model('Vaccine', vaccineSchema);
module.exports  = {
    async getVaccineById(id) {
        return await Vaccine.findOne(id).exec();
    },

    async updateProductById(id, update) {
        //console.log(id)
        return await Vaccine.findOneAndUpdate(id, update, {
            new: true
        });
    },

    async loadWithPagination(filter, options) {
        return await Vaccine.paginate(filter, options)
    },

}