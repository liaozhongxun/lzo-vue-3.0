var express = require("express");
var app = express();
var cors = require("cors");
const { time } = require("console");
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
let connects = [];

io.on("connection", function(socket) {
    connects.push(socket);
    console.log(`有人连接,当前连接人数${connects.length}`);

    socket.on("chat message", function(data) {
        if (data.type == "login") {
            socket.username = data.username;
            io.emit("chat message", {
                type: 1,
                msg: `${socket.username}进入群聊`,
                time: new Date().toLocaleTimeString(),
            });
        } else if (data.type == "sendmsg") {
            io.emit("chat message", {
                type: 2,
                msg: data.msg,
                time: new Date().toLocaleTimeString(),
            });
        }
    });

    socket.on("disconnect", (reason) => {
        connects.splice(connects.indexOf(socket), 1);
        console.log(`${reason} 连接断开了`);

        io.emit("chat message", {
            type: 3,
            msg: `${socket.username}离开群聊`,
            time: new Date().toLocaleTimeString(),
        });
    });
    socket.on("disconnecting", (reason) => {
        //socket正在断开
        console.log(socket.rooms); // Set { ... }
    });
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});
