// let fs = require("fs");
module.exports = {
    devServer: {
        https:true
        // historyApiFallback: true,
        // noInfo: true,
        // hot: true,
        // https: {
        //     key: fs.readFileSync("C:/privkey.key"), //里面的文件替换成你生成的私钥
        //     cert: fs.readFileSync("C:/cacert.pem"), //里面的文件替换成你生成的证书
        // },
        // proxy: {
        //     "/socket.io": {
        //         target: "http://192.168.3.18:8002",
        //         ws: true,
        //         changeOrigin: true,
        //     },
        //     "sockjs-node": {
        //         target: "http://192.168.3.18:8002",
        //         ws: false,
        //         changeOrigin: true,
        //     },
        // },
    },
};
