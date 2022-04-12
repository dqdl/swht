<template>
	<div class="essentialInformation">
		<enterprise :edit-flag="editFlag"></enterprise>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import blueTitle from '@components/public/title/index.vue';
import enterprise from '@components/enterpriseInformation/index.vue';
// 编辑flag
let editFlag: any = ref(true);
// 公司名
</script>

<style lang="postcss" scoped>
.essentialInformation {
	width: 100%;
	font-size: 16px;
	.listContent {
		margin-bottom: 20px;
		width: 100%;
		height: 50px;
		border-radius: 10px;
		background: #fff;
		> :first-child {
			margin-right: 20px;
			float: right;
		}
	}
}
</style>
