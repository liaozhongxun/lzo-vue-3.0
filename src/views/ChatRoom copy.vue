<template>
    <div class="ChatRoom">
        <div class="loginmasker" v-if="showmasker">
            <div class="logincenter">
                <el-input type="text" size="mini" v-model="username" placeholder="请输入用户名"></el-input>
                <ul class="photos">
                    <li
                        class="item"
                        v-for="(item, index) in photos"
                        :class="{ active: index == selecrIndex }"
                        :key="index"
                        @click="selectphoto(item.text, index)"
                    >
                        <img :src="item.path" :title="item.path" />
                    </li>
                </ul>
                <div class="loginin" @click="login">登 入</div>
            </div>
        </div>
        <div class="room-main">
            <div class="room-left">
                <div class="oneuser header">
                    <img :src="loginInfo.path" />
                    <div class="name">{{ loginInfo.username }}</div>
                </div>
                <div class="alluser">
                    <div class="oneuser" v-for="(item, index) in webusers.users" :key="index">
                        <img :src="item.path" />
                        <div class="name">{{ item.username }}</div>
                    </div>
                </div>
            </div>
            <div class="room-right">
                <div class="room-header">总人数({{ webusers.users.length }})</div>
                <div class="room-top">
                    <ul class="userlist" ref="scroll">
                        <li
                            class="item"
                            v-for="(item, index) in dataList"
                            :key="index"
                            :class="{
                                adduser: item.type == 1,
                                msg: item.type == 2,
                                removeuser: item.type == 3,
                                loginuser: item.username == loginInfo.username,
                            }"
                        >
                            <div v-if="item.type == 1 || item.type == 3">
                                <div class="font">{{ item.msg }}</div>
                            </div>
                            <div v-if="item.type == 2&&item.username != loginInfo.username">
                                <div class="usermsgs">
                                    <img class="photo" :src="item.path" />
                                    <div class="msginfo">{{ item.msg }}</div>
                                </div>
                            </div>
                            <div v-if="item.type == 2&&item.username == loginInfo.username">
                                <div class="usermsgs">
                                    <img class="photo" :src="item.path" />
                                    <div class="msginfo">{{ item.msg }}</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="room-bottom">
                    <el-input type="textarea" class="entermsg" v-model="sendmsgdata" @keyup.enter.native="sendmsg" rows="4"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatRoom",
    data() {
        return {
            showmasker: false,
            username: "",
            userphoto: "",
            sendmsgdata: "",
            dataList: [],
            loginInfo: {
                username:""
            },
            selecrIndex: -1,
            photos: [
                { path: require("../assets/images/photo1.jpg"), text: "../assets/images/photo1.jpg" },
                { path: require("../assets/images/photo2.jpg"), text: "../assets/images/photo2.jpg" },
                { path: require("../assets/images/photo3.jpg"), text: "../assets/images/photo3.jpg" },
                { path: require("../assets/images/photo4.jpg"), text: "../assets/images/photo4.jpg" },
                { path: require("../assets/images/photo5.jpg"), text: "../assets/images/photo5.jpg" },
            ],
            webusers: {users:[]},
        };
    },
    methods: {
        login() {
            if (this.username && this.userphoto) {
                let data = {
                    username: this.username,
                    userphoto: this.userphoto,
                    type: "login",
                };
                this.$io.emit("chat message", data);
            } else {
                this.$message({
                    message: "请输入名称或选择头像!",
                    type: "warning",
                });
            }
        },
        sendmsg() {
            let data = {
                msg: this.sendmsgdata,
                type: "sendmsg",
            };
            this.$io.emit("chat message", data);
            this.sendmsgdata = "";

            //当前元素底部要显示在可区;
            this.$refs.scroll.scrollIntoView(false);
        },
        selectphoto(data, index) {
            this.userphoto = data;
            this.selecrIndex = index;
        },
    },
    mounted() {
        console.log(this.loginInfo);
        this.loginInfo.username?this.showmasker = false:this.showmasker = true;
        this.$io.on("chat message", (data) => {
            if(data.type == 2){
                data.path = this.photos.filter((item) => item.text == data.userphoto)[0].path;
            }
            this.dataList.push(data);
            console.log(this.dataList);
        });
        this.$io.on("loginSuccess", (data) => {
            console.log(data); //通过这个可以表示当前用户信息
            this.loginInfo = data;
            this.loginInfo.path = this.photos.filter((item) => item.text == data.userphoto)[0].path;
            this.showmasker = false;
        });
        this.$io.on("loginErr", (data) => {
            // this.$message({
            //     message: "登入失败",
            //     type: "warning",
            // });
            console.log("登入失败")
        });
        this.$io.on("changeusers", (data) => {
            data.users.map((itemUs) => {
                itemUs.path = this.photos.filter((item) => item.text == itemUs.userphoto)[0].path;
            });
            this.webusers = data;
        });
    },
};
</script>
<style lang="scss" scoped>
.ChatRoom {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.loginmasker {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    left: 0;
    top: 0;
    background: #fff;
    background: url("../assets/images/wxbg.jpg") no-repeat 50%;
    background-size: cover;
    .logincenter {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -190px;
        margin-top: -250px;
        border-radius: 4px;
        background-color: #fff;
        width: 380px;
        height: 500px;
        box-shadow: 0 2px 10px #999;
        padding: 40px;
        .loginin {
            width: 100%;
            height: 35px;
            background: #1aac19;
            color: #fff;
            line-height: 35px;
            text-align: center;
            margin-top: 10px;
            &:hover {
                background: #138313;
            }
            border: 1px solid #777;
            outline: none;
        }
        .el-input {
            width: 100%;
        }
        .photos {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .item {
                width: 40px;
                height: 40px;
                &.active {
                    border: 1px solid #1aac19;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
.room-main {
    width: 100%;
    height: 100%;
    display: flex;
    .room-left {
        width: 200px;
        background: #e2e2e2;
        display: flex;
        flex-direction: column;
        .oneuser.header{
            background: #efebe8;
        }
        .oneuser {
            height: 50px;
            padding: 5px;
            display: flex;
   
            img {
                width: 40px;
                height: 40px;
                border-radius: 3px;
            }
            .name {
                flex: 1;
                padding-left: 10px;
                font-size: 13px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .alluser {
            background: #dcdcdc;
            flex: 1;
            .oneuser{
                &:hover{
                    background: #c5c5c5;
                }
            }
        }
    }
    .room-right {
        flex: 1;
        background: #fefefe;
        display: flex;
        flex-direction: column;
        .room-header {
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: #f5f5f5;
            border-bottom: 1px solid #e8e8e8;
        }
        .room-top {
            flex: 1;
            overflow: auto;
            padding: 10px;
            background: #f5f5f5;
            .userlist {
                width: 100%;
                .item {
                    width: 100%;
                    margin-top: 10px;
                }
                .adduser {
                    color: #fff;
                    font-size: 12px;
                    text-align: center;
                    .font {
                        background: #dddddd;
                        border-radius: 3px;
                        display: inline-block;
                        padding: 2px 5px;
                    }
                }
                .msg {
                    color: darkgreen;
                    width: 100%;
                }
                .removeuser {
                    color: #d6a37f;
                    font-size: 12px;
                    text-align: center;
                    .font {
                        background: #dddddd;
                        border-radius: 3px;
                        display: inline-block;
                        padding: 2px 5px;
                    }
                }
                .loginuser {
                    text-align: right;
                }
                .usermsgs{
                    img.photo{
                        width: 35px;
                        height: 35px;
                    }
                    .msginfo{
                        background: #fff;
                    }
                }
            }
        }
        .room-bottom {
            height: 100px;
            border-top: 1px solid #ddd;
        }
    }
}
</style>
<style>
.entermsg {
    width: 100%;
    height: 100%;
}
.entermsg textarea {
    border: none !important;
    outline: none !important;
}
</style>
