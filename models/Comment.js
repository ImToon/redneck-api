const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    author:{
        type: Schema.ObjectId,
        ref: 'users',
        required: true,
    },
    quote:{
        type: Schema.ObjectId,
        ref: 'quotes',
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comments', commentSchema);