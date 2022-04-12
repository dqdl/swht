<template>
	<Header></Header>
	<sideTree class="side"></sideTree>
	<div class="content">
		<router-view></router-view>
	</div>
</template>

<script lang="ts" setup>
import Header from '@/components/header/header.vue';
import sideTree from '@/components/sideTree/index.vue';
</script>

<style lang="postcss" scoped>
.content {
	position: absolute;
	top: 80px;
	left: 250px;
	width: 1670px;
	height: calc(100% - 80px);
	padding: 40px;
	background-color: #eaf2f7;
	border-top-left-radius: 30px;
}
</style>
