const app = require('express')()
const http = require('http').createServer(app)
const socket = require('socket.io')(http)
const Chat = require('./chatModel')

function listenToSocket(){
    console.log("tutaj")
socket.on("connection", (userSocket) => {
    console.log("User connected")
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
        let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
        chatMessage.save();
    })
})
}

module.exports = listenToSocket