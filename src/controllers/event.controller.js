const eventService = require('../services/event.service');

const createEvent = async (req, res) => {
  try {
    const message = await eventService.createEventService(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
}

const getList = async (req, res) => {
  try {
    const message = await eventService.getListEvent();
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json(e);
  }
}

const getDetail = async (req, res) => {
  try {
    const message = await eventService.getEventDetail(req.body.id);
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json(e);
  }
}

const checkAttendance = async (req, res) => {
  try {
    const message = await eventService.checkAttendance(req.body);
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json(e);
  }
}

const finishAttendance = async (req, res) => {
  try {
    const message = await eventService.finishAttendance(req.body);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json(e);
  }
}

const checkIsCreated = async (req, res) => {
  try {
    const message = await eventService.isCreatedCheck(req.body.type);
    return res.status(200).json(message);
  } catch(e) {
    return res.status(500).json(e);
  }
}

module.exports = {
  createEvent,
  getList,
  getDetail,
  checkAttendance,
  checkIsCreated,
  finishAttendance
}