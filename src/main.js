import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/style/index.scss";
import dayjs from "dayjs";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

// import SocketIO from 'socket.io-client';
// import VueSocketIO from "vue-socket.io";

Vue.prototype.$io = io("http://localhost:3001");

Vue.prototype.dayjs = dayjs;
Vue.config.productionTip = false;

// 是否为测试环境
Vue.prototype.$istest = process.env.VUE_APP_CURRENTMODE === "test";

console.log("当前NODE_ENV：" + process.env.NODE_ENV);
console.log("当前VUE_APP_CURRENTMODE：" + process.env.VUE_APP_CURRENTMODE);
console.log("是否为测试环境：" + Vue.prototype.$istest);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
