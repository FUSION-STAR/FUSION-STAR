const mongoose = require('mongoose');

const orderListSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    enum: ['Queue', 'Cook', 'Delivery', 'Complete'],
    default: 'Queue'
  }
});

module.exports = mongoose.model('OrderList', orderListSchema);
