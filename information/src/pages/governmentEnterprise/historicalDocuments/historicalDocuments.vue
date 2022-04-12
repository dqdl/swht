<template>
	<div class="historicalDocuments">
		<aside class="aside">
			<!-- <div class="everItem" v-for="(item,index)  of  sideTitles" :key="item.id">
                {{item.name}}
            </div>-->
			<n-menu :options="menuOptions" />
		</aside>
		<main class="main">
			<committeeNews v-if="currenCalss === 'committee'"></committeeNews>
			<enterpriseNews v-if="currenCalss === 'enterprise'"></enterpriseNews>
			<noticeNews v-if="currenCalss === 'notice'"></noticeNews>
		</main>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, h, ref } from 'vue';
import { NIcon, zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import { RouterLink } from 'vue-router';
import {
	LaptopOutline as WorkIcon,
	LogOutOutline as HomeIcon,
} from '@vicons/ionicons5';
import committeeNews from '@/pages/governmentEnterprise/historicalDocuments/comp/committeeNews.vue';
import enterpriseNews from '@/pages/governmentEnterprise/historicalDocuments/comp/enterpriseNews.vue';
import noticeNews from '@/pages/governmentEnterprise/historicalDocuments/comp/noticeNews.vue';
function renderIcon(icon: any) {
	return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {},
					onClick: () => (currenCalss.value = 'committee'),
				},
				{ default: () => '管委会发文' }
			),
		key: 'go-back-home',
		icon: renderIcon(HomeIcon),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {},
					onClick: () => (currenCalss.value = 'enterprise'),
				},
				{ default: () => '企业上报' }
			),
		key: 'go-to-work',
		icon: renderIcon(WorkIcon),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {},
					onClick: () => (currenCalss.value = 'notice'),
				},
				{ default: () => '政企通知' }
			),
		key: 'go-to-enterpise',
		icon: renderIcon(HomeIcon),
	},
];

// 当前类别
let currenCalss: any = ref('committee');
// 查询条件
const queryInfo: any = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
	time: null,
	title: '',
	name: 'xxx',
});

// 查询方法
const query = () => {};

// 重置方法
const reset = () => {};
</script>

<style lang="postcss" scoped>
.historicalDocuments {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	& > .aside {
		width: 15%;
		font-size: 24px;
		color: #000;
		font-weight: bold;
		line-height: 50px;
		background: #fff;
		border-radius: 10px;
		padding-top: 20px;
		& > .everItem {
			font-size: 16px;
			color: black;
		}
	}
	& > .main {
		width: 83%;
		/* background: #fff; */
		border-radius: 10px;
		.top {
			height: 170px;
			.query {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				/* align-items: center; */
				padding: 40px 20px;
				.left {
					display: flex;
					> div {
						display: flex;
						align-items: center;
						margin-right: 40px;
					}
				}
				.right {
					margin-left: 76px;
				}
			}
		}
	}
}
</style>
