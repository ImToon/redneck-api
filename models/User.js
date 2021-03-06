const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 5,
        max: 24
    },
    password:{
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    email:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    date:{
        type: Date,
        default: Date.now
    }
});

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model('users', userSchema);