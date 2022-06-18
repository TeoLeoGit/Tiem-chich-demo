const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const productSchema = new Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        auto: 0
    },
    description: {
        type: String,
        required: true,
        auto: 'No description'
    },
    cover: {
        type: String,
        required: true,
        auto: '../public/images/pic-1.png'
    },
    status: {
        type: Number,
        auto: 1
    },
    activeFlag: {
        type: Number,
        required: true,
        default: 1
    },
});


productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);
module.exports  = {
    async loadAll() {
        return await Product.find({activeFlag: 1})
    },

    async addProduct(product) {
        return Product.create(product);
    },

    async getProductById(id) {
        return await Product.findOne(id).exec();
    },

    async deleteProductById(id) {
        let update = { activeFlag: 0 };
        return await Product.findOneAndUpdate(id, update, {
            new: true
          });
    },

    async updateProductById(id, update) {
        console.log(id)
        return await Product.findOneAndUpdate(id, update, {
            new: true
        });
    },

    async loadPerPage(filter, options) {
        return await Product.paginate(filter, options)
    },

    async getNumberOfProduct() {
        return await Product.countDocuments({ activeFlag: 1 })
    }
}