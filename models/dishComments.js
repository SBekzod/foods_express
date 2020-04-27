const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishCommentSchema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DishComment', dishCommentSchema); 