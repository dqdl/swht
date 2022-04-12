export const asyncRoute = [
    {
        path: '/coreSystem',
        name: 'coreSystem',
        component: 'main',
        label: "基础核心支撑系统",
        key: "基础核心支撑系统",
        meta: { title: "基础核心支撑系统", icon: "" },
        children: [{
            path: '/coreSystem/userManagement',
            name: "userManagement",
            component: 'userManagement',
            label: "用户管理",
            key: "用户管理",
            meta: { title: "用户管理", icon: "" },
            children: [
                {
                    // 管委会用户管理
                    path: '/coreSystem/userManagement/managementCommittee',
                    name: 'managementCommittee',
                    component: 'userManagement/managementCommittee/index',
                    label: "管委会用户",
                    key: "管委会用户",
                    meta: { title: "管委会用户", icon: "" },
                },
                {
                    // 企业账号管理
                    path: '/coreSystem/userManagement/accountManagement',
                    name: 'accountManagement',
                    component: 'userManagement/accountManagement/index',
                    label: "企业账号管理",
                    key: "企业账号管理",
                    meta: { title: "企业账号管理", icon: "" },
                },
                {
                    // 企业用户管理
                    path: '/coreSystem/userManagement/enterpriseManagement',
                    name: 'userManagement',
                    component: 'userManagement/userManegement/index',
                    label: "企业用户管理",
                    key: "企业用户管理",
                    meta: { title: "企业用户管理", icon: "" },
                }
            ]
        }, {
            path: '/coreSystem/roleManagement',
            name: "roleManagement",
            component: "roleManagement/index",
            label: "角色管理",
            key: "角色管理",
            meta: { title: "角色管理", icon: "" },
        }, {
            path: '/coreSystem/organizeManagement',
            name: "organizeManagement",
            component: 'organizeManagement',
            label: "组织管理",
            key: "组织管理",
            meta: { title: "组织管理", icon: "" },
            children: [
                {
                    // 管委会部门数
                    path: '/coreSystem/organizeManagement/NumberOfManagementCommitteeDepartments',
                    name: 'NumberOfManagementCommitteeDepartments',
                    component: 'organizeManagement/NumberOfManagementCommitteeDepartments',
                    label: "管委会部门数",
                    key: "管委会部门数",
                    meta: { title: "管委会部门数", icon: "" },
                }, {
                    // 企业组织数
                    path: '/coreSystem/organizeManagement/NumberOfEnterpriseOrganizations',
                    name: 'NumberOfEnterpriseOrganizations',
                    component: 'organizeManagement/NumberOfEnterpriseOrganizations',
                    label: "企业组织数",
                    key: "企业组织数",
                    meta: { title: "企业组织数", icon: "" },
                }
            ]
        },
        {
            path: '/coreSystem/dictionaries',
            name: "Dictionaries",
            component: 'organizeManagement',
            label: "字典管理",
            key: "字典管理",
            meta: { title: "字典管理", icon: "" },
            children: [
                {
                    path: '/coreSystem/dictionaries/currency',
                    name: "Generaldictionarymanagement",
                    component: 'GeneralDictionaryManagement/Generaldictionarymanagement',
                    label: "通用字典管理",
                    key: "通用字典管理",
                    meta: { title: "通用字典管理", icon: "" },
                }, {
                    path: '/coreSystem/dictionaries/system',
                    name: "SystemDictionaryManagement",
                    component: 'SystemDictionaryManagement/SystemDictionaryManagement',
                    label: "系统字典管理",
                    key: "系统字典管理",
                    meta: { title: "系统字典管理", icon: "" },
                }
            ]
        },
        {
            path: '/coreSystem/basicInformationManagement',
            name: "basicInformationManagement",
            component: 'basicInformationManagement',
            meta: { title: "基础信息管理", icon: "" },
            label: "基础信息管理",
            key: "基础信息管理",
            children: [
                {
                    path: '/coreSystem/basicInformationManagement/synopsis',
                    name: 'synopsis',
                    component: 'basicInformationManagement/synopsis/index',
                    label: "园区简介",
                    key: "园区简介",
                    meta: { title: "园区简介", icon: "" },
                }, {
                    path: '/coreSystem/basicInformationManagement/video',
                    name: 'video',
                    meta: { title: "园区宣传视频", icon: "" },
                    label: "园区宣传视频",
                    key: "园区宣传视频",
                    component: 'basicInformationManagement/video/index',
                },
                {
                    // 人口信息
                    path: '/coreSystem/basicInformationManagement/population',
                    name: 'population',
                    label: "人口信息",
                    key: "人口信息",
                    meta: { title: "人口信息", icon: "" },
                    component: 'basicInformationManagement/population/index',
                },
                {
                    // 用地规划
                    path: '/coreSystem/basicInformationManagement/landPlan',
                    name: 'landPlan',
                    meta: { title: "用地规划", icon: "" },
                    label: "用地规划",
                    key: "用地规划",
                    component: 'basicInformationManagement/landPlan/index',
                },
                {
                    // 重要经济指标s
                    path: '/coreSystem/basicInformationManagement/economics',
                    name: 'economics',
                    meta: { title: "重要经济指标", icon: "" },
                    label: "重要经济指标",
                    key: "重要经济指标",
                    component: 'basicInformationManagement/economics/index',
                },
                {
                    // 基础设施建设
                    path: '/coreSystem/basicInformationManagement/infrastructure',
                    name: 'infrastructure',
                    meta: { title: "基础设施建设", icon: "" },
                    label: "基础设施建设",
                    key: "基础设施建设",
                    component: 'basicInformationManagement/infrastructure/index',
                },
                {
                    // 招商引资
                    path: '/coreSystem/basicInformationManagement/investment',
                    name: 'investment',
                    meta: { title: "招商引资", icon: "" },
                    label: "招商引资",
                    key: "招商引资",
                    component: 'basicInformationManagement/investment/index'
                },
                {
                    // 环保设施管理
                    path: '/coreSystem/basicInformationManagement/envrionment',
                    name: 'envrionment',
                    meta: { title: "环保设施管理", icon: "" },
                    label: "环保设施管理",
                    key: "环保设施管理",
                    component: 'basicInformationManagement/envrionment/index'
                },
                {
                    // 环保设施管理
                    path: '/coreSystem/basicInformationManagement/safe',
                    name: 'safe',
                    meta: { title: "安全事件管理", icon: "" },
                    label: "安全事件管理",
                    key: "安全事件管理",
                    component: 'basicInformationManagement/safe/index'
                },
            ]
        }, {
            path: '/coreSystem/logQuery',
            name: "logQuery",
            component: 'logQuery/index',
            label: "日志查询",
            key: "日志查询",
            meta: { title: "系统字典管理", icon: "" },
        }]
    }
]