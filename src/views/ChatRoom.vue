<template>
    <div class="ChatRoom">
        <div class="loginmasker" v-if="showmasker">
            <el-input type="text" size="mini" v-model="username"></el-input>
            <el-button type="primary" size="mini" @click="login"
                >进入</el-button
            >
        </div>
        <div class="room-main">
            <div class="room-left"></div>
            <div class="room-right">
                <div class="room-top">
                    <ul class="userlist">
                        <li
                            class="item"
                            v-for="(item, index) in dataList"
                            :key="index"
                            :class="{
                                adduser: item.type == 1,
                                msg: item.type == 2,
                                removeuser: item.type == 3,
                            }"
                        >
                            {{ item.msg }}
                        </li>
                    </ul>
                </div>
                <div class="room-bottom">
                    <el-input
                        type="textarea"
                        class="entermsg"
                        v-model="sendmsgdata"
                        @keyup.enter.native="sendmsg"
                        rows="4"
                    ></el-input>
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
            showmasker: true,
            username: "",
            sendmsgdata: "",
            dataList: [],
        };
    },
    methods: {
        login() {
            if (this.username) {
                let data = {
                    username: this.username,
                    type: "login",
                };
                this.$io.emit("chat message", data);
                this.showmasker = false;
            } else {
                this.$message({
                    message: "请输入名称!",
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
        },
    },
    mounted() {
        this.$io.on("chat message", (data) => {
            this.dataList.push(data);
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
    .el-input {
        float: left;
        width: 300px;
    }
}
.room-main {
    width: 600px;
    height: 500px;
    display: flex;
    .room-left {
        width: 150px;
        background: #e2e2e2;
    }
    .room-right {
        flex: 1;
        background: #fefefe;
        display: flex;
        flex-direction: column;
        .room-top {
            flex: 1;
            overflow: auto;
            .userlist {
                width: 100%;
                .item {
                    width: 100%;
                }
                .adduser {
                    color: coral;
                }
                .msg {
                    color: darkgreen;
                }
                .removeuser {
                    color: darkred;
                }
            }
        }
        .room-bottom {
            height: 100px;
            border-top: 1px solid #ddd;
            .entermsg {
                width: 100%;
                height: 100%;
                height: 300px;
            }
        }
    }
}
</style>
