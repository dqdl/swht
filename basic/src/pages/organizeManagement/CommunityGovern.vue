<template>
    <n-message-provider>
        <div class="container">
            <!-- 左侧导航栏 -->
            <div class="leftBar">
                <div class="headTitle">
                    <div class="head">
                        <img :src="ylymanage" />
                        <span>组织架构</span>
                    </div>
                </div>
                <div class="line"></div>
                <!-- <n-space class=""> -->
                <div class="searchBar">
                    <n-input
                        type="text"
                        v-model:value="inputSearch"
                        size="large"
                        placeholder="请输入部门名称或员工名称"
                        @input="handleInput"
                    >
                        <template #suffix>
                            <n-icon 
                                :style="{
                                    cursor:'pointer'
                                }"
                                @click="searChValue"
                            >
                                <SearchSharp />
                            </n-icon>
                        </template>
                    </n-input>
                </div>
                <div class="tree">
                    <n-tree
                        block-line
                        cascade
                        checkable
                        :data="dats"
                        default-expand-all
                    ></n-tree>
                </div>
            </div>
            <div class="rightTable">
                <!-- // 头部控制栏 -->
                <div class="headControl">
                    <div class="text">数据列表</div>
                    <div class="allCon">
                        <div class="Con" v-for="(item, index) of   headCon  " :key="index">
                            <n-button
                                @click="headClick(item.name)"
                                :type="item.type"
                            >{{ item.name }}</n-button>
                        </div>
                    </div>
                </div>
                <div class="footerTable">
                    <n-data-table
                        :loading="isLoading"
                        ref="table"
                        :columns="columns"
                        :max-height="1600"
                        size="large"
                        :bordered="false"
                        :data="data"
                        :pagination="pagination"
                        @on-update:page-size="pageSizeUpdate"
                        @update:checked-row-keys="handleCheck"
                        :row-key="(row: any) => row.code"
                    />
                    <!-- 选择下拉框数据 -->
                    <div class="selectpagination">
                        <span>每页</span>
                        <!-- <select name="" id="select_page"  onchange="selectChange(this)">
            <option :value="item" v-for="(item,index) of pagenation " :key="index">{{ item }}</option>
                        </select>-->
                        <n-space vertical>
                            <!-- <n-select v-model:value="value"  :options="options"/> -->
                            <n-select
                                placeholder
                                @update:value="handleUpdateValue"
                                v-model:value="valueCur"
                                size="medium"
                                :options="options"
                            />
                        </n-space>
                        <span>条</span>
                        <div>共{{ alldatats }}条</div>
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
                    <n-form-item label="用户姓名" path="user.name">
                        <n-input
                            v-model:value="form_details.user.name"
                            clearable
                            placeholder="输入姓名"
                        />
                    </n-form-item>
                    <n-form-item label="用户账号" path="user.account">
                        <n-input
                            v-model:value="form_details.user.account"
                            clearable
                            placeholder="输入账号"
                        />
                    </n-form-item>
                    <template v-if="form_details.name == '新增'">
                        <n-form-item path="password" label="用户密码">
                            <n-input
                                v-model:value="form_details.user.password"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                    </template>
                    <n-form-item label="归属部门" path="user.department">
                        <n-cascader
                            :options="departmentOptions"
                            v-model:value="form_details.user.department"
                            label-field="label"
                            value-field="value"
                            children-field="children"
                            default-value="test_1_1"
                            check-strategy="child"
                        />
                    </n-form-item>
                    <n-form-item label="归属职位" path="user.position">
                        <n-input
                            v-model:value="form_details.user.position"
                            clearable
                            placeholder="输入职位"
                        />
                    </n-form-item>
                    <n-form-item label="联系方式" path="user.tel">
                        <n-input
                            v-model:value="form_details.user.tel"
                            clearable
                            placeholder="输入联系方式"
                        />
                    </n-form-item>
                    <n-form-item label="用户角色 " path="user.role">
                        <n-select
                            placeholder="输入角色"
                            v-model:value="form_details.user.role"
                            :options="selectOptions"
                            @on-update:value="handleSelectValue"
                        />
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

const message = useMessage()
// const dialog = useDialog()

type Fn = () => {}


let dats = ref([])

let temp: Ref<any> = ref()

// department
// department
const departmentOptions = reactive(
    [
        {
            label: 'test_1',
            value: 'test_1',
            id: '0',
            parentId: '-1',
            children: [
                {
                    label: "test_1_1",
                    value: "test_1_1",
                    id: '1',
                    parentId: '0',

                },
            ]
        }
    ]
)


watch(() => temp, (prev, next) => {
    if (prev) {
        dats.value = prev.value
    }
},
    {
        deep: true,
        immediate: true
    })
/**
 * lodash 节流
 */
// function throll(fn:Fn,wait:number){
//     let timer:any = null
//     return function (){
//         let args:any = arguments
//         if(timer){
//             clearTimeout(timer)
//         }
//         timer = setTimeout(()=>{
//             fn.apply(this<any>,args)
//             timer = null
//         },wait)
//     }
// }
function handleInput(v: any) {

}
/**
 * 获取树
 */
async function getTree() {
    let { data } = await Api.getDepartMentTree()
    console.log(data, '3342')
    departmentOptions.length = 0
    data.forEach((item: any) => {
        const obj = {
            label: item.deptName,
            value: `${item.deptName},${item.id}`,
            id: item.id,
            parentId: item.parentId,
            children: <any>[],
        }
        item.children && item.children.forEach((p: any) => {
            obj.children.push({
                label: p.deptName,
                value: `${p.deptName},${p.id}`,
                id: p.id,
                parentId: p.parentId,
            })
        })
        departmentOptions.push(obj)
    })

    let treeData: any = data.map((item: any, index: any) => {
        let op = {
            label: item.deptName,
            id: item.id,
            key: item.id,
            children: item.children && item.children.map((item: any, index: any) => {
                let ops = {
                    label: item.deptName,
                    id: item.id,
                    key: item.id,
                    children: []
                }
                return ops
            })
        }
        return op
    })
    console.log(treeData, 'treeData')
    temp.value = treeData;
}

async function rolecheck(userCode: any) {
    let datas = await Api.getroleList(userCode)
    const { data } = datas
    selectOptions.length = 0
    data.forEach((item: any, index: number) => {
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
//   {
//     key: 0,
//     name: '1',
//     age: 'asda',
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//     position: "向空间站",
//     phone: "138XXXXXX098",
//     role: "用户",
//     actions: [{
//       key: '详情',
//       index: "1"
//     }, {
//       key: '删除',
//       index: '1'
//     }]
//   },

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
let paramsAll:any = {
    current: "1", // 	当前页
    size: "10", //每页显示条数	
    account: "", // 账号
    admin: '', // 是否是企业主账户 0-主账户 1-非主账户	
    approveResult: '', // 审核状态
    type: "1", // 用户类型  1 管委会 2 企业用户
}


// 获取管委会的列表数据信息
function getAllDtas() {
    Api.getListCommunityAndEntrepise(paramsAll).then((datas: any) => {
        const { data } = datas
        const { records } = data
        createData.length = 0
        records.forEach((item: any, index: any) => {
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
                    actions: [{
                        key: '详情',
                        index: item.code
                    }, {
                        key: '删除',
                        index: item.code
                    }]
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
 * 新增item 数据
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


onMounted(() => {
    getTree()
    devided()
    getAllDtas()
    rolecheck('') // 所有的参数角色
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
let cloneObj:any

// search value 函数
function searChValue(){
    cloneObj = JSON.parse(JSON.stringify(dats.value))
    dats.value = clear(cloneObj,inputSearch.value)
}
watchEffect(()=>{
    if(inputSearch.value === ''){
        getTree()
    }
})

// 筛选过滤函数
function clear(tree:any, str:string) {
    if (!tree) return []; //处理叶节点
    let result:any = [];
    tree.map((item:any) => {
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
        password: "" // 密码框
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
    switch (form_details.name) {
        case "新增":
            isLoading.value = true
            AddListItem(form_details).then((val: any) => {
                const { code } = val
                if (code === 200) {
                    message.success('新增成功')
                } else {
                    message.success('新增失败')
                }
            })
            getAllDtas()
            break;
        case "删除":

            break;
        case "修改":
            console.log(form_details, 'deleasasda')  // 修改的详情信息
            isLoading.value = true
            PutListData(form_details).then((val: any) => {
                if (val.code === 200) {
                    message.info('修改成功!')
                } else {
                    message.info('修改失败!')
                }
            })
            getAllDtas()
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
/**
 * headClick
 */
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

function headClick(evt: string) {
    switch (evt) {
        case "修改":
            if (!index.value) {
                message.info(
                    '请先选中某一行',
                    {
                        duration: 1000
                    }
                )
            } else {
                showModalPut.value = true
                // isLoading.value = true
                console.log(index.value[0], 'sad1231231')
                console.log(createData, 'sa')
                let s = createData.filter((item: any, indx: any) => {
                    return item.code === index.value
                })
                console.log(s, 'ssasda')
                form_details.name = "修改"
                form_details.user.name = s[0].age  // 姓名
                form_details.user.account = s[0].address // 账号
                form_details.user.department = s[0].tags // 部门
                form_details.user.position = s[0].position // 职位
                form_details.user.tel = s[0].phone // 联系方式
                form_details.user.role = s[0].role // 角色
                form_details.user.key = index.value[0] // key
                form_details.user.code = s[0].code
                console.log(form_details, 'saform')
            }
            break;
        case "新增":
            showModalPut.value = true
            form_details.name = "新增"
            form_details.user.name = ''  // 姓名
            form_details.user.account = '' // 账号
            form_details.user.department = '' // 部门
            form_details.user.position = '' // 职位
            form_details.user.tel = '' // 联系方式
            form_details.user.role = '' // 角色
            form_details.user.key = '' // key            
            break;
        case "删除":
            if (!index.value) {
                message.info(
                    '请先选中某一行',
                    {
                        duration: 3000
                    }
                )
            } else {
                showModalPut.value = false
                form_details.name = "删除"
                isLoading.value = true
                console.log(batchDel, '999')
                deleItemData(index.value).then(({code}: any) => {
                    if (code === 200) {
                        message.info("删除成功!")
                    } else if ( code === 400 || code === 501) {
                        message.info('管理员账户,无法删除!')
                    } else {
                        message.info("删除失败!")
                    }
                })
                getAllDtas()
            }
            break;
        case '批量删除':
            if (!batchDel.value.length) {
                message.success('请选择删除的下标!')
                return;
            } else {
                isLoading.value = true
                delBatch(batchDel.value).then(({code}: any) => {
                    console.log(code)
                    if ([500, 501].indexOf(code) > -1) {
                        message.success('删除失败!')
                    } else if( code === 400 ){
                        message.success('管理员账户, 无法删除!') 
                    }else{
                        message.success('删除成功!') 
                    }
                })
                getAllDtas()
            }
            break;
        default:
            break;
    }
}

/**
 * 批量删除的接口
 */
async function delBatch(params: any) {
    let data = await Api.getBatchDel(params)
    return data
}

let headCon = reactive<any>([
    {
        name: "修改",
        color: "",
        type: 'info'
    },
    {
        name: "新增",
        color: "",
        type: 'warning'

    },
    {
        name: "删除",
        color: "",
        type: 'error'
    },
    {
        name: "批量删除",
        color: '',
        type: 'error'
    }
])

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
        {
            title: '操作',
            key: 'actions',
            render(row: any) {
                const tags = row.actions.map((item: any) => {
                    const { key, index } = item
                    return h(
                        NButton,
                        {
                            size: 'small',
                            type: 'info',
                            style: {
                                'margin-right': 6 + 'px',
                                'background-color': '#0486FE',
                            },
                            onClick: () => actions(item)
                        },
                        {
                            default: () => key
                        }
                    )
                })
                return tags
            }
        },
    ]
}
// 控制操作的行为
function actions(info: any) {
    console.log(info, 'sad')
    switch (info.key) {
        case "详情":
            showModalPut.value = true
            console.log(createData, 3)
            for (let i = 0; i < createData.length; i++) {
                if (createData[i].code === info.index) {
                    console.log(createData[i], '213123')
                    form_details.name = "详情"
                    form_details.user.name = createData[i].age  // 姓名
                    form_details.user.account = createData[i].address // 账号
                    form_details.user.department = createData[i].tags // 部门
                    console.log(form_details, '3423342')
                    form_details.user.position = createData[i].position // 职位
                    form_details.user.tel = createData[i].phone // 联系方式
                    form_details.user.role = createData[i].role.toString() // 角色
                    form_details.user.key = index.value[0] // key
                }
            }
            break;
        case "删除": // 行内删除
            showModalPut.value = false
            isLoading.value = true
            deleItemData(info.index).then((val: any) => {
                if (val.code === 200) {
                    message.info("删除成功!")
                } else if (val.code === 400 || val.code === 501) {
                    message.info('管理员账户,无法删除!')
                } else {
                    message.info("删除失败!")
                }
            })
            getAllDtas()
            break;
        default:
            break;
    }
}

// 创建数据
let data = createData




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