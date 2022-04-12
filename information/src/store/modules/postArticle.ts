/**
 * @author tangjiaqaing
 * @description 保存多页面草稿数据信息
 */
export default {
	namespaced: true,
	state: {
		draftDatas: {},
		flag: false, // 标志是否从草稿部分进入
	},
	mutations: {
		putDraft(state: any, payload: any): void {
			(state.draftDatas = payload.par1), (state.flag = payload.flag);
		},
	},
	actions: {},
};
