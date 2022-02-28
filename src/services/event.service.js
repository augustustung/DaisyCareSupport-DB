const EventModal = require('../models/event.modal');
const { Types } = require('mongoose');
const EmployeeModel = require('../models/employee.modal');
const TimeModel = require('../models/time.model');
const moment = require('moment');

function createEventService(data) {
  return new Promise(async (resolve, reject) => { 
    try {
      const newEvent = new EventModal({
        _id: new Types.ObjectId,
        ...data,
        startDate: moment(data.startDate).startOf('day').toISOString(),
        endDate: moment(data.endDate).endOf('day').toISOString()
      });
      
      await newEvent.save();

      resolve('ok');

    } catch(e) {
      reject(e);
    }
  })
}

function getListEvent() {
  return new Promise(async (resolve, reject) => { 
    try {
      const listEvent = await EventModal.find();
      if(listEvent && listEvent.length > 0) {
        resolve(listEvent);
      } else {
        resolve([]);
      }
    } catch(e) {
      reject(e);
    }
  })
}

function getEventDetail(id) {
  return new Promise(async (resolve, reject) => { 
    try {
      let event = await EventModal.findById(id).populate('employee');
      if(event) {
        if(event.employee && event.employee.length > 0) {
          let detailEmployee = [];
          for(let e of event.employee) {
            if(e.employeeId) {
              const findEmployeeInfo = await EmployeeModel.findById(e.employeeId.toString());
              detailEmployee.push({
                ...e._doc,
                ...findEmployeeInfo._doc
              });
            }
          }
          event._doc.employee = detailEmployee;
        }
        resolve(event);
      } else {
        resolve({});
      }
    } catch(e) {
      console.log(e);
      reject(e);
    }
  })
}

function isCreatedCheck(type) {
  return new Promise(async (resolve, reject) => { 
    try {
      let event = await EventModal.findOne({
        startDate: {
          $lt: new Date().toISOString()
        },
        endDate: {
          $gte: new Date().toISOString()
        },
        eventType: type
      });
      if(event) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch(e) {
      reject(e);
    }
  })
}

function checkAttendance(data) {
  return new Promise(async (resolve, reject) => { 
    try {
      const { 
        employeeId,
        timeCome
      } = data 

      //tim obj id cua employee
      let employee = await EmployeeModel.findOne({employeeId: parseInt(employeeId)}).exec();
      if(!employee) reject('not found');

      // vi la check lan dau cua ngay nen tao moi
      const findTimeCheck = await TimeModel.findOne({employeeId: employee._id.toString()});
      let newTimeCheckId = new Types.ObjectId; 
      if(!findTimeCheck) {
        const newtimeCheck = new TimeModel({
          _id: newTimeCheckId,
          timeCome: timeCome,
          employeeId: employee._id.toString(),
        });
        await newtimeCheck.save();
      }

      //find between startDate endDate  
      let event = await EventModal.findOne({
        startDate: {
          $lt: moment().endOf('date').toDate().toISOString()
        },
        endDate: {
          $gte: moment().startOf('date').toISOString()
        }
      });
      console.log(event);
      if(event) {
        if(!findTimeCheck) {
          event.employee.push(newTimeCheckId);
          await event.save();
          resolve('ok');
        } else {
          if(event.employee && event.employee.length > 0) {
            let findEmployee = event.employee.findIndex(e => e._id.toString() === findTimeCheck._id.toString());
            if(findEmployee === -1) {
              event.employee.push(findTimeCheck._id);
              await event.save();
              resolve('ok');
            }
          }
          resolve('checked');
        }
      } else {
        reject("not found");
      }
    } catch(e) {
      reject(e);
    }
  })
}


function finishAttendance(data) {
  return new Promise(async (resolve, reject) => { 
    try {
      const { 
        employeeId,
        timeLeave
      } = data 

      //tim obj id cua employee
      let employee = await EmployeeModel.findOne({employeeId: parseInt(employeeId)}).exec();
      if(!employee) reject('not found');

      // chua diem danh => ke :)
      let findTimeCheck = await TimeModel.findOne({employeeId: employee._id.toString()});
      if(!findTimeCheck) {
        reject("not found");
      } else {
        if(findTimeCheck.timeLeave !== null && findTimeCheck.timeLeave !== undefined && findTimeCheck.timeLeave !== '') {
          resolve('checked');
        } else {
          findTimeCheck.timeLeave = timeLeave;
          await findTimeCheck.save();
        }
      }
      resolve("ok");
    } catch(e) {
      reject(e);
    }
  })
}

module.exports = {
  createEventService,
  getListEvent,
  getEventDetail,
  checkAttendance,
  isCreatedCheck,
  finishAttendance
}