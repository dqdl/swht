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
		redirect: '/parkDetection',
		children: [
			// 园区大气检测
			{
				path: '/parkDetection',
				name: '/parkDetection',
				component: () =>
					import(
						'@/view/environmentalDetection/parkDetection/parkDetection.vue'
					),
			},
			// 企业雨污排水口检测
			{
				path: '/enterpriseDetection',
				name: 'enterpriseDetection',
				component: () =>
					import(
						'@/view/environmentalDetection/enterpriseDetection/enterpriseDetection.vue'
					),
			},
			// 园区大气检测告警
			{
				path: '/parkAlarm',
				name: 'parkAlarm',
				component: () =>
					import('@/view/environmentalInspection/parkAlarm/parkAlarm.vue'),
			},
			// 企业雨污排水口告警
			{
				path: '/enterpriseAlarm',
				name: 'enterpriseAlarm',
				component: () =>
					import(
						'@/view/environmentalInspection/enterpriseAlarm/enterpriseAlarm.vue'
					),
			},
			// 企业雨污排水口管理
			{
				path: '/enterpriseManagement',
				name: 'enterpriseManagement',
				component: () =>
					import(
						'@/view/basicData/enterpriseManagement/enterpriseManagement.vue'
					),
			},
			// 大气检测管理
			{
				path: '/airManagement',
				name: 'airManagement',
				component: () =>
					import('@/view/basicData/airManagement/airManagement.vue'),
			},
			// 规划区域污染物管理
			{
				path: '/areaManagement',
				name: 'areaManagement',
				component: () =>
					import('@/view/basicData/areaManagement/areaManagement.vue'),
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
