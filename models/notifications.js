const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:String,
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default:new Date()
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
