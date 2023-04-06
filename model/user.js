const mongoose = require('mongoose');
const OrderList = require('./order');

const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderList',
        required: true
    }]
});

module.exports = mongoose.model('User', userSchema);