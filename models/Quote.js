const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteScheame = new mongoose.Schema({
    creator:{
        type: Schema.ObjectId,
        ref: 'users',
        required: true,
    },
    content:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('quotes', quoteScheame);