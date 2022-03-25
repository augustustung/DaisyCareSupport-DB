const appController = require('../controllers/app.controller');
const eventController = require('../controllers/event.controller');
const refreshToken = require('../controllers/refreshToken');
const messageRoute = require('./message.route');
const checkAuth = require('../controllers/auth');
require('dotenv').config();

const initServer = (app) => {
    app.get('/', (req, res) => res.send(`<h1 style='text-align: center; color: red; font-size: 15rem;'>STOP</h1>`));
    app.post('/sign-in', appController._onSignin);
    app.post('/refresh-token', refreshToken)
    app.post('/sign-up', appController._onSignup);
    app.delete('/sign-out', appController._onLogout);
    app.post('/create-employee', appController.createEmployee);
    app.post('/check-attendance', eventController.checkAttendance);
    app.post('/finish-attendance', eventController.finishAttendance);
    app.post('/create-event', eventController.createEvent);
    app.post('/get-list-event', eventController.getList);
    app.post('/get-detail-event', eventController.getDetail);
    app.post('/check-created', eventController.checkIsCreated);
    app.post('/upload', appController.uploadNewStaff);
    app.use('/api', checkAuth, messageRoute);
    app.get('/*', (req, res) => {
        const fileUrl = __dirname.split('src')[0]
        return res.sendFile(fileUrl + `/${req.params['0']}`)
    });
}

module.exports = initServer;