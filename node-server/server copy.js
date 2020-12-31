var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors);
var http = require("http").Server(app);
var io = require("socket.io")(http, { cors: true });
var port = process.env.PORT || 3001;

// app.use(express.static(__dirname + "/static"));

// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });
/*
        type:0 用户进入、1 用户离开、2 正常消息
        msg:内容
        time：事件
    */
let users = [];
let loginUser = "";

io.on("connection", function(socket) {
    loginUser = socket;

    socket.on("chat message", function(data) {
        if (data.type == "login") {
            let user = users.find((item) => item.username == data.username);
            if (user) {
                socket.emit("loginErr", { msg: "登入失败" });
            } else {
                users.push(data);
                socket.username = data.username;
                socket.userphoto = data.userphoto;
                socket.emit("loginSuccess", data);
                console.log(`有人连接,当前连接人数${users.length}`);
                console.log(users);

                io.emit("chat message", {
                    type: 1,
                    msg: `${socket.username}进入群聊`,
                    time: new Date().toLocaleTimeString(),
                });

                io.emit("changeusers", {
                    users:users
                });
            }
        } else if (data.type == "sendmsg") {
            io.emit("chat message", {
                type: 2,
                msg: data.msg,
                time: new Date().toLocaleTimeString(),
                username: socket.username,
                userphoto:socket.userphoto
            });
        }
    });
    socket.on("login", (reason) => {

    })
    socket.on("disconnect", (reason) => {
        if (socket.username) {
            console.log(`${socket.username} 连接断开了`);
            console.log(socket.username);
            let idx = users.findIndex(
                (item) => item.username == socket.username
            );
            users.splice(idx, 1);

            io.emit("chat message", {
                type: 3,
                msg: `${socket.username}离开群聊`,
                time: new Date().toLocaleTimeString(),
                // users: users,
            });
            io.emit("changeusers", {
                users:users
            });
        }

        console.log(users);
    });
    socket.on("disconnecting", (reason) => {
        //socket正在断开
        console.log(socket.rooms); // Set { ... }
    });
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});
