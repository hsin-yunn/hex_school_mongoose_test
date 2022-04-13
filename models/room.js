const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      required: [true, '價格必填'],
      default: 0,
    },
    rating: Number,
    payment: Array,
    updatedAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    // timestamps:true
  },
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
