<template>
	<div class="documentManagement">
		<aside class="aside">
			<!-- <div class="everItem" v-for="(item,index)  of  sideTitles" :key="item.id">
                {{item.name}}
            </div>-->
			<n-menu :options="menuOptions" />
		</aside>
		<main class="main">
			<router-view></router-view>
		</main>
	</div>
</template>

/** 发文管理 */
<script lang="ts" setup>
import { defineComponent, reactive, h } from 'vue';
import { NIcon } from 'naive-ui';
import { RouterLink } from 'vue-router';

import router from '../../../router';

import {
	LaptopOutline as WorkIcon,
	LogOutOutline as HomeIcon,
} from '@vicons/ionicons5';

function renderIcon(icon: any) {
	return () => h(NIcon, null, { default: () => h(icon) });
}

interface SideTypes {
	name: string;
	id: string;
}

const sideTitles: SideTypes[] = reactive([
	{
		name: '管委会发文',
		id: '1',
	},
	{
		name: '企业上报',
		id: '2',
	},
	{
		name: '政企通知',
		id: '3',
	},
	{
		name: '我的草稿',
		id: '4',
	},
]);

// 路由跳转
const handleRouterJump = (name: string) => {
	router.push({
		name: name,
	});
};

const menuOptions = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						name: 'ManagementCommittee',
						params: {
							lang: 'zh-CN',
							path: './subVue/ManagementCommittee.vue',
						},
					},
					onClick: () => handleRouterJump('ManagementCommittee'),
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
					to: {
						// path: '/zh-CN/os-theme/components/code'
					},
					onClick: () => handleRouterJump('EnterpriseReporting'),
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
					to: {
						// path: '/zh-CN/os-theme/components/code'
					},
					onClick: () => handleRouterJump('GovernmentEnterpriseNotice'),
				},
				{ default: () => '政企通知' }
			),
		key: 'go-to-enterpise',
		icon: renderIcon(HomeIcon),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {
						// path: '/zh-CN/os-theme/components/code'
					},
					onClick: () => handleRouterJump('MyDraft'),
				},
				{ default: () => '我的草稿' }
			),
		key: 'go-to-draft',
		icon: renderIcon(HomeIcon),
	},
];
</script>

<style lang="postcss" scoped>
@import './scss/documentManagement.scss';
</style>
