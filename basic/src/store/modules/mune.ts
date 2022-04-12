import rule from "../../axios/api/roleManagement/index";
export default {
    namespaced: true,
    state: {
        muneList: [],
        systemList: []
    },
    mutations: {
        GET_MUNE(state: any, data: Array<any>) {
            state.muneList = data;
        },
        GET_SYSTEM(state: any, data: Array<any>) {
            state.systemList = data;
        }
    },
    actions: {
        getMune(context: any) {
            return new Promise((resolve, reject) => {
                // 向后端请求路由数据
                rule.getMuneList().then((data: any) => {
                    console.log(3434343434,data)
                    const sdata = JSON.parse(JSON.stringify(data.data));
                    // 根目录路由重定向
                    let muneList: Array<any> = [];
                    let treeList: Array<any> = [];
                    let powerList: Array<any> = ['大数据可视化系统'];
                    for (let i = 0; i < sdata.length; i++) {
                        powerList.push(sdata[i].label)
                        if (sdata[i].name === 'coreSystem') {
                            muneList = sdata[i].children
                        }
                        break;
                    }
                    data.data[0] ? treeList = data.data[0].children : treeList = [];
                    context.commit('GET_MUNE', muneList)
                    context.commit('GET_SYSTEM', powerList)
                    let rewriteRoutes = {
                        muneList: treeList
                    }
                    resolve(rewriteRoutes)
                })
            })
        }
    }
};





