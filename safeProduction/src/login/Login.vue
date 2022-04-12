<template>
	<button @click="login">登录</button>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const login = () => {
	router.push('/riskIdentification');
	window.$message.success('测试测试');
};
</script>

<style lang="postcss" scoped></style>
