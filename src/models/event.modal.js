const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: {
    type: String
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  adminId: {
    type: Number
  },
  employee: [{
    type: mongoose.Types.ObjectId,
    ref: 'Time'
  }],
  timeLimit: {
    type: Number
  },
  eventType: {
    type: String
  }
}, { timestamps: true });

const EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;