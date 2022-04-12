import rule from '../../axios/api/login/index';
// import main from "../../pages/main/Index.vue";
export default {
	namespaced: true,
	state: {
		muneList: [],
		systemList: [],
	},
	mutations: {
		GET_MUNE(state: any, data: Array<any>) {
			state.muneList = data;
		},
		GET_SYSTEM(state: any, data: Array<any>) {
			state.systemList = data;
		},
	},
	actions: {
		getMune(context: any) {
			return new Promise((resolve, reject) => {
				// 向后端请求路由数据
				rule.getUserInfo().then((res: any) => {
					let muneList: Array<any> = [];
					if (res.roleName == '企业用户' || res.roleName == '企业管理员') {
						muneList = [
							{
								label: '一企一档',
								key: 'Risk control',
								// icon: renderIcon(Umbrella),
								disabled: false,
								children: [
									// {
									//     label: '企业档案清单',
									//     key: 'enterpriseArchives',
									//     path: '/enterpriseArchives',
									// },
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
								// icon: renderIcon(BulbSharp),
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
					} else {
						muneList = [
							{
								label: '一企一档',
								key: 'Risk control',
								// icon: renderIcon(Umbrella),
								disabled: false,
								children: [
									{
										label: '企业档案清单',
										key: 'enterpriseArchives',
										path: '/enterpriseArchives',
									},
									// {
									//     label: '企业基本信息',
									//     key: 'essentialInformation',
									//     path: '/essentialInformation',
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
								// icon: renderIcon(BulbSharp),
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
					}
					context.commit('GET_MUNE', muneList);
				});
			});
		},
	},
};
