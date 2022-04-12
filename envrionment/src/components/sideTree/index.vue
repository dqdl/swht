<template>
	<div class="sideTree">
		<n-menu
			:default-value="muneActive"
			:value="muneActive"
			:default-expanded-keys="muneActive"
			:options="menuOptions"
			:default-expand-all="false"
			:root-indent="20"
			:indent="40"
			accordion
			@update:value="handleUpdateValue"
		/>
	</div>
</template>

<script lang="ts" setup>
// vue
import { reactive, h, ref } from 'vue';
import { useRouter } from 'vue-router';

// naive-ui
import { NIcon } from 'naive-ui';
import {
	Umbrella as Umbrella,
	BulbSharp as BulbSharp,
	ShieldCheckmark as ShieldCheckmark,
	Person as Person,
	Folder as Folder,
} from '@vicons/ionicons5';
// 菜单激活
const muneActive = ref('parkDetection');
const muneActiveArr = ref([]);
// 渲染icon
function renderIcon(icon: any) {
	return () => h(NIcon, null, { default: () => h(icon) });
}
// route
const router: any = useRouter();
/**
 * state
 */
const menuOptions = reactive([
	{
		label: '环境检测预警',
		key: 'environmentalDetection',
		icon: renderIcon(Umbrella),
		disabled: false,
		children: [
			{
				label: '企业排污口检测',
				key: 'enterpriseDetection',
				path: '/enterpriseDetection',
			},
			{
				label: '大气检测',
				key: 'parkDetection',
				path: '/parkDetection',
			},
		],
	},
	{
		label: '在线监测告警',
		key: 'environmentalInspection',
		disabled: false,
		icon: renderIcon(BulbSharp),
		children: [
			{
				label: '雨污排水口告警管理',
				key: 'enterpriseAlarm',
				path: '/enterpriseAlarm',
			},
			{
				label: '区域大气检测告警管理',
				key: 'parkAlarm',
				path: '/parkAlarm',
			},
		],
	},
	{
		label: '环保巡检',
		key: 'basicDataaaa',
		disabled: false,
		icon: renderIcon(Umbrella),
		children: [
			{
				label: '新增计划',
				key: 'parkPatrolPlan',
				path: '/parkPatrolPlan',
			},
			{
				label: '企业巡检计划',
				key: 'enterprisePatrolPlan',
				path: '/enterprisePatrolPlan',
			},
			{
				label: '巡检任务',
				key: 'inspectionTask',
				path: '/inspectionTask',
			},
		],
	},
	{
		label: '基础数据资源',
		key: 'basicData',
		disabled: false,
		icon: renderIcon(Umbrella),
		children: [
			{
				label: '雨污排水口检测管理',
				key: 'enterpriseManagement',
				path: '/enterpriseManagement',
			},
			{
				label: '区域大气检测管理',
				key: 'airManagement',
				path: '/airManagement',
			},
		],
	},
]);
/**
 * methods
 */
const handleUpdateValue = (key: string, item: any) => {
	muneActive.value = item.key;
	// console.log('key =>', key)
	// console.log('item =>', item)
	item.path &&
		router.push({
			path: item.path,
		});
};
</script>
<style lang="postcss" scoped>
.sideTree {
	width: 280px;
	height: calc(100% - 80px);
	color: #fff !important;
	> div {
		width: 100%;
		font-size: 16px;
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
