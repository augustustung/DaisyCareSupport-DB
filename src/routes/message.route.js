const { Router } = require('express');
const userController = require('../controllers/user.controller');
const eventController = require('../controllers/event.controller');

const router = Router();

router.get('/get-all-channel-online', userController._onGetAllChannelOnline);
router.get('/get-all-user-inbox', userController._onAdminGetAllMessages);

router.post('/get-detail-inbox', userController._onGetDetailInbox);
router.post('/send-message', userController._onSendMessage);

// router.post('/create-event', eventController.createEvent);
// router.get('/get-list-event', eventController.getList);
// router.get('/get-detail-event', eventController.getDetail);
module.exports = router;