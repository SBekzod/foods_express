const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// var commentSchema = new Schema({
//     rating:  {
//         type: Number,
//         min: 1,
//         max: 5,
//         required: true
//     },
//     comment:  {
//         type: String,
//         required: true
//     },
//     author:  {
//         type: String,
//         required: true
//     }
// }, {
//     timestamps: true
// });

var dishSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        required: false 
    },
    description: {
        type: String,
        required: true
    },
    commenting: {
        type: String,
        required: true
    },
    here: {
        type: String,
        required: true,
        default: 'I am here'
    }
    // comments:[commentSchema]
}, {
    timestamps: true
});


module.exports = mongoose.model('Dish', dishSchema);;

