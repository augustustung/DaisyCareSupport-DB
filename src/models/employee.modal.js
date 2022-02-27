const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  employeeId: Number,
  employeeFullName: String,
  employeeGender: String,
  employeeBirthDay: String,
}, { timestamps: true });

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;