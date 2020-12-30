<template>
    <div class="ChatRoom">fdsa </div>
</template>

<script>

export default {
    name: "ChatRoom",
    mounted(){
         this.$io.emit("chat message", "dd");
    },
};
</script>
