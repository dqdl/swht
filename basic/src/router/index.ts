/*
 * @Author: zyl
 * @LastEditTime: 2022-01-15 17:12:50
 * @Description: 
 */
import {
    createRouter,
    createWebHashHistory,
    Router
} from "vue-router";
import store from '../store/index'
import userManagement from '../pages/userManagement/index.vue';
import organizeManagement from '../pages/organizeManagement/index.vue';
import basicInformationManagement from '../pages/basicInformationManagement/index.vue';
import main from "../pages/main/Index.vue";
import home from "../pages/home/home.vue";
const routers = [
    // 根路径
    {
        path: '/',
        component: () => import('../pages/login/Index.vue'),
        redirect: 'login',
    },
    // login
    {
        path: '/login',
        component: () => import('../pages/login/Index.vue'),
        // redirect: '/login',
        children: [
            {
                path: '/login',
                name: "login",
                component: () => import('../pages/login/login/LoginMain.vue'),
            },
            {
                path: '/changepwd',
                name: "changepwd",
                component: () => import('../pages/login/changepwd/changePwd.vue'),
            },
            {
                path: '/resetpwd',
                name: "resetpwd",
                component: () => import('../pages/login/resetpwd/resetPwd.vue'),
            }
        ]
    },
    {
        path: '/coreSystem',
        name: 'coreSystem',
        component: main,
        label: "基础核心支撑系统",
        key: "基础核心支撑系统",
        meta: { title: "基础核心支撑系统", icon: "" },
        redirect:'/coreSystem/home',
        children: [
            {
                path: '/coreSystem/home',
                name: 'home',
                component: home,
                label: "首页",
                key: "首页",
                meta: { title: "首页", icon: "" },
            }
        ]
    },
    {
        path: '/toggle',
        component: () => import('../pages/toggleSystems/index.vue'),
    }
]
const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: routers
})
// 白名单成员
const whiteList: Array<string> = ["/login", "/changepwd", "/resetpwd"];
const token = () => window.sessionStorage.getItem("token") || null;
const modules = import.meta.glob('../pages/**/*.vue');
const routerPackag = (routers: any) => {
    routers.filter((itemRouter: any) => {
        if (itemRouter.component === 'userManagement') {
            itemRouter.component = userManagement
        } else if (itemRouter.component === 'organizeManagement') {
            itemRouter.component = organizeManagement
        } else if (itemRouter.component === 'basicInformationManagement') {
            itemRouter.component = basicInformationManagement
        } else {
            itemRouter.component = modules[`../pages/${itemRouter.component}.vue`]
        }
        router.addRoute('coreSystem', {
            path: `${itemRouter.path}`,
            name: itemRouter.name,
            meta: itemRouter.meta,
            component: itemRouter.component
        });
        if (itemRouter.children && itemRouter.children.length) {
            routerPackag(itemRouter.children);
        }
        return true;
    });
};
router.beforeEach(async (to, from, next) => {
    if (token()) {
        if (!(store.state as { user: any }).user.isLogin) {
            await store.dispatch('mune/getMune').then(res => {
                store.commit("user/UPDATE_LOGIN", true);
                if (res.muneList) {
                    routerPackag(res.muneList)
                    next({ ...to, replace: true })
                } else {
                    sessionStorage.removeItem("token")
                    next(`/login`)
                }
            })
        } else if ((store.state as { user: any }).user.isLogin) {
            return next();
        }
    } else {
        if (whiteList.includes(to.path)) {
            return next();
        } else {
            next(`/login`)
        }
    }

});
export default router;