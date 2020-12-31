import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // socketIo 参数
        showmasker: true,
        loginInfo: {
            path: "",
            username: "",
            userphoto: "",
        },
        dataList: [],
        webusers: { users: [] },
    },
    mutations: {},
    actions: {},
});
