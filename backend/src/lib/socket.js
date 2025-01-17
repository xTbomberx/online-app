const { Server } = require("socket.io");
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

//  create SOCKET IO server
const io = new Server(server, {
    // CORS allows to different IPS to communicate with each other
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
})


// this gives socket ID when USERid is passed
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to Store ONLINE USERS
const userSocketMap = {}; // {userId: socketId} -- DB/socket

// STEP 1 - MAKE server LISTEN FOR connections
//          socket = user who just connected
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // update MAP of ONLINE USERS
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id; // setting a key with a value

    // io.emit() is used to send event to all the connected clients
    // Object.keys(userSocketMap) = all the keys(key/value) which is --> all the ONLINE user._ids
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // server is listening to the disconnect event
    socket.on('disconnect', () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId]; // remove that user from userSocketMap
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server , getReceiverSocketId};

