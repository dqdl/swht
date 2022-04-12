<!--
 * @Author: liyuan
 * @Date: 2022-01-19 14:04:13
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:09:15
 * @FilePath: \swyqxt\basic\src\App.vue
-->


<template>
    <n-message-provider :max="1">
        <n-dialog-provider>
            <content />
            <router-view></router-view>
        </n-dialog-provider>
    </n-message-provider>
</template>
<script setup lang="ts">
import content from "./pages/content/content.vue";
</script>
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
    width: 100%;
    /* min-height: 1080px; */
    /* min-width: 1200px; */
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
    background: linear-gradient(135deg, #46596d 0%, #1d2731 100%);
}
</style>