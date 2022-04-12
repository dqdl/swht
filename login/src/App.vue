<script setup lang="ts">
</script>

<template>
    <router-view></router-view>
</template>

<style lang="postcss">
@import "./assets/style/public.postcss";

html,
body {
    height: 100%;
    width: 100%;
}

#app {
    position: relative;
    height: 100%;
    /* width: 100%; */
    min-height: 1080px;
    min-width: 1200px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
    background: linear-gradient(135deg, #46596d 0%, #1d2731 100%);
}
</style>