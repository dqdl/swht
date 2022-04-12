<template>
    <div class="investment">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- type -->
                    <!-- <n-space>
                        <span>录入时间</span>
                        <n-input
                            type="text"
                            :style="{ width: '120px' }"
                            v-model:value="queryInfo.type"
                            placeholder="请输录入时间"
                            clearable
                        />
                    </n-space>-->
                    <!-- time -->
                    <n-space>
                        <span>录入时间</span>
                        <n-config-provider
                            :locale="queryInfo.zhCN"
                            :date-locale="queryInfo.dateZhCN"
                        >
                            <n-date-picker
                                :style="{ width: '240px' }"
                                v-model:value="queryInfo.time"
                                type="daterange"
                                clearable
                            />
                        </n-config-provider>
                    </n-space>
                </div>
                <div class="right">
                    <n-space>
                        <n-button type="info" @click="query">查询</n-button>
                        <n-button type="warning" @click="reset">重置</n-button>
                    </n-space>
                </div>
                <div class="rig">
                    <n-space>
                        <n-button type="primary" @click="newAdd">新增</n-button>
                        <!-- <n-button type="primary" @click="showModal_delete = true">删除</n-button> -->
                    </n-space>
                </div>
            </div>
        </div>
        <!-- table -->
        <div class="list">
            <blue-title :propValue="'数据列表'" />
            <div class="tableList">
                <n-config-provider :locale="queryInfo.zhCN" :date-locale="queryInfo.dateZhCN">
                    <n-data-table
                        ref="table"
                        :remote="true"
                        :bordered="false"
                        :columns="tableHead"
                        :data="tableData"
                        :pagination="pagination"
                        :loading="false"
                        :row-key="(row: any) => row.key"
                        @update:page="handlePageChange"
                        @update:checked-row-keys="handleCheck"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
            <div class="topright"></div>
        </div>
        <!-- popup_newAdd and popup_form_datails-->
        <n-config-provider :locale="queryInfo.zhCN" :date-locale="queryInfo.dateZhCN">
            <n-modal
                class="custom-card"
                v-model:show="showModal_newAdd"
                preset="card"
                :style="{ width: '600px' }"
                :title="form_details.name"
                size="huge"
                :bordered="false"
                :segmented="false"
            >
                <template #header-extra></template>
                <n-form :model="form_details" :rules="rules">
                    <n-form-item label="新签约项目数(个)" path="user.position">
                        <n-input
                            v-model:value="form_details.user.position"
                            clearable
                            number
                            placeholder="请输入新签约项目数"
                        />
                    </n-form-item>
                    <n-form-item label="在建项目数(个)" path="user.quantity">
                        <n-input
                            v-model:value="form_details.user.quantity"
                            clearable
                            number
                            placeholder="请输入在建项目数"
                        />
                    </n-form-item>
                    <n-form-item label="新增建成投产数(个)" path="user.localquantity">
                        <n-input
                            v-model:value="form_details.user.localquantity"
                            clearable
                            maxlength="30"
                            placeholder="请输入新增建成投产数"
                        />
                    </n-form-item>
                    <n-form-item label="新增资本引进额(元)" path="user.cycle">
                        <n-input
                            v-model:value="form_details.user.cycle"
                            clearable
                            maxlength="30"
                            placeholder="请输入新增资本引进额"
                        />
                    </n-form-item>
                    <n-form-item label="新增万元以上项目数(个)" path="user.tel">
                        <n-input
                            v-model:value="form_details.user.tel"
                            clearable
                            maxlength="30"
                            placeholder="请输入增万元以上项目数"
                        />
                    </n-form-item>
                    <n-form-item label="新增计划投资额(元)" path="user.tel">
                        <n-input
                            v-model:value="form_details.user.time1"
                            clearable
                            maxlength="30"
                            placeholder="请输入新增计划投资额"
                        />
                    </n-form-item>
                    <n-form-item label="统计周期" path="user.time1">
                        <!-- <n-date-picker
                            v-if="form_details.name === '新增'"
                            :style="{ width: '520px' }"
                            v-model:value="form_details.user.time1"
                            type="daterange"
                            clearable
                        />
                        <n-date-picker
                            v-else
                            :style="{ width: '520px' }"
                            v-model:value="form_details.user.time2"
                            type="date"
                            clearable
                        />-->
                        <n-date-picker
                            :style="{ width: '100px' }"
                            v-model:value="form_details.user.year"
                            @update:value="handleUpdateValueTime"
                            type="year"
                            clearable
                        />
                        <span style="margin:0 10px;">年</span>
                        <n-select
                            :disabled="!form_details.user.year"
                            :style="{ width: '70px' }"
                            @update:value="handleUpdateValue"
                            v-model:value="form_details.user.quarter"
                            :options="quarterOptions"
                        />
                        <span style="margin:0 10px;">季度</span>
                        <n-select
                            :disabled="!form_details.user.quarter"
                            :style="{ width: '90px' }"
                            v-model:value="form_details.user.month"
                            :options="monthOptions"
                        />
                        <span style="margin:0 10px;">月</span>
                    </n-form-item>
                    <!-- <n-form-item label="录入时间" path="user.enterTime">
                    <n-date-picker
                        v-model:value="form_details.user.enterTime"
                        type="datetime"
                        clearable
                    />
                    </n-form-item>-->
                </n-form>
                <template #footer>
                    <n-space>
                        <n-button type="info" @click="getNewAddForm">确认</n-button>
                        <n-button type="info" @click="showModal_newAdd = false">取消</n-button>
                    </n-space>
                </template>
            </n-modal>
        </n-config-provider>

        <!-- popup_ delete-->
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
    </div>
</template>

<script lang="ts" setup>
// vue
import { ref, reactive, Ref, watch, h, onMounted } from 'vue'

// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
import { dateFormat } from "../../../util/verification";
import Api from '../../../axios/api/basicInformationManagement/investment';
import contentVue from '../../content/content.vue';

// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage()
/**
 * state_head
 */
// queryInfo
const queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    type: '',
    time: null,
    userType: '',
    system: ''
})
// form_details
const form_details = reactive({
    name: '新增',
    user: {
        quantity: "",
        localquantity: "",
        position: '',
        cycle: '',
        tel: '',
        time1: '',
        time2: 0,
        staticTime: "",
        statisticalCycle: "",
        enterTime: 12786367126,
        year: null,
        quarter: '',
        month: ''
    },
})
// role
const selectOptions = reactive(
    [
        {
            label: '超级管理员',
            value: '超级管理员'
        },
        {
            label: '普通人员',
            value: '普通人员'
        },
    ]
)
// 统计周期下拉框数据
let statisticalCycleOptions = reactive([{
}])
// 统计周期下拉框数据(季度)
let quarterOptions = reactive([{
    label: "一",
    value: "一"
}, {
    label: "二",
    value: "二"
}, {
    label: "三",
    value: "三"
}, {
    label: "四",
    value: "四"
}])
// 统计周期下拉框数据(月份)
let monthOptions = ref([{}])
// 清空年
const handleUpdateValueTime = (value: any) => {
    if (!value) {
        form_details.user.quarter = "";
        form_details.user.month = "";
    }
}
// 改变季度
const handleUpdateValue = (value: any) => {
    monthOptions.value = [];
    form_details.user.month = "";
    switch (value) {
        case "一":
            monthOptions.value = [{
                label: "1",
                value: "1"
            }, {
                label: "2",
                value: "2"
            }, {
                label: "3",
                value: "3"
            }]
            break;
        case "二":
            monthOptions.value = [{
                label: "4",
                value: "4"
            }, {
                label: "5",
                value: "5"
            }, {
                label: "6",
                value: "6"
            }]
            break;
        case "三":
            monthOptions.value = [{
                label: "7",
                value: "7"
            }, {
                label: "8",
                value: "8"
            }, {
                label: "9",
                value: "9"
            }]
            break;
        case "四":
            monthOptions.value = [{
                label: "10",
                value: "10"
            }, {
                label: "11",
                value: "11"
            }, {
                label: "12",
                value: "12"
            }]
            break;
        default:
            monthOptions.value = [{}]
            break;

    }
    console.log()
}
// 拼接统计周期
const getStatisticalCycle = () => {
    let str = "";
    form_details.user.year && (str = `${dateFormat(form_details.user.year, 'y')}年`);
    form_details.user.quarter && (str = `${dateFormat(form_details.user.year, 'y')}年-${form_details.user.quarter}季度`);
    form_details.user.month && (str = `${dateFormat(form_details.user.year, 'y')}年-${form_details.user.quarter}季度-${form_details.user.month}月`);
    return str
}
// 还原统计周期
const setStatisticalCycle = (val: any) => {
    form_details.user.year = null;
    form_details.user.quarter = "";
    form_details.user.month = "";
    let list = [];
    val && (list = val.split("-"));
    if (list[0]) {
        let date = Number(list[0].substr(0, list[0].length - 1))
        date > 0 && ((form_details.user.year as any) = getTime(date))
    }
    list[1] && (form_details.user.quarter = list[1].substr(0, list[1].length - 2))
    list[2] && (form_details.user.month = list[2].substr(0, list[2].length - 1))
}
// 时间转化为时间戳
const getTime = (time: any) => {
    let date: any = new Date(time.toString())
    let time1 = date.getTime()
    return time1
}

// // currentPage
// const handlePageChange = (currentPage: number) => {
//     console.log('currentPage =>', currentPage)
// }
onMounted(() => {
    getDataList(fenYeParams)
})
/**
 * 获取数据列表
 */
let fenYeParams: any = reactive({
    current: "1",// 当前页
    pageSize: "10", // 每页显示条数
    startTime: "",
    endTime: "",
})

async function getDataList(fenYeParams: any) {
    fenYeParams.startTime = queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '';
    fenYeParams.endTime = queryInfo.time ? dateFormat(queryInfo.time[1], 'y-m-d') : '';
    let datas = await Api.getListDataInfO({ ...fenYeParams })
    const { data } = datas
    tableData.length = 0;
    pagination.pageCount = data?.pages;
    (pagination as any).itemCount = data?.total;
    data?.records.forEach((item: any, index: number) => {
        let ops = {
            key: index,
            index: index + 1,
            id: item.id,
            position: item.newSigningNumber,
            quantity: item.underNumber,
            localquantity: item.newProduction,
            cycle: item.introduceSeveralNew,
            tel: item.newNumberTen, // 新增万元以上项目数
            time1: item.newProjectInvestment,
            staticTime: item.statisticalCycle,
            enterTime: item.entryTime
        }
        tableData.push(ops)
    })
}

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
// 改变页面展示多少条
const handlePageSize = (pageSizes: number) => {
    fenYeParams.current = 1;
    pagination.page = 1;
    fenYeParams.pageSize = pageSizes;
    getDataList(fenYeParams);
}

// 改变当前页
const handlePageChange = (currentPage: number) => {
    fenYeParams.current = currentPage;
    pagination.page = currentPage;
    getDataList(fenYeParams)
}

/**
 * methods_head
 */
// query
const query = () => {
    fenYeParams.current = 1;
    pagination.page = 1;
    getDataList(fenYeParams)
}
// reset
const reset = () => {
    queryInfo.time = null
    query()
}
/**
 * state_table
 */
// table_head
// 选中的列
const checkedRowKeys = ref([])
let index: any = ref(null)

function handleCheck(row: any) {  // 处理
    console.log(row, 'wwewe')
    index.value = row  // 下标
}

const tableHead: any = reactive([
    {
        title: '序号',
        key: 'index',
        width: 80,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新签约项目数(个)',
        key: 'position',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '在建项目数(个)',
        key: 'quantity',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增建成投产数(个)',
        key: 'localquantity',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增资本引进额(元)',
        key: 'cycle',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增万元以上项目数(个)',
        key: 'tel',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增计划投资额(元)',
        key: 'time1',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '统计周期',
        key: 'staticTime',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '录入时间',
        key: 'enterTime',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },

    {
        title: '操作',
        fixed: 'center',
        key: 'operation',
        render(row: object, index: number) {
            return h(
                NSpace,
                {
                    style: "flex-wrap:nowrap;margin-right:15px",
                    justify: "center"
                },
                [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "warning",
                            onClick: () => rowDetails(row, index)
                        },
                        { default: () => '修改' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "error",
                            onclick: () => deleRows(row, index)
                        },
                        '删除'
                    )
                ]
            )
        }
    }
])
// table_data
let tableData: any = reactive([
    {
        key: 0,
        index: 1,
        position: '张三',
        quantity: '张三张三张三张三张三张三张三张三张三张三张三张三张三',
        localquantity: '综合部',
        cycle: 'boss',
        tel: 11111111111111,
        time1: Date.now(),
        staticTime: "",
        enterTime: ''
    },
])

// 新增弹框 - 打开（显示隐藏）
const showModal_newAdd = ref(false)
// 新增弹框 - 打开
const newAdd = () => {
    fenYeParams.current = 1;
    pagination.page = 1;
    form_details.name = '新增'
    form_details.user.position = ''
    form_details.user.cycle = ''
    form_details.user.quantity = ''
    form_details.user.localquantity = ''
    form_details.user.tel = ''
    form_details.user.time1 = ''
    form_details.user.year = null;
    form_details.user.quarter = '';
    form_details.user.month = '';
    showModal_newAdd.value = true
}
// 新增弹框（表单验证规则）
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
// 新增弹框 - 点击确认
const getNewAddForm = () => {
    showModal_newAdd.value = false;
    form_details.user.statisticalCycle = getStatisticalCycle()
    postItemsToData(form_details).then(({
        code
    }: any) => {
        if (code === 200) {
            message.info('操作成功!')

            getDataList(fenYeParams)
        } else {
            message.info('输入格式错误!')
            message.error('操作失败!')
        }
    })
}

async function postItemsToData(parasm: any) {
    let data
    if (form_details.name === '详情') {
        parasm.user = { ...parasm.user, id: rowInfo.value.id }
        data = await Api.modifyData(parasm)
    } else {
        data = await Api.addNewItemsToList(parasm)
    }
    return data
}

// 修改弹框
const rowDetails = (row: any, index: number) => {
    form_details.name = '详情'
    rowInfo.value = row;
    form_details.user.quantity = row.quantity
    form_details.user.localquantity = row.localquantity
    form_details.user.position = row.position
    form_details.user.cycle = row.cycle
    form_details.user.time1 = row.time1
    setStatisticalCycle(row.staticTime)
    form_details.user.tel = row.tel
    showModal_newAdd.value = true
}

// 修改数据接口
async function modifyDatas(params: any) {
    let dats = await Api.modifyData(params)
    return dats
}

// 删除数据接口
async function deleteData(id: any) {
    let datas = await Api.delOneData(id)
    return datas
}

/**
 * 删除弹框
 */
let rowInfo: Ref<any> = ref()

const deleRows = (row: any, index: number) => {
    showModal_delete.value = true
    console.log(row);
    rowInfo.value = row
}


// 删除弹框 - 打开（显示隐藏）
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除吗？')
// 删除弹框
const rowDelete = (row: any, index: number) => {
    delete_content.value = ''
    console.log(`this is delete => ${index}`)
}
// 删除取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除确定
const submitCallback = () => {
    deleteData(rowInfo.value.id).then(({
        code
    }: any) => {
        if (code === 200) {
            fenYeParams.current = 1;
            pagination.page = 1;
            getDataList(fenYeParams)
            message.success('删除成功')
        } else {
            message.success('删除失败!')
        }
    })
}
</script>

<style lang="postcss" scoped>
.investment {
    width: 100%;
    > div {
        width: 100%;
        border-radius: 10px;
        background: #fff;
    }
    .top {
        height: 170px;
        .main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 40px 20px;
            .left {
                display: flex;
                > div {
                    display: flex;
                    align-items: center;
                    margin-right: 40px;
                }
            }
            .right {
                position: absolute;
                left: 450px;
            }
            .rig {
                position: absolute;
                right: 100px;
            }
        }
    }
    .list {
        position: relative;
        margin-top: 20px;
        .tableList {
            padding: 24px 20px 48px 20px;
        }
        .topright {
            position: absolute;
            top: 10px;
            right: 20px;
        }
    }
}
</style>