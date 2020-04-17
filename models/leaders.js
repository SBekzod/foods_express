const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: false
    }
}, {timestamps: true});

var Leaders = mongoose.model('Leader', LeaderSchema);

module.exports = Leaders;