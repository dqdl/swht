<template>
    <n-message-provider>
        <div class="container">
            <!-- 左侧导航栏 -->
            <div class="leftBar">
                <div class="headTitle">
                    <div class="button">
                        <n-button
                            v-for="(item, index) of headSelectOption"
                            :key="item.id"
                            :type="item.type"
                            @click="item_head_click(item.name)"
                        >{{ item.name }}</n-button>
                    </div>
                </div>
                <div class="line"></div>
                <div class="searchBar">
                    <n-input
                        type="text"
                        v-model:value="inputValueSearch"
                        size="large"
                        placeholder="请输入字典字段或编号"
                    >
                        <template #suffix>
                            <n-icon
                                :style="{
                                    cursor: 'pointer'
                                }"
                            >
                                <SearchSharp @click="searChTreeValue" />
                            </n-icon>
                        </template>
                    </n-input>
                </div>
                <n-scrollbar style="max-height: 100%">
                    <div class="tree">
                        <!-- checkable -->
                        <n-tree
                            @update:checked-keys="updateCheckedKeys"
                            @update:selected-keys="node_focus"
                            :data="datas"
                            selectable
                            key-field="key"
                            default-expand-all
                            cascade
                        ></n-tree>
                    </div>
                </n-scrollbar>
            </div>
            <div class="rightTable">
                <!-- 首部搜索栏 -->
                <div class="headSearch">
                    <!-- 字段对照值 -->
                    <div class="contrast">
                        <span>字段对照值</span>
                        <n-input
                            v-model:value="FieldCrossReferenceValue"
                            type="text"
                            placeholder="字段对照值"
                        />
                    </div>
                    <!-- 字段对照码 -->
                    <div class="contrastCode">
                        <span>字段对照码</span>
                        <n-input
                            v-model:value="FieldCrossReferenceCode"
                            type="text"
                            placeholder="字段对照码"
                        />
                    </div>
                    <div class="listbutton">
                        <n-button type="info" @click="searchEveList">搜索</n-button>
                        <n-button type="error" @click="clearAllSearchCondition">重置</n-button>
                    </div>
                </div>
                <!-- // 头部控制栏 -->
                <div class="headControl">
                    <div class="text">数据列表</div>
                    <div class="allCon">
                        <div class="Con" v-for="(item, index) of headCon" :key="index">
                            <n-button
                                @click="headClick(item.name)"
                                :type="item.type"
                            >{{ item.name }}</n-button>
                        </div>
                    </div>
                </div>
                <div class="footerTable">
                    <n-config-provider :locale="queryInfo.zhCN" :date-locale="queryInfo.dateZhCN">
                        <n-data-table
                            :virtual-scroll="true"
                            ref="table"
                            :columns="columns"
                            :max-height="1600"
                            size="large"
                            :bordered="false"
                            :data="data"
                            :pagination="pagination"
                            @update:checked-row-keys="handleCheck"
                            @update:page="handlePageChange"
                            @update:pageSize="handlePageSize"
                            :row-key="(row: any) => row"
                        />
                    </n-config-provider>
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
                    <n-form-item label="字典对照值" path="user.name">
                        <n-input
                            v-model:value="form_details.user.name"
                            clearable
                            placeholder="请输入字典对照值"
                            :disabled="editAble"
                        />
                    </n-form-item>
                    <n-form-item label="字典对照码" path="user.account">
                        <n-input
                            v-model:value="form_details.user.typeCode"
                            clearable
                            placeholder="请输入字典对照码"
                            :disabled="editAble"
                        />
                    </n-form-item>
                    <n-form-item label="字典排序" path="user.department">
                        <n-input
                            type="number"
                            v-model:value="form_details.user.department"
                            clearable
                            placeholder="请输入字典排序"
                            :disabled="editAble"
                        />
                    </n-form-item>
                    <n-form-item label="概述说明" path="user.position">
                        <n-input
                            v-model:value="form_details.user.position"
                            clearable
                            placeholder="请输入概述说明"
                            :disabled="editAble"
                        />
                    </n-form-item>
                    <n-form-item label="启用状态:" path="user.status">
                        <n-space>
                            <n-checkbox
                                v-model:checked="checkedValue"
                                @update-checked="hendelStatus"
                                :style="{
                                    position: 'relative',
                                    top: -35 + 'px',
                                    left: 80 + 'px'
                                }"
                                :disabled="editAble"
                            ></n-checkbox>
                        </n-space>
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space>
                        <n-button type="info" :disabled="editAble" @click="getNewAddForm">确认</n-button>
                        <n-button type="info" :disabled="editAble" @click="showModalPut = false">取消</n-button>
                    </n-space>
                </template>
            </n-modal>
            <!-- 左侧树结构修改 -->
            <n-modal
                v-model:show="showTreeModel"
                :mask-closable="false"
                class="custom-card"
                preset="card"
                :title="opelModelText"
                content="你确认"
                positive-text="确认"
                negative-text="取消"
                :bordered="false"
                :segmented="segmented2"
                :style="bodyStyle2"
                :append-to-body="true"
            >
                <template #header-extra></template>
                <n-input v-model:value="character_name" :placeholder="PromptLanguage"></n-input>
                <n-input
                    :style="{
                        'margin-top': 40 + 'px'
                    }"
                    v-model:value="character_num"
                    :placeholder="PromptLanguageNum"
                ></n-input>
                <n-input
                    :style="{
                        'margin-top': 40 + 'px'
                    }"
                    v-model:value="character_notes"
                    :placeholder="PromptLanguageNotes"
                ></n-input>
                <template #footer>
                    <n-space :style="{ 'margin-left': 425 + 'px' }">
                        <n-button type="info" @click="onPositiveClick">确认</n-button>
                        <n-button type="info" @click="showTreeModel = false">取消</n-button>
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
import { ComputedRef, ref, reactive, watch, Ref, onMounted, watchEffect } from "vue"
import { SearchSharp } from '@vicons/ionicons5'
import manage from "@/assets/images/ylymanage.png"
import listTree from '@components/listTree/listTree.vue'
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage, NRadioButton, NCheckbox } from 'naive-ui'
import { zhCN, dateZhCN, NSpace } from 'naive-ui'
import Api from '../../axios/api/GeneralDictionaryManagement/index'
import { el } from "date-fns/locale"


const message = useMessage()

/**
 * 获取列表查询数据
 */
let createData: any = reactive([])

// 总共的条数
let alldatats = ref(createData.length) || ref()

let pagenation: any = ref('8')

//选中的value值
let checkedValue: any = ref(false)
// 改变的check值
// function  handleChange (e:any) {
//         checkedValueRef.value = e.target.value
// }
// 状态改变的值
function hendelStatus(e: EventTarget) {
    checkedValue.value = e
    form_details.user.status = checkedValue.value
}

// queryInfo
const queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    type: '',
    time: null,
    userType: '',
    system: ''
})

// 分页查询参数

let pageDivide: any = reactive({
    current: "1",
    size: '10',
    name: "",  // 字典名称 查询的字典名称
    value: "", // 字典值, 查询的字典值
    typeCode: "" // 字典类型唯一标识
    // code:""
})


let editAble: Ref<boolean> = ref(false)


let FieldCrossReferenceValue: any = ref('') // 字段对照值
let FieldCrossReferenceCode: any = ref('') // 字段对照码

/**
 * 列表查询的params
 */
let listTypeCodeCheck: any = reactive({
    name: FieldCrossReferenceValue.value,  // 字典名称 查询的字典名称
    value: FieldCrossReferenceCode.value, // 字典值, 查询的字典值
})
/**
 * 搜索树结点
 */
let inputValueSearch: Ref<string> = ref('')


function searChTreeValue() {
    let cloneDatas = JSON.parse(JSON.stringify(datas))
    datas[0].children.length = 0
    datas[0].children = cloneDatas[0]?.children && (cloneDatas[0]?.children.filter((item: any) => {
        return item.label?.indexOf(inputValueSearch.value) > -1
    }))
}

// 拉取全部树列表
watchEffect(() => {
    if (inputValueSearch.value === '') {
        SelectList()
    }
})


// pagination
const pagination = reactive({
    pageSizes: [10, 20],
    showSizePicker: true,
    pageCount: 1,
    page: 1,
    suffix: ({ itemCount }: any) => {
        return `总共${itemCount}条`
    }
})


function listData() {
    Api.checkListDatas(
        {
            current: pageDivide.current,
            size: pageDivide.size,
            // name: listTypeCodeCheck.name === '' ? null : listTypeCodeCheck.name,  // 字典名称 查询的字典名称
            // value: listTypeCodeCheck.value === '' ? null : listTypeCodeCheck.value, // 字典值, 查询的字典值
            name: FieldCrossReferenceValue.value,
            value: FieldCrossReferenceCode.value,
            typeCode: pageDivide.typeCode // 字典类型唯一标识
        }
    ).then((res: any) => {
        console.log(res, 'sortrt')
        const { data: { records, current, total, size, pages } } = res
        createData.length = 0
        alldatats.value = total
        pagination.pageCount = data.pages;
        (pagination as any).itemCount = alldatats.value
        records && records.forEach((item: any, indey: number) => {
            createData.push(
                {
                    key: 0,
                    index: indey + 1,
                    age: item.name,
                    name: item.name,
                    address: item.value,
                    department: item.sort,
                    position: item.notes,
                    phone: item.valid,
                    riskNumber: item.riskNumber,
                    code: item.code,
                    typeCode: item.typeCode,
                    typeName: item.typeName,
                    typeNum: item.typeNum
                }
            )
        })
        pagenation.value = size
    })
}
// 新增分页
async function addList(params: any) {
    let datas = await Api.addList(params)
    return datas
}

let selectValues: any = ref('')


// let data = createData
let datas: any = reactive([
    {
        label: "所有类别",
        key: "1,所有类别",
        children: [
            {
                label: "功能区",
                key: "11",
                children: []
            },
            {
                label: "风险等级",
                key: "12",
                children: []
            },
            {
                label: "企业行业",
                key: "13",
                children: []
            },
            {
                label: "企业证书",
                key: "14",
                children: []
            },
            {
                label: "风险类型",
                key: "15",
                children: []
            },
            {
                label: "伤害类型",
                key: "16",
                children: []
            },
            {
                label: "企业类型",
                key: "17",
                children: []
            },
            {
                label: "环保设施类型",
                key: "18",
                children: []
            },
            {
                label: "安全事件类型",
                key: "19",
                children: []
            }
        ]
    }
])
/**
 * 下拉框列表
 */
function SelectList() {
    Api.listDataXia().then((res: any) => {
        console.log(res, 'sada')
        const { code, data } = res
        datas[0].children = []
        code === 200 && (datas[0].children = data.map((item: any) => {
            return {
                label: item.name,
                key: `${item.num},${item.name},${item.code},${item.notes}`
            }
        })
        )
        if (code !== 200) {
            message.info('列表树获取失败!')
        }
    })
}
/**
 * 批量删除树
 */
async function BatchDeleteTree(codeList: any) {
    return await Api.batchDel2(codeList)
}

// 改变当前页
const handlePageChange = (currentPage: number) => {
    pageDivide.current = currentPage;
    pagination.page = currentPage;
    listData()
}

// 改变页面展示多少条
const handlePageSize = (pageSizes: number) => {
    pageDivide.current = 1;
    pagination.page = 1;
    pageDivide.size = pageSizes;
    listData()
}


onMounted(() => {
    listData()
    SelectList()
})

function handleUpdateValue(value: any, option: any) {
    // console.log(value)
    // console.log(option.label)
    pagenation.value = Number(option.label)
}

const form_details = reactive<any>({
    name: '新增',
    user: {
        name: '',
        account: "",
        department: '',
        position: '',
        tags: '',
        role: '',
        tel: '',
        code: '',
        typeCode: '',
        typeName: '',
        typeNum: '',
        status: ''
    },
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


// 模态框
let showModalAdd = ref(false)
let showModalPut = ref(false)
let showModalDel = ref(false)

/**
 * 修改某一条记录
 */

async function modiFyLogs(params: any) {
    return await Api.modifyLogs(params)
}


/**
 * 列表项选中的类型code
 */
let listTypeCode: any = ref('')

// 新增弹框 - 点击确认
function getNewAddForm() {
    showModalPut.value = false
    console.log(form_details, '新增的详情信息')  // 新增的详情信息
    switch (form_details.name) {
        case "新增":
            console.log(form_details, '新增的详情信息')  // 新增的详情信息
            console.log(pageDivide, 'klljljl')
            if (pageDivide.name === '' || pageDivide.value === '') {
                message.error('没有类别不能新增')
                return
            } else {
                addList(
                    {
                        // "code": pageDivide.code,
                        "code": null,
                        "data": "",
                        // "dictCodeList": [], 
                        // "dictTypeCodeList": [],
                        "name": form_details.user.name,
                        "notes": form_details.user.position,
                        "sort": form_details.user.department,  // 排序
                        // "typeCode": pageDivide.code === '' ? null : pageDivide.code,
                        "typeCode": listTypeCode.value,
                        "typeNum": pageDivide.value == '' ? null : pageDivide.value,
                        "typeName": pageDivide.name === '' ? null : pageDivide.name,
                        "valid": form_details.user.status == true ? '1' : '0',
                        "value": form_details.user.account // 字典对照码  value
                    }
                ).then((res: any) => {
                    const { code } = res
                    if (code === 200) {
                        message.success('新增成功')
                    } else {
                        message.error('新增失败')
                    }
                })
            }
            break;
        case "修改":
            console.log(form_details, 'deleasasda')  // 修改的详情信息
            modiFyLogs(
                {
                    code: form_details.user.code,
                    data: '',
                    // dictCodeList: [],
                    // dictTypeCodeList: [],
                    name: form_details.user.name,
                    notes: form_details.user.position,
                    sort: form_details.user.department,
                    typeCode: form_details.user.typeCode,
                    // "typeName": pageDivide.name == '' ? null : pageDivide.name,
                    // "typeNum": pageDivide.value == '' ? null : pageDivide.value,
                    typeName: form_details.user.typeName,
                    typeNum: form_details.user.typeNum,
                    valid: form_details.user.status === true ? '1' : '0',
                    value: form_details.user.account
                }
            ).then((res: any) => {
                const { code } = res
                if (code === 200) {
                    listData()
                    message.success('修改成功!')
                } else {
                    message.error('修改失败!')
                    message.info(`${res.message}`)
                }
            })
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


let value = ref('')


// watch
watch(() => [FieldCrossReferenceValue.value,
FieldCrossReferenceCode.value], (prev, next) => {
    if (prev) {
    } else {
        console.log(next, 'next');
    }
},
    {
        deep: true,
        immediate: true
    })

// 根据字段对照值和字段对照码搜索
function searchEveList() {
    listData()
}
/**
 * 清除所有搜索条件
 */
function clearAllSearchCondition() {
    FieldCrossReferenceValue.value = ''
    FieldCrossReferenceCode.value = ''
    listData()
}

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
    index.value = row[0]
    console.log(index.value, 'sda')
    // 批量删除
    batchDel.value = row
}

function headClick(evt: string) {
    console.log(evt, 'sada')
    switch (evt) {
        case "修改":
            console.log(index.value, 'sad')
            if (!index.value) {
                message.info(
                    '请先选中某一行',
                    {
                        duration: 1000
                    }
                )
            } else {
                editAble.value = false
                showModalPut.value = true
                console.log(index.value, 'sad1231231')
                let s = createData.filter((item: any, indx: any) => {
                    return item.code === index.value.code
                })
                console.log(s, 'ssasda')
                form_details.name = "修改"
                form_details.user.name = s[0].age  // 姓名
                form_details.user.account = s[0].address // 账号
                form_details.user.department = s[0].sort // 部门
                form_details.user.position = s[0].position // 职位
                form_details.user.code = s[0].code
                form_details.user.typeCode = s[0].typeCode
                form_details.user.typeName = s[0].typeName
                form_details.user.typeNum = s[0].typeNum
                // form_details.user.tel = s[0].phone // 联系方式
                // form_details.user.role = s[0].role // 角色
                // form_details.user.key = index.value[0] // key
                console.log(form_details, 'sa')
                form_details.user.status = s[0].phone === 1 ? true : false // 职位
                checkedValue.value = s[0].phone === 1 ? true : false

            }
            break;
        case "新增":
            if (pageDivide.name === '' || pageDivide.value === '') {
                message.info('没有类别不能新增')
                return
            } else {
                editAble.value = false
                showModalPut.value = true
                form_details.name = "新增"
                form_details.user.account = ''
                form_details.user.name = ''
                form_details.user.position = ''
                form_details.user.department = ''
                form_details.user.tel = ''
                form_details.user.typeCode = ''
                form_details.user.role = ''
                form_details.user.key = ''
                form_details.user.status = checkedValue.value
                console.log(form_details, 'form_detailsform_details')
                console.log(evt, 'lllllllllsada')
            }
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
                editAble.value = false
                showModalPut.value = false
                form_details.name = "删除"
                console.log(index.value.code, 'llllkkkkkjjjjj')
                // console.log(form_details, '删除控制lsform_details')
                Itemdele(index.value.code).then((res: any) => {
                    const { code } = res
                    if (code === 200) {
                        message.success('删除成功')
                    } else {
                        message.error('删除失败!')
                    }
                })
            }
            break;
        case '批量删除':
            // console.log('批量删除')
            console.log(batchDel.value, '888')
            if (!batchDel.value.length) {
                message.info(
                    '请先选中某一行',
                    {
                        duration: 3000
                    }
                )
                return
            }
            let codeList = batchDel.value && batchDel.value.map((item: any, indey: number) => {
                return item.code
            })
            batchDelle(codeList).then((res: any) => {
                const { code } = res
                code === 200 && message.success('批量删除成功!')
            })

            break;
        case '查看':
            if (!index.value) {
                message.info(
                    '请先选中某一行',
                    {
                        duration: 1000
                    }
                )
                return;
            } else {
                showModalPut.value = true
                editAble.value = true
                console.log(index.value, 'sad1231231')
                let s = createData.filter((item: any, indx: any) => {
                    return item.code === index.value.code
                })
                console.log(s, 'ssasda')
                form_details.name = "查看"
                form_details.user.name = s[0].age  // 姓 名
                form_details.user.account = s[0].address // 账号
                form_details.user.department = s[0].sort // 部门
                form_details.user.position = s[0].position // 职位
                form_details.user.status = s[0].phone === 1 ? true : false // 职位
                checkedValue.value = s[0].phone === 1 ? true : false
            }
            break;
        default:
            break;
    }
}

async function Itemdele(code: any = "") {
    return await Api.deleteCateOnlyOne(code)
}
/**
 * 批量删除
 */
async function batchDelle(codeList: any[] = []) {
    return await Api.batchDelete(codeList)
}

/**
 * 结点选中时的回调函数
 */
let columns = reactive([
    {
        type: 'selection',
        options: [
            'all',
            'none',
            {
                onSelect: (pageData: any) => {
                    console.log(pageData, 'pageDatapageData')
                    checkedRowKeys.value = pageData
                }
            }

        ]
    },
    {
        title: '序号',
        key: 'index',
        align: 'center'
    },
    {
        title: '字典对照值',
        key: 'name',
        align: 'center'
    },
    {
        title: '字典对照码',
        key: 'typeCode',
        align: 'center'
    },
    {
        title: '字典排序',
        key: 'department',
        align: 'center'
    },
    {
        title: '概述说明',
        key: 'position',
        align: 'center'
    },

    {
        title: '是否启用',
        key: 'phone',
        align: 'center',
        render: function (row: any) {
            // console.log(row.phone,'roeoroer')
            return h(
                NCheckbox,
                {
                    size: 'medium',
                    style: {
                        border: 'none'
                    },
                    disabled: true,
                    checked: row.phone === 1 ? true : false
                },
                {

                }
            )
        }
    },
    {
        title: '操作',
        align: 'center',
        key: 'operation',
        width: 300,
        fixed: 'right',
        render(row: object, index: number) {
            return h(
                NSpace, {
                justify: "end"
            },
                [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "info",
                            onClick: () => rowDetails(row, index)
                        },
                        { default: () => '查看' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "warning",
                            onClick: () => rowEdit(row, index)
                        },
                        { default: () => '修改' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "error",
                            onClick: () => rowDelete(row, index)
                        },
                        { default: () => '删除' }
                    ),
                ]
            )
        }
    }
])
let selectOptins: Ref<any[]> = ref([])
// 单行列表点击选中
function node_focus(evt: any) {
    console.log(evt, '结点')
    if (evt[0].split(',')[1] === '所有类别') {
        pageDivide.name = ''
        pageDivide.value = ''
    } else {
        pageDivide.name = evt[0].split(',')[0]
        pageDivide.value = evt[0].split(',')[1]
        listTypeCode.value = evt[0].split(',')[2]
        pageDivide.typeCode = evt[0].split(',')[2]
    }
    console.log(4343432323,pageDivide.name,pageDivide.value)
    let flag = columns.some((item: any) => {
        return item.key === 'riskNumber'
    })
    let strList = ['发生事故产生的后果', '事故发生的可能性', '发生事故产生的后果', '风险等级划分']
    !flag && strList.includes(evt[0].split(',')[1]) && columns.splice(6, 0, {
        title: '分数值',
        key: 'riskNumber',
        align: 'center'
    });
    flag && !strList.includes(evt[0].split(',')[1]) && columns.splice(6, 1);
    selectOptins.value = evt
    listData()
}

function updateCheckedKeys(v: any) {
    selectOptins.value = v
    console.log(v, 'vvvvvvvv');
}

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

/**
 * 新增一条左侧树记录
 */
async function addOneLogs(params: any) {
    return await Api.addOnecategories(params)
}
/**
 * 删除一条左侧的树记录
 */
async function delOneCategories(code: any) {
    return await Api.deleteCateOnlyOne(code)
}
/**
 * 修改一条记录
 */
async function updateOneCate(params: any) {
    return await Api.updateOneCategory(params)
}


// 是否展示左侧model树
let showTreeModel: Ref<boolean> = ref(false)
let opelModelText: Ref<string> = ref('')
// 模态框进入效果
let segmented2: Record<string, any> = reactive({
    content: 'soft',
    footer: 'soft'
})
// 模态框大小
let bodyStyle2 = {
    width: '600px',
    height: '400px'
}
// ，input 提示语
let PromptLanguage: Ref<string> = ref('')
// num 提示语
let PromptLanguageNum: Ref<string> = ref('')
// notes  
let PromptLanguageNotes: Ref<string> = ref('')

// 绑定字段名
let character_name: Ref<string> = ref('')
// 绑定num
let character_num: Ref<string> = ref('')
// notes
let character_notes: Ref<string> = ref('')

// 确定
function onPositiveClick() {
    showTreeModel.value = false
    console.log(11111, opelModelText.value)
    if (opelModelText.value === '新增') {
        // 新增左侧一条记录
        addOneLogs(
            {
                code: "",
                // dictTypeCodeList: [],
                name: character_name.value ? character_name.value : null,
                notes: character_notes.value ? character_notes.value : null,
                num: character_num.value ? character_num.value : null,
                valid: 1
            }
        ).then((res: any) => {
            const { code }: any = res
            console.log(code, res, 'codecode');
            if (code === 200) {
                SelectList();
                message.info('操作成功!')
            }
            if (code !== 200) {
                message.info('操作失败!')
            }
        })
    } else if (opelModelText.value === '修改') {
        updateOneCate({
            code: pageDivide.typeCode,
            // dictTypeCodeList: [],
            name: character_name.value ? character_name.value : null,
            notes: character_notes.value ? character_notes.value : null,
            num: character_num.value ? character_num.value : null,
        }).then((res: any) => {
            const { code } = res
            code === 200 && message.info('操作成功!') && SelectList()
            if (code !== 200) {
                message.info('操作失败!')
            }
        })
    }
}
/**
 * head 点击
 */

function item_head_click(evt: string) {
    switch (evt) {
        case '新增':
            // if (!selectOptins.value.length) {
            //     message.info("请先选中树分支")
            //     return;
            // } else if (selectOptins.value.length > 1) {
            //     message.info('不可选中多个分支')
            //     return;
            // } else {
            console.log(selectOptins.value, '8988989')
            console.log(datas, 'datsasd')
            showTreeModel.value = true
            opelModelText.value = '新增'
            PromptLanguage.value = '请输入类型名称'
            PromptLanguageNum.value = '请输入类型编码'
            PromptLanguageNotes.value = '请输入类型描述'
            character_name.value = ''
            character_num.value = ''
            character_notes.value = ''

            // }
            break;
        case '删除':
            if (!selectOptins.value.length) {
                message.info("请先选中树分支")
                return;
            } else if (selectOptins.value.length > 0) {
                // message.info('不可选中多个分支')
                let codeList = selectOptins.value.map((item, index) => {
                    return item?.split(',')[2]
                })
                codeList = codeList.filter((item: any) => item !== undefined)
                console.log(codeList, 'kkk');
                BatchDeleteTree(codeList).then(({ code }: any) => {
                    if (code === 200) {
                        SelectList()
                        message.success('批量删除结点成功!')
                    } else {
                        message.error('批量删除结点失败!')
                    }
                })
                return;
            } else {
                console.log(selectOptins, 'selectOptins');

            }
            break;
        case '修改':
            if (!selectOptins.value.length) {
                message.info("请先选中树分支")
                return;
            } else if (selectOptins.value.length > 1) {
                message.info('不可选中多个分支')
                return;
            } else {
                showTreeModel.value = true
                opelModelText.value = '修改'
                PromptLanguage.value = '请输入修改字段'
                PromptLanguageNum.value = '请输入类型编码'
                PromptLanguageNotes.value = '请输入类型描述'
                character_name.value = selectOptins.value[0].split(",")[1]
                character_num.value = selectOptins.value[0].split(",")[3] === null ? '' : selectOptins.value[0].split(",")[3]
                character_notes.value = selectOptins.value[0].split(",")[0]
            }
            break;
        default:
            break;
    }
}



/**
 * 新增字典表
 */
function handleClickAdd() {

}
/**
 *
 * 修改字典表
 */
function handleClickPut() {

}
/**
 *  删除字典表
 */
function handleClickDel() {

}
/**
 * 结点勾选时的回调函数
 */
function node_click(evt: any) {
    console.log(evt, '结点勾选')
}

let headCon = reactive<any>([
    // {
    //     name: '查看',
    //     color: "",
    //     type: "primary"
    // },
    // {
    //     name: "修改",
    //     color: "",
    //     type: 'info'
    // },
    {
        name: "新增",
        color: "",
        type: 'warning'

    },
    // {
    //     name: "删除",
    //     color: "",
    //     type: 'error'
    // },
    {
        name: "批量删除",
        color: "",
        type: "error"
    }
])





//查看
const rowDetails = (row: any, index: any) => {
    console.log(row, 'chakn');
    showModalPut.value = true
    editAble.value = true
    form_details.user.name = row.age
    form_details.user.account = row.address
    form_details.user.department = row.department
    form_details.user.position = row.position
    checkedValue.value = row.phone === 1 ? true : false
    form_details.name = '查看'

}
// 修改

const rowEdit = (row: any, index: any) => {
    console.log(row, 'edit');
    editAble.value = false
    showModalPut.value = true
    form_details.user.name = row.age
    form_details.user.account = row.address
    form_details.user.department = row.department
    form_details.user.position = row.position
    checkedValue.value = row.phone === 1 ? true : false
    form_details.name = '修改'
    form_details.user.typeCode = row.typeCode
    form_details.user.code = row.code
    form_details.user.typeName = row.typeName
    form_details.user.typeNum = row.typeNum
}
// 删除
const rowDelete = (row: any, index: any) => {
    console.log(row, 'shanchu');
    editAble.value = false
    showModalPut.value = false
    delOneCategories(row.code).then((res: any) => {
        const { code } = res
        code === 200 && message.info("删除树结点成功!")
        if (code !== 200) {
            message.info("删除树结点失败!")
        }
    })
}


// 控制操作的行为
function actions(info: any) {
    console.log(info, 'sad')
    switch (info.key) {
        case "详情":
            showModalPut.value = true
            for (let i = 0; i < createData.length; i++) {
                if (i === Number(info.index) - 1) {
                    console.log(createData[i], '213123')
                    form_details.name = "详情"
                    form_details.user.name = createData[i].age  // 姓名
                    form_details.user.account = createData[i].address // 账号
                    form_details.user.department = createData[i].tags.toString() // 部门
                    form_details.user.position = createData[i].position // 职位
                    form_details.user.tel = createData[i].phone // 联系方式
                    form_details.user.role = createData[i].role // 角色
                    // form_details.user.key = index.value[0] // key
                }
            }
            break;
        case "删除":
            console.log(2)
            showModalPut.value = true

            break;
        default:
            break;
    }
}





// 创建数据
let data = createData


// // 分页  共多少页
// let pagination = {
//     pageSize: Number(pagenation.value)
// }

let tableData = reactive([

])


</script>

<style lang="postcss" scoped>
@import "./scss/GeneralDictionaryManagement.scss";
</style>