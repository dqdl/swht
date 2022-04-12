import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	// 默认login
	{
		path: '/',
		component: () => import('@/login/Index.vue'),
		redirect: '/login',
		children: [
			{
				path: '/login',
				component: () => import('@/login/login/LoginMain.vue'),
			},
			{
				path: '/changepwd',
				component: () => import('@/login/changepwd/changePwd.vue'),
			},
		],
	},
	// login
	{
		path: '/login',
		component: () => import('@/login/Index.vue'),
		redirect: '/login',
		children: [
			{
				path: '/login',
				component: () => import('@/login/login/LoginMain.vue'),
			},
			{
				path: '/changepwd',
				component: () => import('@/login/changepwd/changePwd.vue'),
			},
			{
				path: '/resetpwd',
				component: () => import('@/login/resetpwd/resetPwd.vue'),
			},
		],
	},
	{
		path: '/toggle',
		component: () => import('@/view/toggleSystems/index.vue'),
	},
	{
		path: '/index',
		component: () => import('@/view/Index.vue'),
		redirect: '/riskIdentification',
		children: [
			// 风险点辨识
			{
				path: '/riskIdentification',
				name: '/riskIdentification',
				component: () =>
					import(
						'@/view/riskControl/riskIdentification/riskIdentification.vue'
					),
			},
			// 风险点分级管控
			{
				path: '/riskClassification',
				name: 'riskClassification',
				component: () =>
					import(
						'@/view/riskControl/riskClassification/riskClassification.vue'
					),
			},
			// 较大风险清单
			{
				path: '/moreRisk',
				name: 'moreRisk',
				component: () => import('@/view/riskControl/moreRisk/moreRisk.vue'),
			},
			// 风险统计分析
			{
				path: '/riskStatistics',
				name: 'riskStatistics',
				component: () =>
					import('@/view/riskControl/riskStatistics/riskStatistics.vue'),
			},
			// 重点监管化学品
			{
				path: '/chemical',
				name: 'chemical',
				component: () => import('@/view/keyAndMajor/chemical/chemical.vue'),
			},
			// 重点监管危险化工工艺
			{
				path: '/dangerChemicalProcess',
				name: 'dangerChemicalProcess',
				component: () =>
					import(
						'@/view/keyAndMajor/dangerChemicalProcess/dangerChemicalProcess.vue'
					),
			},
			// 重大危险源
			{
				path: '/dangerSource',
				name: 'dangerSource',
				component: () =>
					import('@/view/keyAndMajor/dangerSource/dangerSource.vue'),
			},
			// 隐患排查
			{
				path: '/hiddenDangerInvestigation',
				name: 'hiddenDangerInvestigation',
				component: () =>
					import(
						'@/view/safetySupervision/hiddenDangerInvestigation/hiddenDangerInvestigation.vue'
					),
			},
			// 安全备案
			{
				path: '/safetyRecord',
				name: 'safetyRecord',
				component: () =>
					import('@/view/safetySupervision/safetyRecord/safetyRecord.vue'),
			},
			// 危险作业备案
			{
				path: '/dangerOperationRecord',
				name: 'dangerOperationRecord',
				component: () =>
					import(
						'@/view/safetySupervision/dangerOperationRecord/dangerOperationRecord.vue'
					),
			},
			// 巡检任务
			{
				path: '/inspectionTask',
				name: 'inspectionTask',
				component: () =>
					import('@/view/safetyInspection/inspectionTask/inspectionTask.vue'),
			},
			// 园区巡检计划
			{
				path: '/parkPatrolPlan',
				name: 'parkPatrolPlan',
				component: () =>
					import('@/view/safetyInspection/parkPatrolPlan/parkPatrolPlan.vue'),
			},
			// 企业巡检计划
			{
				path: '/enterprisePatrolPlan',
				name: 'enterprisePatrolPlan',
				component: () =>
					import(
						'@/view/safetyInspection/enterprisePatrolPlan/enterprisePatrolPlan.vue'
					),
			},
			// 法律法规
			{
				path: '/lawsAndRegulations',
				name: 'lawsAndRegulations',
				component: () =>
					import(
						'@/view/knowledgeBase/lawsAndRegulations/lawsAndRegulations.vue'
					),
			},
			// 化学品目录
			{
				path: '/chemicalCatalogue',
				name: 'chemicalCatalogue',
				component: () =>
					import(
						'@/view/knowledgeBase/chemicalCatalogue/chemicalCatalogue.vue'
					),
			},
		],
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});
/**
 * 路由守卫
 */
const whiteList: Array<string> = ['/login', '/changepwd', '/resetpwd'];
const token = () => window.sessionStorage.getItem('token') || null;
router.beforeEach(async (to, from, next) => {
	if (token()) {
		return next();
	} else {
		if (whiteList.includes(to.path)) {
			return next();
		} else {
			next(`/login`);
		}
	}
});

export default router;
