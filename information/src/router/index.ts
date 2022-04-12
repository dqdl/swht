/*
 * @Author: zyl
 * @LastEditTime: 2022-01-06 15:34:00
 * @Description:
 */
import { createRouter, createWebHashHistory, Router } from 'vue-router';
import store from '../store/index';
const Community = () =>
	import(
		'../pages/governmentEnterprise/documentManagement/subVue/ManagementCommittee.vue'
	);

const routers = [
	// 默认login
	{
		path: '/',
		component: () => import('../pages/login/Index.vue'),
		redirect: '/login',
		children: [
			{
				path: '/login',
				component: () => import('../pages/login/login/LoginMain.vue'),
			},
			{
				path: '/changepwd',
				component: () => import('../pages/login/changepwd/changePwd.vue'),
			},
		],
	},
	// login
	{
		path: '/login',
		component: () => import('../pages/login/Index.vue'),
		redirect: '/login',
		children: [
			{
				path: '/login',
				component: () => import('../pages/login/login/LoginMain.vue'),
			},
			{
				path: '/changepwd',
				component: () => import('../pages/login/changepwd/changePwd.vue'),
			},
			{
				path: '/resetpwd',
				component: () => import('../pages/login/resetpwd/resetPwd.vue'),
			},
		],
	},
	{
		path: '/toggle',
		component: () => import('../pages/toggleSystems/index.vue'),
	},
	// basic_system
	{
		path: '/index',
		component: () => import('../pages/main/Index.vue'),
		redirect: '/enterpriseArchives',
		children: [
			// 企业档案清单
			{
				path: '/enterpriseArchives',
				name: '/enterpriseArchives',
				component: () =>
					import(
						'../pages/enterpriseFile/enterpriseArchives/enterpriseArchives.vue'
					),
			},
			// {
			//     path: '/riskPoint',
			//     name: '/riskPoint',
			//     component: () => import('../pages/riskPoint/index.vue')
			// },
			// 企业基本信息
			{
				path: '/essentialInformation',
				name: '/essentialInformation',
				component: () =>
					import(
						'../pages/enterpriseFile/essentialInformation/essentialInformation.vue'
					),
			},
			// 车间管理
			{
				path: '/workshopManagement',
				name: '/workshopManagement',
				component: () =>
					import(
						'../pages/enterpriseFile/workshopManagement/workshopManagement.vue'
					),
			},
			// 仓库管理
			{
				path: '/warehouseManagement',
				name: '/warehouseManagement',
				component: () =>
					import(
						'../pages/enterpriseFile/warehouseManagement/warehouseManagement.vue'
					),
			},
			// 企业物料管理
			{
				path: '/materialManagement',
				name: '/materialManagement',
				component: () =>
					import(
						'../pages/enterpriseFile/materialManagement/materialManagement.vue'
					),
			},
			// 安全设施管理
			{
				path: '/facilityManagement',
				name: '/facilityManagement',
				component: () =>
					import(
						'../pages/enterpriseFile/facilityManagement/facilityManagement.vue'
					),
			},
			// 经营信息管理
			{
				path: '/informationManagement',
				name: '/informationManagement',
				component: () =>
					import(
						'../pages/enterpriseFile/informationManagement/informationManagement.vue'
					),
			},
			// 发文管理
			{
				path: '/documentManagement',
				name: '/documentManagement',
				component: () =>
					import(
						'../pages/governmentEnterprise/documentManagement/documentManagement.vue'
					),
				redirect: '/ManagementCommittee',
				children: [
					{
						path: '/ManagementCommittee',
						name: 'ManagementCommittee',
						component: () =>
							import(
								'../pages/governmentEnterprise/documentManagement/subVue/ManagementCommittee.vue'
							),
						// component:Community
					},
					{
						path: '/EnterpriseReporting',
						name: 'EnterpriseReporting',
						component: () =>
							import(
								'../pages/governmentEnterprise/documentManagement/subVue/EnterpriseReporting.vue'
							),
					},
					{
						path: '/GovernmentEnterpriseNotice',
						name: 'GovernmentEnterpriseNotice',
						component: () =>
							import(
								'../pages/governmentEnterprise/documentManagement/subVue/GovernmentEnterpriseNotice.vue'
							),
					},
					{
						path: '/MyDraft',
						name: 'MyDraft',
						component: () =>
							import(
								'../pages/governmentEnterprise/documentManagement/subVue/MyDraft.vue'
							),
					},
				],
			},
			// 我的消息
			{
				path: '/myNews',
				name: '/myNews',
				component: () =>
					import('../pages/governmentEnterprise/myNews/myNews.vue'),
			},
			// 历史发文
			{
				path: '/historicalDocuments',
				name: '/historicalDocuments',
				component: () =>
					import(
						'../pages/governmentEnterprise/historicalDocuments/historicalDocuments.vue'
					),
			},
		],
	},
];

const router: Router = createRouter({
	history: createWebHashHistory(),
	routes: routers,
});
// const routerPackag = (routers: any, name?: any) => {
//     routers.filter((itemRouter: any) => {
//         if (itemRouter.component === 'userManagement') {
//             itemRouter.component = userManagement
//         } else if (itemRouter.component === 'organizeManagement') {
//             itemRouter.component = organizeManagement
//         } else if (itemRouter.component === 'basicInformationManagement') {
//             itemRouter.component = basicInformationManagement
//         } else {
//             itemRouter.component = modules[`../pages/${itemRouter.component}.vue`]
//         }
//         router.addRoute(name, {
//             path: `${itemRouter.path}`,
//             name: itemRouter.name,
//             meta: itemRouter.meta,
//             component: itemRouter.component
//         });
//         if (itemRouter.children && itemRouter.children.length) {
//             routerPackag(itemRouter.children, name);
//         }
//         return true;
//     });
// };
const whiteList: Array<string> = ['/login', '/changepwd', '/resetpwd'];
const token = () => window.sessionStorage.getItem('token') || null;
router.beforeEach(async (to, from, next) => {
	if (token()) {
		// if (!(store.state as { user: any }).user.isLogin) {
		//     await store.dispatch('mune/getMune').then(res => {
		//         store.commit("user/UPDATE_LOGIN", true);
		//         if (res.muneList) {
		//             router.addRoute(res.sdataRouter);
		//             routerPackag(res.muneList, res.sdataRouter.name)
		//             next({ ...to, replace: true })
		//         } else {
		//             sessionStorage.removeItem("token")
		//             next(`/login`)
		//         }
		//     })
		// } else if ((store.state as { user: any }).user.isLogin) {
		//     return next();
		// }
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
