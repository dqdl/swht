import { createStore } from 'vuex';

export default createStore({
	state: {
		count: 0,
		userName: '测试测试',
		isLogin: true,
	},
	mutations: {
		addCount(state) {
			state.count += 1;
		},
	},
	actions: {},
});
