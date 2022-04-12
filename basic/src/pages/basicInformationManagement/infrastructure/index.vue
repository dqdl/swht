
<template>
    <div class="infrastructure">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- time -->
                    <n-space>
                        <span>统计周期</span>
                        <n-config-provider
                            :locale="queryInfo.zhCN"
                            :date-locale="queryInfo.dateZhCN"
                        >
                            <n-date-picker
                                :style="{ width: '100px' }"
                                v-model:value="paramcycle.year"
                                @update:value="handleUpdateValueTime1"
                                type="year"
                                clearable
                            />
                        </n-config-provider>

                        <span style="margin:0 10px;">年</span>
                        <n-select
                            :disabled="!paramcycle.year"
                            :style="{ width: '70px' }"
                            @update:value="handleUpdateValue"
                            v-model:value="paramcycle.quarter"
                            :options="quarterOptions"
                        />
                        <span style="margin:0 10px;">季度</span>
                        <n-select
                            :disabled="!paramcycle.quarter"
                            :style="{ width: '90px' }"
                            v-model:value="paramcycle.month"
                            :options="monthOptions"
                        />
                        <span style="margin:0 10px;">月</span>
                    </n-space>
                </div>
                <div class="right">
                    <n-space>
                        <n-button type="info" @click="query">查询</n-button>
                        <n-button type="warning" @click="reset">重置</n-button>
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
                        :remote="true"
                        :bordered="false"
                        :columns="tableHead"
                        :data="tableData"
                        :pagination="pagination"
                        :loading="false"
                        :row-key="(row: any) => row.key"
                        @update:checked-row-keys="handleCheck"
                        @update:page="handlePageChange"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
            <div class="topright">
                <n-space>
                    <n-button type="primary" @click="newAdd">新增</n-button>
                </n-space>
            </div>
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
                <n-form :model="form_details" ref="formRef" :rules="rules">
                    <n-form-item label="统计周期" path="user.year">
                        <!-- <n-select
                        :style="{ width: '140px' }"
                        :disabled="form_details.name === '详情'"
                        v-model:value="form_details.user.time1"
                        :options="statisticalCycleOptions"
                        />-->
                        <n-date-picker
                            :disabled="form_details.name === '详情'"
                            :style="{ width: '100px' }"
                            v-model:value="form_details.user.year"
                            @update:value="handleUpdateValueTime"
                            type="year"
                            clearable
                        />
                        <span style="margin:0 10px;">年</span>
                        <n-select
                            :disabled="form_details.name === '详情' || !form_details.user.year"
                            :style="{ width: '70px' }"
                            @update:value="handleUpdateValue"
                            v-model:value="form_details.user.quarter"
                            :options="quarterOptions"
                        />
                        <span style="margin:0 10px;">季度</span>
                        <n-select
                            :disabled="form_details.name === '详情' || !form_details.user.quarter"
                            :style="{ width: '90px' }"
                            v-model:value="form_details.user.month"
                            :options="monthOptions"
                        />
                        <span style="margin:0 10px;">月</span>
                    </n-form-item>
                    <n-form-item label="新增燃气管网长度" path="user.position">
                        <n-input
                            v-model:value="form_details.user.position"
                            :disabled="form_details.name === '详情'"
                            clearable
                            placeholder="请输入新增燃气管网长度"
                        />
                    </n-form-item>
                    <n-form-item label="新增通讯管网长度" path="user.quantity">
                        <n-input
                            v-model:value="form_details.user.quantity"
                            :disabled="form_details.name === '详情'"
                            clearable
                            placeholder="请输入新增通讯管网长度"
                        />
                    </n-form-item>
                    <n-form-item label="新增电力功能管网长度" path="user.localquantity">
                        <n-input
                            v-model:value="form_details.user.localquantity"
                            :disabled="form_details.name === '详情'"
                            clearable
                            placeholder="请输入新增电力功能管网长度"
                        />
                    </n-form-item>
                    <n-form-item label="新增电力功能管网长度" path="user.newWaterSupply">
                        <n-input
                            v-model:value="form_details.user.newWaterSupply"
                            :disabled="form_details.name === '详情'"
                            clearable
                            placeholder="请输入新增电力功能管网长度"
                        />
                    </n-form-item>
                    <n-form-item label="新增供排水管网长度" path="user.cycle">
                        <n-input
                            v-model:value="form_details.user.cycle"
                            :disabled="form_details.name === '详情'"
                            clearable
                            placeholder="请输入新增供排水管网长度"
                        />
                    </n-form-item>
                    <n-form-item label="当月新增建成道路长度" path="user.tel">
                        <n-input
                            v-model:value="form_details.user.tel"
                            :disabled="form_details.name === '详情'"
                            clearable
                            placeholder="请输入当月新增建成道路长度"
                        />
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space>
                        <n-button
                            type="info"
                            v-if="form_details.name !== '详情'"
                            @click="getNewAddForm"
                        >确认</n-button>
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
import { ref, reactive, watch, h, onMounted } from 'vue';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
import Api from '../../../axios/api/basicInformationManagement/infrastructure';
// 引入外部函数
import { dateFormat } from "../../../util/verification"

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
    system: '',
    entryTime: null
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
        id: '',
        newWaterSupply: '',
        time1: '',
        year: null,
        quarter: '',
        month: ''
    },
})
// 查询参数
let param = ref({
    statisticalCycle: "",
    current: 1,
    size: 10,
    startTime: "",
    endTime: ""
})
// 统计周期查询参数
let paramcycle = ref({
    year: null,
    quarter: '',
    month: ''
})
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
const handleUpdateValueTime1 = (value: any) => {
    if (!value) {
        paramcycle.value.quarter = "";
        paramcycle.value.month = "";
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
const getStatisticalCycle = (year: any, quarter: any, month: any) => {
    let str = "";
    year && (str = `${dateFormat(year, 'y')}年`);
    quarter && (str = `${dateFormat(year, 'y')}年-${quarter}季度`);
    month && (str = `${dateFormat(year, 'y')}年-${quarter}季度-${month}月`);
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
// 改变页面展示多少条
const handlePageSize = (pageSizes: number) => {
    param.value.current = 1;
    pagination.page = 1;
    param.value.size = pageSizes;
    getAllListData()
}
// 改变当前页
const handlePageChange = (currentPage: number) => {
    param.value.current = currentPage;
    pagination.page = currentPage;
    getAllListData()
}
// 获取统计周期下拉框
const statisticalCycle = () => {
    Api.getstatisticalCycle({
        typeNum: "statisticalCycle",
        value: ""
    }).then((res: any) => {
        if (res.code == 200) {
            statisticalCycleOptions.length = 0;
            res.data.forEach((item: any) => {
                statisticalCycleOptions.push({
                    label: item.name,
                    value: item.name
                })
            })

        }
    })
}
/**
 * 获取分页查询列表数据
 */
async function getAllListData({
    current = param.value.current,
    pageSize = param.value.size
} = {}) {
    let startTime = queryInfo.entryTime ? dateFormat(queryInfo.entryTime[0], 'y-m-d') : '';
    let endTime = queryInfo.entryTime ? dateFormat(queryInfo.entryTime[1], 'y-m-d') : '';
    let datas = await Api.getListData({
        current,
        pageSize,
        startTime,
        endTime,
        statisticalCycle: getStatisticalCycle(paramcycle.value.year, paramcycle.value.quarter, paramcycle.value.month)
    })
    tableData.length = 0;
    const { data } = datas;
    pagination.pageCount = data.pages;
    (pagination as any).itemCount = data.total
    data?.records.forEach((item: any, index: number) => {
        let ops: any = {
            key: index,
            index: index + 1,
            position: item.newPipelineNetwork,
            quantity: item.newCommunication,
            localquantity: item.newPowerFunction,
            cycle: item.monthlyNewInvestmen,
            newWaterSupply: item.newWaterSupply,
            tel: item.extendedNewBuilt,
            time1: item.statisticalCycle,
            enterTime: item.entryTime,
            id: item.id
        }
        tableData.push(ops)
    })
}
onMounted(() => {
    getAllListData()
    // statisticalCycle()
})
/**
 * methods_head
 */
// query
const query = () => {
    param.value.current = 1;
    pagination.page = 1;
    getAllListData()
}
// reset
const reset = () => {
    queryInfo.entryTime = null
    paramcycle.value.year = null;
    paramcycle.value.quarter = "";
    paramcycle.value.month = "";
    param.value.statisticalCycle = '';
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

const tableHead = reactive([
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
        width: 80,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增燃气管网长度',
        key: 'position',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增通讯管网长度',
        key: 'quantity',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增电力功能管网长度',
        key: 'localquantity',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '新增供排水管网长度',
        key: 'newWaterSupply',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },

    {
        title: '当月新增基建投资额',
        key: 'cycle',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '当月新增建成道路长度',
        key: 'tel',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '统计周期',
        key: 'time1',
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
        key: 'operation',
        fixed: 'right',
        width: 210,
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
                            onClick: () => rowDetails(row, 0)
                        },
                        { default: () => '查看' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "warning",
                            onClick: () => rowDetails(row, 1)
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
                    )
                ]
            )
        }
    }
])
// table_data
let tableData: any = reactive([
    {

    }
])
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



// 新增弹框 - 打开（显示隐藏）
const showModal_newAdd = ref(false)
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增'
    form_details.user.position = ''
    form_details.user.cycle = ''
    form_details.user.quantity = ''
    form_details.user.localquantity = ''
    form_details.user.newWaterSupply = ''
    form_details.user.tel = ''
    form_details.user.id = ''
    // form_details.user.time1 = ''
    form_details.user.year = null;
    form_details.user.quarter = '';
    form_details.user.month = '';
    showModal_newAdd.value = true
}
/**
 * 基础设施建设新增
 */
async function newAddItem(params: any) {
    let data: any = await Api.getInfraxtrue(params)
    data.code == 200 && message.success('新增成功') && getAllListData() && (showModal_newAdd.value = false);
}
async function newChangeItem(params: any) {
    let data: any = await Api.setInfraxtrue(params)
    data.code == 200 && message.success('修改成功') && getAllListData() && (showModal_newAdd.value = false);
}
// 新增弹框（表单验证规则）
const rules = {
    user: {
        year: {
            type: 'number',
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        position: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        quantity: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        localquantity: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        newWaterSupply: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        cycle: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        tel: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        }
    },
}
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增弹框 - 点击确认
const getNewAddForm = (e: any) => {
    e.preventDefault()
    const dragDivDom: any = formRef.value;
    dragDivDom.validate((errors: any) => {
        if (!errors) {
            if (form_details.name == '新增') {
                form_details.user.time1 = getStatisticalCycle(form_details.user.year, form_details.user.quarter, form_details.user.month)
                newAddItem(form_details)
            } else {
                newChangeItem(form_details)
            }
        } else {
            console.log(errors)
            message.error('请检查输入内容')
        }
    })
}

// 修改弹框
const rowDetails = (row: any, index: number) => {
    if (index === 0) {
        form_details.name = '详情'
    } else {
        form_details.name = '修改'
    }
    console.log(row.cycle, row)
    setStatisticalCycle(row.time1)
    form_details.user.id = row.id;
    form_details.user.quantity = row.quantity
    form_details.user.localquantity = row.localquantity
    form_details.user.position = row.position
    // form_details.user.cycle = row.cycle
    form_details.user.newWaterSupply = row.newWaterSupply
    form_details.user.time1 = row.time1
    form_details.user.tel = row.tel
    showModal_newAdd.value = true

}
let deleteId = ref('')
// 删除弹框 - 打开（显示隐藏）
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除吗？')
// 删除弹框
const rowDelete = (row: any, index: number) => {
    deleteId.value = row.id
    showModal_delete.value = true
}
// 删除取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除确定
const submitCallback = () => {
    Api.delete({
        id: deleteId.value
    }).then((res: any) => {
        if (res.code == 200) {
            param.value.current = 1;
            pagination.page = 1;
            message.success('删除成功')
            getAllListData()
        } else {
            message.error('删除失败')
        }
    })
}
</script>

<style lang="postcss" scoped>
.infrastructure {
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
