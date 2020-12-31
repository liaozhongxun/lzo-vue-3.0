var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors);
var http = require("http").Server(app);
var io = require("socket.io")(http, { cors: true });
var port = process.env.PORT || 3001;
const USER_ENTER = 1;
const USER_OUT = 3;
const USER_MSG = 2;

let users = [];
let loginUser = "";

io.on("connection", function(socket) {
    loginUser = socket;

    socket.on("chat message", function(data) {
        io.emit("chat message", {
            type: USER_MSG,
            msg: data.msg,
            time: new Date().toLocaleTimeString(),
            username: socket.username,
            userphoto: socket.userphoto,
        });
    });
    socket.on("login", (data) => {
        let user = users.find((item) => item.username == data.username);
        if (user) {
            socket.emit("loginErr", { msg: "登入失败" });
        } else {
            users.push(data);
            socket.username = data.username;
            socket.userphoto = data.userphoto;
            socket.emit("loginSuccess", data);
            console.log(`${data.username}进入,当前连接人数${users.length}`);

            io.emit("chat message", {
                type: USER_ENTER,
                msg: `${socket.username}进入群聊`,
                time: new Date().toLocaleTimeString(),
            });

            io.emit("changeusers", {
                users: users,
            });
        }
    });
    socket.on("disconnect", (reason) => {
        if (socket.username) {
            console.log(`${socket.username} 连接断开了`);
            let idx = users.findIndex((item) => item.username == socket.username);
            users.splice(idx, 1);

            io.emit("chat message", {
                type: USER_OUT,
                msg: `${socket.username}离开群聊`,
                time: new Date().toLocaleTimeString(),
            });
            io.emit("changeusers", {
                users: users,
            });
        }
    });
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});
