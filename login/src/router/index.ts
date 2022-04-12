/*
 * @Author: zyl
 * @LastEditTime: 2022-01-06 15:34:00
 * @Description: 
 */
import {
    createRouter,
    createWebHashHistory,
    Router
} from "vue-router";

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
                name:"changepwd",
                component: () => import('../pages/login/changepwd/changePwd.vue'),
            }
        ]

    },
    // login
    {
        path: '/login',
        component: () => import('../pages/login/Index.vue'),
        redirect: '/login',
        children: [{
            path: '/login',
            component: () => import('../pages/login/login/LoginMain.vue'),
        },{
            path: '/changepwd',
            component: () => import('../pages/login/changepwd/changePwd.vue'),
        }, {
            path: '/resetpwd',
            component: () => import('../pages/login/resetpwd/resetPwd.vue'),
        }]


    },
    // basic_system
    {
        path: '/index',
        component: () => import('../pages/main/Index.vue'),
        children: [
            {
                path: '/riskPoint',
                name: '/riskPoint',
                component: () => import('../pages/riskPoint/index.vue')
            },
            {
                path: '/riskPointControl',
                name: '/riskPointControl',
                component: () => import('../pages/riskPointControl/index.vue')
            },
            {
                path: '/RiskList',
                name: '/RiskList',
                component: () => import('../pages/RiskList/index.vue')
            },
            {
                path: '/riskAnalysis',
                name: '/riskAnalysis',
                component: () => import('../pages/riskAnalysis/index.vue')
            },
        ]

    }]

    



const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: routers
})

export default router;