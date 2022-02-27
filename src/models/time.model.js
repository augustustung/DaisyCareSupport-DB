const mongoose = require('mongoose');

const TimeSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  timeCome: String,
  timeLeave: String,
  employeeId: {
    type: mongoose.Types.ObjectId,
    ref: "Employee"
  },
}, { timestamps: true });

const TimeModel = mongoose.model('Time', TimeSchema);

module.exports = TimeModel;