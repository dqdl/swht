<template>
    <n-message-provider>
        <div style="width: 100%;height: 100%;" class="container">
            <!-- 左侧导航栏 -->
            <div ref="leftCon" class="leftCon">
                <div class="head">
                    <div class="title">组织架构</div>
                    <div class="func">
                        <div
                            style="width: 93.3333px;"
                            v-for="(item, index) of headSelectOption"
                            :key="item.id"
                        >
                            <!-- deptName -->
                            <n-button
                                v-if="deptName != item.name"
                                :type="item.type"
                                @click="resolveClick(item)"
                            >{{ item.name }}</n-button>
                        </div>
                    </div>
                </div>
                <div class="aaaaa" :style="{ width: echirtwidth, height: echirtheight }">
                    <parmidCharts :id="domId" @nodeTypes="handelTypes" :data="chartsDatsa"></parmidCharts>
                </div>
            </div>
            <div class="rightCon">
                <div class="searchInput">
                    <n-input placeholder="请输入姓名" clearable v-model:value="inputNameValue">
                        <template #suffix>
                            <n-icon
                                :style="{
                                    corsor: 'pointer'
                                }"
                                @click="searChNameCard"
                            >
                                <SearchSharp />
                            </n-icon>
                        </template>
                    </n-input>
                </div>
                <div class="containerInfo">
                    <div v-for="(item, index) of tempData" :key="index">
                        <infoCard :data="item"></infoCard>
                    </div>
                </div>
            </div>
            <!-- 弹出模态框 修改-->
            <n-modal
                class="custom-card"
                v-model:show="showModalPut"
                preset="card"
                :style="bodyStyle"
                :title="form_details.name"
                size="huge"
                :bordered="false"
                :segmented="segmented"
            >
                <template #header-extra></template>
                <n-form :model="form_details" :rules="rules">
                    <n-form-item label="部门名称" path="user.name">
                        <n-input
                            v-model:value="form_details.user.name"
                            clearable
                            placeholder="请输入部门名称"
                        />
                    </n-form-item>
                    <n-form-item label="部门描述" path="user.account">
                        <n-input
                            v-model:value="form_details.user.account"
                            clearable
                            placeholder="请输入部门描述"
                        />
                    </n-form-item>
                    <!-- <template v-if="form_details.name == '新增'">
                        <n-form-item path="password" label="用户密码">
                            <n-input
                                v-model:value="form_details.user.password"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                    </template>-->
                    <!-- <n-form-item label="归属部门" path="user.department"> -->
                    <!-- <n-cascader
                            :options="departmentOptions"
                            v-model:value="form_details.user.department"
                            label-field="label"
                            value-field="value"
                            children-field="children"
                            default-value="test_1_1"
                            check-strategy="child"
                    />-->
                    <!-- </n-form-item> -->
                    <n-form-item label="部门负责人" path="user.position">
                        <n-input
                            v-model:value="form_details.user.position"
                            clearable
                            placeholder="请输入部门负责人"
                        />
                    </n-form-item>
                    <n-form-item label="上级部门" path="user.role">
                        <!-- <n-select -->
                        <!-- placeholder="请选择上级部门" -->
                        <!-- v-model:value="form_details.user.role" -->
                        <!-- :options="selectOptions" -->
                        <!-- @on-update:value="handleSelectValue" -->
                        <!-- /> -->
                        <n-input v-model:value="form_details.user.upDepartment" disabled="true"></n-input>
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space>
                        <n-button type="info" @click="getNewAddForm">确认</n-button>
                        <n-button type="info" @click="showModalPut = false">取消</n-button>
                    </n-space>
                </template>
            </n-modal>
        </div>
    </n-message-provider>
    <!-- popup_delete-->
    <n-modal
        v-model:show="showModal_delete"
        preset="dialog"
        type="error"
        :show-icon="false"
        title="删除"
        :content="delete_content"
        positive-text="确认"
        negative-text="取消"
        @positive-click="submitCallback"
        @negative-click="cancelCallback"
    ></n-modal>
</template>


<script lang="ts" setup>
/**
 *   委员会部门数
 */
import { ref, reactive, watch, computed, Ref, toRaw, onMounted, watchEffect } from "vue"
import { SearchSharp } from '@vicons/ionicons5'
import ylymanage from "@/assets/images/ylymanage.png"
// import listTree from '@components/listTree/listTree.vue'
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage, useDialog } from 'naive-ui'
import { zhCN, dateZhCN, NSpace } from 'naive-ui'
import Api from '../../../src/axios/api/OrganizationManagement/index'
import parmidCharts from '@/components/Pyramid/Pyramid.vue'
import add from './img/kks.png'
import modify from './img/modify.png'
import deletepng from './img/look.png'
// import debounceRef from "./js/index.js"
import infoCard from '@/components/infoCard/infoCard.vue'
import { customRef } from 'vue'

// name:名称
// account:描述
// position：负责人
// role:上级部门

let debounceRef = function (value: any, delay = 100) {
    let timer: any = null
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    value = newValue
                    trigger()
                }, delay);
            }
        }
    })
}
let domId: Ref<HTMLDivElement | null> = ref(null)

const message = useMessage()
let dats: Ref<any[]> = ref([])

let inputNameValue: Ref<any> = debounceRef('')

let headSelectOption: any = reactive([
    {
        name: "新增",
        type: "info",
        id: '1'
    },
    {
        name: "修改",
        type: "warning",
        id: '2'
    },
    {
        name: "删除",
        type: "error",
        id: '3'
    }
])
function handleInput(v: any) {

}
let chartsDatsa: Ref<any> = ref([])

// 拷贝的树的数据
let copyTreeInfo: Ref<any> = ref([])

/**
 * 获取树
 */
// 初始部门id
let deptId: any = ref()
let deptName = ref('')
async function getTree() {
    let id: any = ""
    if (sessionStorage.getItem("companyId")) {
        id = sessionStorage.getItem("companyId")
    }
    let ks = await Api.getDepartMentTree(id)
    let type = sessionStorage.getItem('type')
    let userinfo: any = sessionStorage.getItem('userinfo');
    let data = [
        {
            children: [],
            createTime: "2022-02-16T10:33:28.616082",
            updateTime: "2022-02-16T10:33:28.616082",
            deleted: 0,
            deptName: "邵武市",
            enterpriseId: "-1",
            id: "1493775507345461249",
        }
    ]
    // if (type && type == '2' && userinfo) {
    //     let user = JSON.parse(userinfo)
    //     deptName.value = user.enterpriseName;
    //     console.log(deptName.value)
    //     data[0].deptName = user.enterpriseName;
    //     data[0].createTime = user.createTime;
    //     data[0].updateTime = user.updateTime;
    //     data[0].enterpriseId = user.enterpriseId;
    //     data[0].id = user.companyId;
    //     data[0].children = ks.data
    // } else {
    //     data = ks.data
    // }
    data = ks.data
    dats.value.length = 0
    chartsDatsa.value = []
    data && handelTypes(data[0]);
    data && (deptId.value = data[0].id)
    data && data?.forEach((item: any, index: any) => {
        let op = {
            label: item.deptName,
            id: item.id,
            key: item.id,
            children: recurSion(item)
        }
        dats.value.push(op)
    })
    data && data?.forEach((prev: any, next: any) => {
        console.log(prev, 'prev');
        let op = {
            name: prev.deptName,
            id: prev.id,
            leader: prev.leader,// 部门leader
            deptRemarks: prev.deptRemarks, // 部门描述
            parentId: prev.parentId, // 上级部门id
            children: curDatas(prev)
        }

        chartsDatsa.value.push(op)
    })
    console.log(chartsDatsa.value, 333);
    copyTreeInfo.value = chartsDatsa.value
}
// 递归操作

function curDatas(item: any) {
    return item.children && item.children.map((item: any) => {
        return {
            name: item.deptName,
            id: item.id,
            leader: item.leader,// 部门leader
            deptRemarks: item.deptRemarks, // 部门描述
            parentId: item.parentId, // 上级部门id // 根据上级部门id 找name
            children: curDatas(item)
        }
    })
}

// 结点信息
let nodeInfo: Ref<any> = ref('')

const handelTypes = (data: any) => {
    // console.log(data, 'emits');
    const { id } = data
    nodeInfo.value = data
    getPartMentPerson({
        deptId: id
    }).then(({
        code,
        data: {
            records,
        }
    }: any) => {
        if (code === 200) {
            createData.length = 0
            records && records.forEach((item: any, index: number) => {
                createData.push({
                    key: `${index}`,
                    code: item.code,
                    name: item.deptName,
                    age: item.name,
                    address: item.account,
                    tags: item.deptName,
                    // position: item.job,
                    phone: item.phone,
                })
            })
        }
    })
}



// 递归找children
function recurSion(item: any) {
    return item.children && item.children.map((item: any, index: any) => {
        let ops = {
            label: item.deptName,
            id: item.id,
            key: item.id,
            children: recurSion(item)
        }
        return ops
    })
}

/**
 * 获取partment 的成员
 */
async function getPartMentPerson(code: any) {
    let datas = await Api.getListCommunityAndEntrepise(code)
    return datas
}

// 上级部门的id选项列表

async function rolecheck(userCode: any) {
    let datas = await Api.getListTree(userCode)
    const { data } = datas
    selectOptions.length = 0

    data && data?.forEach((item: any, index: number) => {
        let ops: any = {
            label: item.name,
            value: item.code
        }
        selectOptions.push(ops)
    })
}


function handleSelectValue(evt: any) {
    console.log(evt, '下拉框选中的值')
}
/**
 * 分页查询数据
 * 
 */

let createData: any = reactive([])

// 总共的条数

let valueCur = ref('10')
let alldatats = ref(createData.length)


let options = [
    {
        label: "8",
        value: 'song0',
    },
    {
        label: '10',
        value: 'song1'
    },
    {
        label: '12',
        value: 'song2'
    },
]

let paramsD = {
    'current': '1',
    'size': ''
}
async function devided() {
    let datas = await Api.getPageCHeck(paramsD) // 分页查询
    const { data } = datas
}
let params = {

}
let paramsAll = {
    current: "1", // 	当前页
    size: "10", //每页显示条数	
    account: "", // 账号
    admin: '', // 是否是企业主账户 0-主账户 1-非主账户	
    approveResult: '', // 审核状态
    type: "1", // 用户类型  1 管委会 2 企业用户
    deptId: '',
    enterpriseId: ""// 企业id
}


// 获取管委会的列表数据信息
function getAllDtas() {
    Api.getListCommunityAndEntrepise(paramsAll).then((datas: any) => {
        const { data } = datas
        const { records } = data
        createData.length = 0
        records && records?.forEach((item: any, index: any) => {
            createData.push(
                {
                    key: `${index}`,
                    code: item.code,
                    name: item.code,
                    age: item.name,
                    address: item.account,
                    tags: item.deptName,
                    position: item.job,
                    phone: item.phone,
                    role: item.roleNameList.toString(),
                }
            )
        })
        valueCur.value = data.size
        alldatats.value = data.total
        isLoading.value = false
    })
}

/**
 * 修改列表的数据
 */
async function PutListData(params: object) {
    let data = await Api.getPostListData(params)
    return data
}
/**
 * 新增用户 
*/

async function AddListItem(params: any) {
    let data = await Api.addEnterpiseAndCommunity(params)
    return data
}
/**
 * 删除某一列表项的数据
 */
async function deleItemData(code: any) {
    let data = await Api.deleCommunityAndEbterpise(code)
    return data
}
// 动态设置echarts宽高
let leftCon = ref<HTMLElement>()
let echirtwidth: any = ref(100)
let echirtheight: any = ref(900)
onMounted(() => {
    const dragDivDom: any = leftCon.value;
    echirtwidth.value = `${dragDivDom.offsetWidth}px`
    echirtheight.value = `${dragDivDom.offsetHeight - 10}px`
    // devided()
    // 
    // getAllDtas()
    rolecheck({
        deptName: "",
        enterpriseId: ""
    }) // 所有的参数角色
})
// 默认分页数
let pagenation: any = ref('8')

function handleUpdateValue(value: any, option: any) {
    console.log(value)
    console.log(option.label)
    pagenation.value = computed(() => {
        return Number(option.label)
    })
}

/**
 * 模式搜索
 */
let pattern: any = ref("")

let inputSearch: Ref<string> = ref('')
let cloneObj: any

// search value 函数
function searChValue() {
    cloneObj = JSON.parse(JSON.stringify(dats.value))
    dats.value = clear(cloneObj, inputSearch.value)
}
watchEffect(() => {
    if (inputSearch.value === '') {
        getTree()
    }
})

// 筛选过滤函数
function clear(tree: any, str: string) {
    if (!tree) return []; //处理叶节点
    let result: any = [];
    tree.map((item: any) => {
        let it = {
            ...item
        }; //每项浅拷贝一下保证不影响原来的tree
        if (it.label.indexOf(str) > -1) {
            result.push(it);
        } else {
            let obj = clear(it.children, str);
            //得到children的返回的result数组，放到拷贝对象的children中
            if (obj.length > 0) {
                it.children = obj;
                result.push(it);
            }
        }
    });
    return result; //每层返回一个数组
}




const form_details = reactive({
    name: '新增',
    user: {
        name: '',
        account: "",
        department: '', // 部门名称
        partid: '', // 部门id
        position: '',
        role: '',
        tel: '',
        key: '',
        code: '',
        password: "", // 密码框
        upDepartment: "" // 上级部门
    },
})


watch(() => form_details, (prev, next) => {
    if (prev) {
    }
}, {
    deep: true,
    immediate: true
})


const rules = {
    user: {
        name: {
            required: true,
            message: '请输入姓名',
            trigger: ['input', 'blur']
        },
        account: {
            required: true,
            message: '请输入账号',
            trigger: ['input', 'blur']
        }
    },
}

const queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    name: '',
    time: [0, Date.now()],
    role: '',
    department: ''
})


// role
let selectOptions: any = reactive(
    [
        // {
        // label: '超级管理员',
        // value: '超级管理员'
        // },
        // {
        // label: '普通人员',
        // value: '普通人员'
        // },
    ]
)

// 模态框
let showModalPut = ref(false)


// 新增弹框 - 点击确认
function getNewAddForm() {
    showModalPut.value = false
    console.log(form_details, '778888');
    switch (form_details.name) {
        case "新增":
            isLoading.value = true
            AddListItem({
                deptName: form_details.user.name,
                deptRemarks: form_details.user.account,
                leader: form_details.user.position,
                enterpriseId: nodeInfo.value.id,
                parentId: nodeInfo.value.id
            }).then((val: any) => {
                const { code, message: s } = val
                if (code === 200) {
                    getTree()
                    message.success('新增成功')
                } else {
                    message.success(`${s}`)
                }
            })
            // getAllDtas()
            break;
        case "删除":

            break;
        case "修改":
            console.log(form_details, 'deleasasda')  // 修改的详情信息
            isLoading.value = true
            modifyUserAccountInfo({
                deptName: form_details.user.name,
                deptRemarks: form_details.user.account,
                leader: form_details.user.position,
                parentId: nodeInfo.value.id
            }).then(({
                code,
                message: modify
            }: any) => {
                if (code === 200) {
                    getTree()
                    message.success('修改成功!')
                } else {
                    message.success(`${modify}`)
                }
            })
            getTree()
            // getAllDtas()
            break;
        default:
            break;
    }
}

let bodyStyle = {
    width: '1000px',
    height: '800px'
}
let segmented = {
    content: 'soft',
    footer: 'soft'
}

// 控制表格table组件是否刷新
let isLoading: Ref<boolean> = ref(false)

// 控制loading
/**
 * selectChange事件
 */
function selectChange(evt: any) {
    console.log(evt, 'evteete')
}
/**
 * pageSize 改变时触发的回调函数
 */
function pageSizeUpdate(evt: any) {
    console.log(evt, 'sef')
}

// 修改点击选中的value值
let selectValue: Ref<string> = ref('')

function findParentName(arr: any[], str: string | number) {
    return arr.find((item: any) => {
        if (item.id === str) {
            selectValue.value = item.name
            return item.name
        } else {
            if (item.children && item.children.length > 0) {
                findParentName(item.children, str)
            }
        }
    })
}
// pop_删除
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除？')
// 删除-取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除-确认
const submitCallback = () => {
    deleteUserDepartmentInfo(nodeInfo.value.id).then(({
        code,
        message: as
    }: any) => {
        if (code === 200) {
            message.success('删除成功')
            getTree()
        } else {
            message.error(`${as}`)
        }
    })
}
/**
 * headClick
 */
const resolveClick = (evt: any) => {
    let len = Object.keys(nodeInfo.value).length
    switch (evt.name) {
        case '新增':
            if (chartsDatsa.value.length > 0 && len === 0) {
                message.info("请先选中某一结点")
                return
            } else {
                console.log(nodeInfo.value, '99888');
                showModalPut.value = true
                form_details.user.upDepartment = nodeInfo.value.name
                form_details.name = '新增'
                form_details.user.account = ''
                form_details.user.position = ''
                form_details.user.name = ''
            }
            break;
        case '修改':
            if (len === 0) {
                message.info("请先选中某一结点")
                return
            } else {
                // console.log(nodeInfo.value, '99888');
                showModalPut.value = true
                // console.log(nodeInfo.value,'nodeInfo');
                // console.log(form_details,'999');
                // 上级部门
                findParentName(copyTreeInfo.value, nodeInfo.value.parentId)
                form_details.user.upDepartment = selectValue.value
                form_details.user.name = nodeInfo.value.name
                form_details.user.account = nodeInfo.value.deptRemarks
                form_details.user.position = nodeInfo.value.leader
                form_details.name = '修改'
            }
            break;
        case '删除':
            if (len === 0) {
                message.info("请先选中某一结点")
                return
            } else {
                showModalPut.value = false
                form_details.name = '删除'
                showModal_delete.value = true
            }
            break;
        default:
            break;
    }

}

/**
 * 选中的列改变时的回调函数
 */
function colomnKeys(keys: any) {
    console.log(keys)
}

// 选中的列
const checkedRowKeys = ref([])

let index: any = ref('')

// 批量删除容器
let batchDel: any = ref([])

function handleCheck(row: any) {  // 处理
    console.log(row, 'wwewe')
    // index.value = row[0].key  // 下标
    index.value = row[0]
    console.log(index.value, 'sda')
    // 批量删除
    batchDel.value = row
}


/**
 * 批量删除的接口
 */
async function delBatch(params: any) {
    let data = await Api.getBatchDel(params)
    return data
}

/**
 * 修改部门信息接口
 */
async function modifyUserAccountInfo(params: any) {
    let dats = await Api.modifyUserAccount(params)
    return dats
}
/**
 * 删除部门用户信息
 */

async function deleteUserDepartmentInfo(id: any) {
    let dats = await Api.deleteDepartment(id)
    return dats
}


const createColumns = () => {
    return [
        {
            type: 'selection',
            //   disabled (row, index) {
            //   return row.name === 'Edward King 3'
            // }
            options: [
                'all',
                'none',
                {
                    // label: "",
                    // key: '',
                    onSelect: (pageData: any) => {
                        console.log(pageData, 'pageDatapageData')
                        checkedRowKeys.value = pageData
                    }
                }

            ]
        },
        {
            title: '序号',
            key: 'name',
            align: 'center'
        },
        {
            title: '用户姓名',
            key: 'age',
            align: 'center'
        },
        {
            title: '用户账号',
            key: 'address',
            align: 'center'
        },
        {
            title: '归属部门',
            key: 'tags',
            align: 'center'
        },
        {
            title: '职位',
            key: 'position',
            align: 'center'
        },
        {
            title: '联系方式',
            key: 'phone',
            align: 'center'
        },
        {
            title: '用户角色',
            key: 'role',
            align: 'center'
        },
    ]
}
// 创建数据
let data = createData

/**
 * 搜索name值的函数
 */
let tempData: Ref<any> = ref(data)

const searChNameCard = () => {

    tempData.value = tempData.value && (tempData.value.filter((item: any, index: number) => {
        return item.age.includes(inputNameValue.value)
    }))
}
watchEffect(() => {
    if (inputNameValue.value === '') {
        tempData.value = data
    }
})


let columns = createColumns()
// 分页  共多少页
let pagination = {
    pageSize: Number(pagenation.value)
}

let tableData = reactive([

])


</script>

<style lang="postcss" scoped>
@import "./scss/NumberOfManagementCommitteeDepartments.scss";
</style>