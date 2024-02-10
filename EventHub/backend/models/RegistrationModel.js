const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  attendance: {
    type: [Boolean],
    default: [],
  },
});

const Attendee = mongoose.model('Attendee', attendeeSchema);
module.exports = Attendee;
