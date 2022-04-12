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
const muneActive = ref('riskIdentification');
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
		label: '风险管控',
		key: 'riskControl',
		icon: renderIcon(Umbrella),
		disabled: false,
		children: [
			{
				label: '风险点辨识',
				key: 'riskIdentification',
				path: '/riskIdentification',
			},
			{
				label: '风险点分级管控',
				key: 'riskClassification',
				path: '/riskClassification',
			},
			{
				label: '较大风险清单',
				key: 'moreRisk',
				path: '/moreRisk',
			},
			{
				label: '风险统计分析',
				key: 'riskStatistics',
				path: '/riskStatistics',
			},
		],
	},
	{
		label: '两重点一重大',
		key: 'keyAndMajor',
		disabled: false,
		icon: renderIcon(BulbSharp),
		children: [
			{
				label: '重点监管化学品',
				key: 'chemical',
				path: '/chemical',
			},
			{
				label: '重点监管危险化工工艺',
				key: 'dangerChemicalProcess',
				path: '/dangerChemicalProcess',
			},
			{
				label: '重大危险源',
				key: 'dangerSource',
				path: '/dangerSource',
			},
		],
	},
	{
		label: '安全监管',
		key: 'safetySupervision',
		disabled: false,
		icon: renderIcon(Umbrella),
		children: [
			{
				label: '隐患排查',
				key: 'hiddenDangerInvestigation',
				path: '/hiddenDangerInvestigation',
			},
			{
				label: '安全备案',
				key: 'safetyRecord',
				path: '/safetyRecord',
			},
			{
				label: '危险作业备案',
				key: 'dangerOperationRecord',
				path: '/dangerOperationRecord',
			},
		],
	},
	{
		label: '安全巡检',
		key: 'safetyInspection',
		disabled: false,
		icon: renderIcon(BulbSharp),
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
		label: '知识库',
		key: 'knowledgeBase',
		icon: renderIcon(BulbSharp),
		children: [
			{
				label: '法律法规',
				key: 'lawsAndRegulations',
				path: '/lawsAndRegulations',
			},
			{
				label: '化学品目录',
				key: 'chemicalCatalogue',
				path: '/chemicalCatalogue',
			},
		],
	},
]);
/**
 * methods
 */
const handleUpdateValue = (key: string, item: any) => {
	console.log(item);
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
	width: 250px;
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
