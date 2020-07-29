const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteRateSchema = new mongoose.Schema({
    quote:{
        type: Schema.ObjectId,
        ref: 'quotes',
        required: true,
    },
    rater:{
        type: Schema.ObjectId,
        ref: 'users',
        required: true,
    },
    mark:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('quote_rates', quoteRateSchema);