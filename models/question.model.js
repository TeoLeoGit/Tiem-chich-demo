const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const questionSchema = new Schema({
    _id: {
        type: mongoose.ObjectId,
        auto: true,
    },
    poster: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    answer: {
        employee: {
            type: String,
        },
        comment: {
            type: String,
        }
    },
    subject: {
        type: String,
        required: true
    },
});

questionSchema.plugin(mongoosePaginate);
const Question = mongoose.model('Question', questionSchema);
module.exports  = {
    async loadWithPagination(filter, options) {
        return await Question.paginate(filter, options)
    },

    async addQuestion(question) {
        return await Question.create(question);
    },

    async updateQuesitonById(id, update) {
        return await Question.findOneAndUpdate(id, update, {
            new: true
        });
    },

}