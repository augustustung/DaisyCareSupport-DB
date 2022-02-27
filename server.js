require('dotenv').config();
const connectDb = require('./src/config/connectDb');
const cors = require('cors');
const initServer = require('./src/routes/index');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require("socket.io");

const { addUser } = require('./src/controllers/room');

connectDb();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
initServer(app);

let port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port, () => console.log("App listening at localhost:" + port));

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_WEB, process.env.DAISYCARE_DB],
    credentials: true
  },
  transports: ['websocket', 'polling', 'flashsocket']
});

io.on('connect', (socket) => {
  socket.on('join', ({ userId, userName, roomId }, callback) => {
    console.log(`${userName} joined`);

    const { error, user } = addUser({ id: userId, name: userName, room: roomId });

    if (error) return callback(error);

    socket.join(roomId);
    callback();
  });

  socket.on('sendMessage', ({ roomId, dataMessage }, senderCallback) => {
    socket.to(roomId).emit("receiveMessage", dataMessage);

    senderCallback(dataMessage.senderId);
  });

  socket.on('disconnect', () => {
    console.log("User has left!")
  })
});
