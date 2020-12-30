<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
            <router-link to="/chatroom">ChatRoom</router-link>
        </div>
        <router-view class="app-view" :style="{ height: windowHeight - 40 + 'px' }" />
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            windowHeight: window.innerHeight,
        };
    },
    mounted(){
      console.log(this.dayjs(new Date(1528361259484)).format())
    }
};
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
#nav {
    padding: 10px 20px;
    height: 40px;
    a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
.app-view {
    background: #f2f2f2
}
</style>
