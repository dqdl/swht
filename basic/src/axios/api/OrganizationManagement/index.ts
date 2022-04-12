/**
 * 组织管理接口数据
 * 
 */
 import axios from '../../http';
 let baseUrl = window.urlConfig.url;
 
 const userManagement = {
     //获取列表
     getList(parmas: Object) {
         return axios.get(`${baseUrl}/uaa/sys/user/listPage`, parmas);
     },
     /**
      * 获取管委会数据信息
      */
    getManagementCommittee(data:any){ // 新增用户数据
        return axios.post(`${baseUrl}`+'/uaa/dept',data)
    },
    /**
     * 部门树 查询 获取部门树
     */
    getDepartMentTree(id:any = ""){
        return axios.get(`${baseUrl}`+`/uaa/dept/tree?enterpriseId=${id}`)
    },

    // 部门数列表查询
    getListTree({
        deptName ='',
        enterpriseId =''
    }){
        return axios.get(`${baseUrl}` +`/uaa/dept/list?deptName=${deptName}&enterpriseId=${enterpriseId}`)
    },
    //分页查询
    getPageCHeck({
        current = '',
        size = ''
    }){
        return axios.get(`${baseUrl}` + `/uaa/dept/page?current=${current}&size=${size}`)
    },
    // 管委会部门树 和企业组织树列表查询
    getListCommunityAndEntrepise(
        data = {
            current : "", // 	当前页
            size:"", //每页显示条数	
            account:"", // 账号
            admin:'', // 是否是企业主账户 0-主账户 1-非主账户	
            approveResult:'', // 审核状态
            type:"", // 用户类型
            deptId:"",
            enterpriseId:""// 企业id
        } 
    ){
        return axios.get(`${baseUrl}`+`/uaa/sys/user/listPage`,{
            params:{
                ...data
            }
        }
        )
    },
    // 系统用户修改 管委会和企业树组织列表
    getPostListData(params:any){
        console.log(params,'sda7777')
        return axios.post(`${baseUrl}`+'/uaa/sys/user/update',{
            "account": params.user.account,
            "admin": null,
            // "approveResult": null,
            // "approveStatus": null,
            "code": params.user.code,
            "deptId": null,
            "deptName": params.user.tags,
            "enterpriseId": null,
            "enterpriseName": null,
            "job": params.user.position,
            // "keyCode": null,
            "name": params.user.name,
            "newPassword": null,
            "password": null,
            "phone": params.user.tel,
            "roleCode": params.user.role, // 用户角色id
            "roleCodeList": [params.user.role],
            "roleNameList": null,
            // "salt": null,
            "status": null,
            "type": 1,
            "userCodeList": [],
            // "valid": 0,
            // "verifyCode": null 
        })
    },
    // 新增管委会部门 和 企业树组织列表的数据接口
    addEnterpiseAndCommunity(params:any){
        // return axios。post
        // console.log(params,'s新增的接口数据d')
        return axios.post(`${baseUrl}`+'/uaa/dept',params)
    },
    // 修改部门信息接口
    modifyUserAccount(params:any){
        return axios.put(`${baseUrl}/uaa/dept`,params)
    },
    // 删除用户部门接口
    deleteDepartment(id:any){
        return axios.delete(`${baseUrl}/uaa/dept/${id}`)
    },
    
    // 用户删除的接口数据信息 管委会部门树 和企业组织数
    deleCommunityAndEbterpise(code:any){
        return axios.post(
            `${baseUrl}/uaa/sys/user/delete/${code}`,
        )
    },
    /**
     * 用户角色查询
     */
    getroleList(userCode:any = ''){
        return axios.get(`${baseUrl}/uaa/sys/role/list?userCode=${userCode}`)
    },
    /**
     * 用户批量删除接口
     */
    userDeleteAlot({
        codeList = ''
    }){
        return axios.post(`${baseUrl}/uaa/sys/user/batchDelete`,{
            codeList:'' // 参数名称
        })
    },
    /**
     * 用户详情查看
     */
    userDetailCheck(code:any = ''){
        return axios.get(`${baseUrl}/uaa/sys/user/detail?code=${code}`)
    },
    //批量删除的接口文档
    getBatchDel(codeArray = []){
        return axios.post(`${baseUrl}/uaa/sys/user/batchDelete`,
            [...codeArray]
        )
    },

    // 获取各部门信息接口
    getDepartMentInfo(code:any){
        return axios.get(`${baseUrl}/uaa/dept/page`,{
            params:{
                code
            }
        })
    },


       
 }
 
 export default userManagement;