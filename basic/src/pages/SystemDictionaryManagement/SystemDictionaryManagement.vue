<template>
    <n-message-provider>
        <div class="container">
            <!-- 左侧导航栏 -->
            <div class="leftBar">
                <div class="headTitle">
                    <div class="button">
                        <n-button @click="changeName" type="warning">修改</n-button>
                    </div>
                </div>
                <div class="line"></div>
                <!-- <div class="searchBar">
                    <n-input type="text" size="large" placeholder="请输入字典字段或编号">
                        <template #suffix>
                            <n-icon>
                                <SearchSharp />
                            </n-icon>
                        </template>
                    </n-input>
                </div>-->
                <n-scrollbar style="max-height: 90%">
                    <div class="tree">
                        <n-tree
                            block-line
                            draggable
                            :data="datas"
                            :selected-keys="selectedKey"
                            :expanded-keys="expandedKeysRef"
                            :on-load="handleLoad"
                            @update:selected-keys="node_focus"
                            @update:expanded-keys="handleExpandedKeysChange"
                        />
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
                        <n-button @click="searchEveList" type="info">搜索</n-button>
                        <n-button @click="clearAllSearchCondition" type="error">重置</n-button>
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
                            :remote="true"
                            :bordered="false"
                            :columns="columns"
                            :max-height="1600"
                            size="large"
                            :data="data"
                            :pagination="pagination"
                            @update:page="handlePageChange"
                            @update:checked-row-keys="handleCheck"
                            @update:pageSize="handlePageSize"
                            :row-key="(row: any) => row.code"
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
            <!-- 删除模态框 -->
            <n-modal
                v-model:show="showModalDel"
                preset="dialog"
                type="error"
                show-icon="false"
                title="删除"
                :content="delete_content"
                positive-text="确认"
                negative-text="取消"
                @positive-click="submitCallback"
                @negative-click="cancelCallback"
            ></n-modal>
        </div>
    </n-message-provider>
</template>

<script lang="ts" setup>
/**
 *   委员会部门数
 */
import { ref, reactive, onMounted, Ref } from "vue"
import { SearchSharp } from '@vicons/ionicons5'

import { h } from 'vue'
import { NButton, useMessage, NCheckbox } from 'naive-ui'
import { zhCN, dateZhCN, NSpace } from 'naive-ui'
// import Api from '@/axios/api/SystemDictionaryManagement/index'
import Api from '../../axios/api/SystemDictionaryManagement/index'

const message = useMessage()


const createData: any = reactive([

])
// 分页查询参数

// pagination
const pagination = reactive({
    pageSizes: [10, 20],
    pageSize: 10,
    showSizePicker: true,
    pageCount: 1,
    page: 1,
    suffix: ({ itemCount }: any) => {
        return `总共${itemCount}条`
    }
})
// 改变页面展示多少条
const handlePageSize = (pageSizes: number) => {
    pagination.page = 1;
    pagination.pageSize = pageSizes;
    getListData()
}
/**
 * pageSize 改变时触发的回调函数
 */
function handlePageChange(evt: any) {
    pagination.page = evt;
    getListData()
}
let FieldCrossReferenceValue: any = ref('') // 字段对照值
let FieldCrossReferenceCode: any = ref('') // 字段对照码
// 分页查询结果情况
function getListData() {
    Api.listDataCheckPage(
        {
            typeCode: selectedVal.value,
            current: pagination.page,
            size: pagination.pageSize,
            name: FieldCrossReferenceValue.value,
            value: FieldCrossReferenceCode.value,
        }
    ).then((res: any) => {
        const { data: { current, records, pages, total, size, searchCount, optimizeCountSql, hitCount }, code } = res;
        (pagination as any).itemCount = total;
        if (code === 200) {
            createData.length = 0
            records && records.forEach((item: any, indey: number) => {
                createData.push({
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
                })
            })
        }
    })
}
// 根据字段对照值和字段对照码搜索
function searchEveList() {
    getListData()
}
/**
 * 清除所有搜索条件
 */
function clearAllSearchCondition() {
    FieldCrossReferenceValue.value = ''
    FieldCrossReferenceCode.value = ''
    getListData()
}
let datas: any = reactive([
    {
        label: "所有类别",
        key: "",
        children: [

        ]
    }
])
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
let editAble: Ref<boolean> = ref(false)
//选中的value值
let checkedValue: any = ref(false)
// 状态改变的值
function hendelStatus(e: EventTarget) {
    checkedValue.value = e
    form_details.user.status = checkedValue.value
}
// 获取一级
const getSystemList = async () => {
    let data: any = await Api.systemList()
    if (data.code == 200) {
        datas[0].children.length = 0;
        data.data.forEach((element: any) => {
            element.label = element.name;
            element.key = element.code;
            element.isFale = true;
            element.isLeaf = false
            datas[0].children.push(element)
        });
    }
}
const expandedKeysRef = ref<string[]>([''])
const selectedKey = ref<string[]>([''])
const selectedVal = ref<string>('')
const handleExpandedKeysChange = (expandedKeys: string[]) => {
    expandedKeysRef.value = expandedKeys
}
// 获取二级
const handleLoad = (node: any) => {
    return new Promise<void>((resolve) => {
        let param: any = {
            partition: node.code,
        }
        Api.systemListTwo(param).then((res: any) => {
            if (res.code === 200 && res.data.length > 0) {
                node.children = []
                res.data.forEach((element: any) => {
                    element.label = element.name;
                    element.key = element.code;
                    node.children.push(element)
                });
                resolve()
            } else {
                node.children = []
                resolve()
            }
        })
    })

}
// 修改获取二级名称
const changeName = () => {
    if (queryInfo.name === '' || queryInfo.value === '') {
        message.info('请选择需要修改的二级标题名称')
        return
    }
}
// 获取列表
const node_focus = (node: any, option: any) => {
    queryInfo.code = '';
    queryInfo.name = '';
    queryInfo.value = '';
    if (option && option[0].isFale) {
        if (expandedKeysRef.value.includes(node[0])) {
            let num = expandedKeysRef.value.indexOf(node[0]);
            expandedKeysRef.value.splice(num, 1);
        } else {
            expandedKeysRef.value.push(node[0]);
            // selectedKey.value = node;
        }
    } else {
        if (option[0].key != '') {
            queryInfo.code = option[0].code
            queryInfo.name = option[0].label
            queryInfo.value = option[0].num
        }
        selectedKey.value = node;
        selectedVal.value = node[0]
        getListData()
    }

}
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
let showModalPut = ref(false)
let showModalDel = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除？')
// 选中的列
const checkedRowKeys = ref([])
const onedelete = ref('')
const deleteType = ref(1)
// 删除
const rowDelete = (row: any, index: any) => {
    onedelete.value = row.code
    deleteType.value = 1
    showModalDel.value = true
}
function handleCheck(row: any) {  // 处理
    checkedRowKeys.value = row
}
const submitCallback = async () => {
    let data: any;
    if (deleteType.value === 1) {
        data = await Itemdele(onedelete.value);
    } else {
        data = await batchDelle(checkedRowKeys.value);
    }
    if (data.code === 200) {
        pagination.page = 1;
        message.success('删除成功');
        getListData()
    } else {
        message.error(`${data.message}`)
    }
}
const cancelCallback = () => {
    message.success('取消删除')
}
onMounted(() => {
    getSystemList()
    getListData()
})

const rules = {
    user: {
        name: {
            required: true,
            message: '请输入字典对照值',
            trigger: ['input', 'blur']
        },
        typeCode: {
            required: true,
            message: '请输入字典对照值',
            trigger: ['input', 'blur']
        }
    }
}

const queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    name: '',
    role: '',
    department: '',
    code: '',
    value: ''
})




// 新增弹框 - 点击确认
function getNewAddForm() {
    showModalPut.value = false
    switch (form_details.name) {
        case "新增":
            if (queryInfo.name === '' || queryInfo.value === '') {
                message.error('没有类别不能新增')
                return
            } else {
                addList(
                    {
                        "name": form_details.user.name,
                        "notes": form_details.user.position,
                        "sort": form_details.user.department,  // 排序
                        "typeCode": queryInfo.code,
                        "typeNum": queryInfo.value == '' ? null : queryInfo.value,
                        "typeName": queryInfo.name === '' ? null : queryInfo.name,
                        "valid": form_details.user.status == true ? '1' : '0',
                        "value": form_details.user.account // 字典对照码  value
                    }
                ).then((res: any) => {
                    const { code } = res
                    if (code === 200) {
                        message.success('新增成功')
                        getListData()
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
                    name: form_details.user.name,
                    notes: form_details.user.position,
                    sort: form_details.user.department,
                    typeCode: form_details.user.typeCode,
                    typeName: form_details.user.typeName,
                    typeNum: form_details.user.typeNum,
                    valid: form_details.user.status === true ? '1' : '0',
                    value: form_details.user.account
                }
            ).then((res: any) => {
                const { code } = res
                if (code === 200) {
                    getListData()
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



/**
 * headClick
 */
function headClick(evt: string) {
    switch (evt) {
        case "新增":
            if (queryInfo.name === '' || queryInfo.value === '') {
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
            }
            break;
        case '批量删除':

            if (!checkedRowKeys.value.length) {
                message.info(
                    '请先选中某一行',
                    {
                        duration: 3000
                    }
                )
                return
            }
            deleteType.value = 2
            showModalDel.value = true
            break;
        default:
            break;
    }
}
/**
 * 修改某一条记录
 */
async function modiFyLogs(params: any) {
    return await Api.modiFyLogs(params)
}
// 新增分页
async function addList(params: any) {
    let datas = await Api.addOnecategories(params)
    return datas
}
/**
 * 单删除
 */
async function Itemdele(code: any = "") {
    return await Api.deleteCateOnlyOne(code)
}
/**
 * 批量删除
 */
async function batchDelle(codeList: any[] = []) {
    return await Api.batchDelete(codeList)
}



let headCon = reactive<any>([
    {
        name: "新增",
        color: "",
        type: 'warning'

    },
    {
        name: "批量删除",
        color: "",
        type: 'error'
    }
])



const createColumns = () => {
    return [
        {
            type: 'selection',
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
    ]
}





// 创建数据
let data = createData

let columns = createColumns()


let tableData = reactive([

])


</script>

<style lang="postcss" scoped>
@import "./scss/SystemDictionaryManagement.scss";
.headTitle {
    display: flex;
    justify-content: center;
}
</style>