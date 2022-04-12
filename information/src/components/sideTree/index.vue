<template>
	<div class="sideTree">
		<n-scrollbar style="max-height: 100%">
			<n-menu
				ref="menuInstRef"
				:default-value="muneActive"
				:default-expanded-keys="muneActiveArr"
				:options="menuOptions"
				:accordion="true"
				:root-indent="20"
				:indent="40"
				@update:value="handleUpdateValue"
			/>
		</n-scrollbar>
	</div>
</template>

<script lang="ts" setup>
// vue
import { onMounted, reactive, h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
// naive-ui
import { NIcon } from 'naive-ui';
import {
	Umbrella as Umbrella,
	BulbSharp as BulbSharp,
	ShieldCheckmark as ShieldCheckmark,
	Person as Person,
	Folder as Folder,
} from '@vicons/ionicons5';
// api
import api from '../../axios/api/login/index';
// 菜单激活
const muneActive = ref('');
const muneActiveArr = ref([]);
// 渲染icon
function renderIcon(icon: any) {
	return () => h(NIcon, null, { default: () => h(icon) });
}
// route
const router: any = useRouter();
let store = useStore();
/**
 * state
 */
const menuOptions: any = ref([
	{
		label: '一企一档',
		key: 'Risk control',
		icon: renderIcon(Umbrella),
		disabled: false,
		children: [
			{
				label: '企业档案清单',
				key: 'enterpriseArchives',
				path: '/enterpriseArchives',
			},
			{
				label: '企业基本信息',
				key: 'essentialInformation',
				path: '/essentialInformation',
			},
			{
				label: '车间管理',
				key: 'workshopManagement',
				path: '/workshopManagement',
			},
			{
				label: '仓库管理',
				key: 'warehouseManagement',
				path: '/warehouseManagement',
			},
			{
				label: '企业物料管理',
				key: 'materialManagement',
				path: '/materialManagement',
			},
			{
				label: '安全设施管理',
				key: 'facilityManagement',
				path: '/facilityManagement',
			},
			{
				label: '经营信息管理',
				key: 'informationManagement',
				path: '/informationManagement',
			},
		],
	},
	{
		label: '政企互动',
		key: 'Two major and one key',
		icon: renderIcon(BulbSharp),
		children: [
			{
				label: '发文管理',
				key: 'documentManagement',
				path: '/documentManagement',
			},
			{
				label: '我的消息',
				key: 'myNews',
				path: '/myNews',
			},
			{
				label: '历史发文',
				key: 'historicalDocuments',
				path: '/historicalDocuments',
			},
		],
	},
	{
		label: '统计分析',
		key: 'Two major and one key',
	},
]);
/**
 * methods
 */
const handleUpdateValue = (key: string, item: any) => {
	console.log('key =>', key);
	console.log('item =>', item);
	item.path &&
		router.push({
			path: item.path,
		});
};

onMounted(() => {
	api.getUserInfo().then((res: any) => {
		// let muneList: Array<any> = []
		console.log('用户信息', res);
		if (res.data.roleName == '企业用户' || res.data.roleName == '企业管理员') {
			menuOptions.value = [
				{
					label: '一企一档',
					key: 'Risk control',
					icon: renderIcon(Umbrella),
					disabled: false,
					children: [
						{
							label: '企业基本信息',
							key: 'essentialInformation',
							path: '/essentialInformation',
						},
						{
							label: '车间管理',
							key: 'workshopManagement',
							path: '/workshopManagement',
						},
						{
							label: '仓库管理',
							key: 'warehouseManagement',
							path: '/warehouseManagement',
						},
						{
							label: '企业物料管理',
							key: 'materialManagement',
							path: '/materialManagement',
						},
						{
							label: '安全设施管理',
							key: 'facilityManagement',
							path: '/facilityManagement',
						},
						{
							label: '经营信息管理',
							key: 'informationManagement',
							path: '/informationManagement',
						},
					],
				},
				{
					label: '政企互动',
					key: 'Two major and one key',
					icon: renderIcon(BulbSharp),
					children: [
						{
							label: '发文管理',
							key: 'documentManagement',
							path: '/documentManagement',
						},
						{
							label: '我的消息',
							key: 'myNews',
							path: '/myNews',
						},
						{
							label: '历史发文',
							key: 'historicalDocuments',
							path: '/historicalDocuments',
						},
					],
				},
				{
					label: '统计分析',
					key: 'Two major and one key',
				},
			];
			router.push({
				path: '/essentialInformation',
			});
		} else {
			menuOptions.value = [
				{
					label: '一企一档',
					key: 'Risk control',
					icon: renderIcon(Umbrella),
					disabled: false,
					children: [
						{
							label: '企业档案清单',
							key: 'enterpriseArchives',
							path: '/enterpriseArchives',
						},
						// {
						// 	label: '企业基本信息',
						// 	key: 'essentialInformation',
						// 	path: '/essentialInformation',
						// },
						{
							label: '车间管理',
							key: 'workshopManagement',
							path: '/workshopManagement',
						},
						{
							label: '仓库管理',
							key: 'warehouseManagement',
							path: '/warehouseManagement',
						},
						{
							label: '企业物料管理',
							key: 'materialManagement',
							path: '/materialManagement',
						},
						{
							label: '安全设施管理',
							key: 'facilityManagement',
							path: '/facilityManagement',
						},
						{
							label: '经营信息管理',
							key: 'informationManagement',
							path: '/informationManagement',
						},
					],
				},
				{
					label: '政企互动',
					key: 'Two major and one key',
					icon: renderIcon(BulbSharp),
					children: [
						{
							label: '发文管理',
							key: 'documentManagement',
							path: '/documentManagement',
						},
						{
							label: '我的消息',
							key: 'myNews',
							path: '/myNews',
						},
						{
							label: '历史发文',
							key: 'historicalDocuments',
							path: '/historicalDocuments',
						},
					],
				},
				{
					label: '统计分析',
					icon: renderIcon(Umbrella),
					key: 'Two major and one key',
				},
			];
		}
	});
});
</script>
<style lang="postcss" scoped>
.sideTree {
	width: 250px;
	height: 94%;
	color: #fff !important;
	> div {
		width: 100%;
		font-size: 16px !important;
	}
	::v-deep(.n-menu) {
		.n-base-icon,
		.n-menu-item-content__arrow {
			color: #fff !important;
		}
		.imgIconDiv {
			width: 22px;
			height: 22px;
			position: relative;
			bottom: 4px;
			.imgIcon {
				width: 100%;
				height: 100%;
			}
		}
		.n-menu-item-content {
			margin: 0 10px;
		}
		.n-menu-item-content:not(.n-menu-item-content--disabled):hover::before {
			background-color: transparent;
		}
		.n-menu-item-content.n-menu-item-content--selected::before{
			background-color: transparent;
		}
		.n-menu-item-content.n-menu-item-content--selected .n-menu-item-content-header{
			color: #1e9fff;
		}
		.n-menu-item--selected {
			background: linear-gradient(134deg, #65bdff 2%, #1e9fff 96%);
			border-radius: 10px;
			.n-menu-item-content-header {
				color: #fff !important;
			}
		}
		.n-submenu {
			.n-menu-item--selected {
				background: none;
				.n-menu-item-content-header {
					color: #1e9fff !important;
				}
			}
			.n-menu-item-content--child-active {
				background: linear-gradient(134deg, #65bdff 2%, #1e9fff 96%);
				border-radius: 10px;
				.n-menu-item-content-header {
					color: #fff !important;
				}
			}
		}
	}
}

.n-menu .n-menu-item.n-menu-item--selected::before {
	background-color: #ffff !important;
}
</style>
