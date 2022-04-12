export default {
    namespaced: true,
    state: {
        isLogin: false
    },
    mutations: {
        UPDATE_LOGIN(state: any, isLogin: any) {
            state.isLogin = isLogin;
        },
    },
    actions: {
        // 登录
        // 登出
    }
};
