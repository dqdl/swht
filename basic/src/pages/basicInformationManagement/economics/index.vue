<template>
    <div class="landPlan">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <n-space>
                        <span>功能区</span>
                        <n-config-provider
                            :locale="queryInfo.zhCN"
                            :date-locale="queryInfo.dateZhCN"
                        >
                            <n-select
                                :style="{ width: '140px' }"
                                v-model:value="queryInfo.functionalAreas"
                                :options="selectOptions"
                            />
                        </n-config-provider>
                    </n-space>
                    <n-space>
                        <span>选择录入时间</span>
                        <n-config-provider
                            :locale="queryInfo.zhCN"
                            :date-locale="queryInfo.dateZhCN"
                        >
                            <n-date-picker
                                :style="{ width: '240px' }"
                                v-model:value="queryInfo.entryTime"
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
                    <n-form-item label="统计周期" path="list.year">
                        <!-- <n-select
                            :disabled="form_details.name === '详情'"
                            :style="{ width: '140px' }"
                            v-model:value="form_details.list.statisticalCycle"
                            :options="statisticalCycleOptions"
                        />-->
                        <n-date-picker
                            :disabled="form_details.name === '详情'"
                            :style="{ width: '100px' }"
                            v-model:value="form_details.list.year"
                            @update:value="handleUpdateValueTime"
                            type="year"
                            clearable
                        />
                        <span style="margin:0 10px;">年</span>
                        <n-select
                            :disabled="form_details.name === '详情' || !form_details.list.year"
                            :style="{ width: '70px' }"
                            @update:value="handleUpdateValue"
                            v-model:value="form_details.list.quarter"
                            :options="quarterOptions"
                        />
                        <span style="margin:0 10px;">季度</span>
                        <n-select
                            :disabled="form_details.name === '详情' || !form_details.list.quarter"
                            :style="{ width: '90px' }"
                            v-model:value="form_details.list.month"
                            :options="monthOptions"
                        />
                        <span style="margin:0 10px;">月</span>
                    </n-form-item>
                    <n-form-item label="功能区" path="list.functionalAreas">
                        <n-select
                            :disabled="form_details.name === '详情'"
                            :style="{ width: '140px' }"
                            v-model:value="form_details.list.functionalAreas"
                            :options="selectOptions"
                        />
                    </n-form-item>
                    <n-form-item label="规上企业数量" path="list.rulesOnNumber">
                        <n-input
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.rulesOnNumber"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="新建投资" path="list.newInvestment">
                        <n-input
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.newInvestment"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="技改投资" path="list.technicalRenovationInvestment">
                        <n-input
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.technicalRenovationInvestment"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="工业产值" path="list.industrialOutput">
                        <n-input
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.industrialOutput"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="实现税收" path="list.implementTax">
                        <n-input
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.implementTax"
                            clearable
                        />
                    </n-form-item>
                    <n-space>
                        <n-button v-if="btnNum != 2" type="info" @click="getNewAddForm">确认</n-button>
                        <n-button type="info" @click="showModal_newAdd = false">取消</n-button>
                    </n-space>
                </n-form>
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
import { ref, reactive, onMounted, h } from 'vue'
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui'
// components
import blueTitle from '@components/public/title/index.vue'
// api接口
import economics from "../../../axios/api/basicInformationManagement/economics"
// 引入外部函数
import { dateFormat } from "../../../util/verification"
// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage()
// table_head
// 选中的列
const checkedRowKeys = ref([])
let index: any = ref(null)
function handleCheck(row: any) {  // 处理
    console.log(row, 'wwewe')
    index.value = row  // 下标
}
// 表格类型
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
        title: '功能区',
        key: 'functionalarea',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '规上企业注册资本规模',
        key: 'planning',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    }, {
        title: '新建投资',
        key: 'newInvestment',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '技改投资',
        key: 'transformation',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '工业产值',
        key: 'industrial',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '实现税收',
        key: 'taxrevenue',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '统计周期',
        key: 'cycle',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '录入时间',
        key: 'time1',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        key: 'operation',
        align: 'right',
        width: 260,
        render(row: object, index: number) {
            return h(
                NSpace, {
                justify: "end"
            },
                [h(
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
                        onClick: () => rowChange(row, index)
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
// 表格数据
const tableData = reactive([
    {

    }
])
// 分页器配置
let pagination = reactive({
    pageSizes: [10, 20],
    showSizePicker: true,
    pageCount: 1,
    page: 1,
    suffix: ({ itemCount }: any) => {
        return `总共${itemCount}条`
    }
})
// 请求查询列表参数
let param = ref({
    current: 1,
    size: 10,
    entryTime: '',
    functionalAreas: "",
    startTime: "",
    endTime: ""
})
// 查询条件显示
let queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    entryTime: null,
    functionalAreas: ""
})

// 新增详情修改数据
const form_details = reactive({
    name: '新增',
    list: {
        statisticalCycle: '',
        functionalAreas: "",
        newInvestment: "",
        industrialOutput: "",
        implementTax: "",
        rulesOnNumber: "",
        technicalRenovationInvestment: "",
        year: null,
        quarter: "",
        month: ""
    },
})
// 删除（修改）单个的id
let deleteId = ref(0)
// 功能区下拉框数据
let selectOptions = reactive([{
}])
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
        form_details.list.quarter = "";
        form_details.list.month = "";
    }
}
// 改变季度
const handleUpdateValue = (value: any) => {
    monthOptions.value = [];
    form_details.list.month = "";
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
    form_details.list.year && (str = `${dateFormat(form_details.list.year, 'y')}年`);
    form_details.list.quarter && (str = `${dateFormat(form_details.list.year, 'y')}年-${form_details.list.quarter}季度`);
    form_details.list.month && (str = `${dateFormat(form_details.list.year, 'y')}年-${form_details.list.quarter}季度-${form_details.list.month}月`);
    return str
}
// 还原统计周期
const setStatisticalCycle = (val: any) => {
    form_details.list.year = null;
    form_details.list.quarter = "";
    form_details.list.month = "";
    let list = [];
    val && (list = val.split("-"));
    if (list[0]) {
        let date = Number(list[0].substr(0, list[0].length - 1))
        date > 0 && ((form_details.list.year as any) = getTime(date))
    }
    list[1] && (form_details.list.quarter = list[1].substr(0, list[1].length - 2))
    list[2] && (form_details.list.month = list[2].substr(0, list[2].length - 1))
}
// 时间转化为时间戳
const getTime = (time: any) => {
    let date: any = new Date(time.toString())
    let time1 = date.getTime()
    return time1
}
// 获取日志列表
const getList = () => {
    param.value.functionalAreas = queryInfo.functionalAreas;
    param.value.startTime = queryInfo.entryTime ? dateFormat(queryInfo.entryTime[0], 'y-m-d') : '';
    param.value.endTime = queryInfo.entryTime ? dateFormat(queryInfo.entryTime[1], 'y-m-d') : '';
    let data = param.value;
    economics.getList(data).then((res: any) => {
        if (res.code == 200) {
            tableData.length = 0;
            res.data.records.forEach((item: any, index: number) => {
                let { functionalAreas, rulesOnNumber, newInvestment, technicalRenovationInvestment, industrialOutput, implementTax, statisticalCycle, entryTime, id } = item;
                pagination.pageCount = res.data.pages;
                (pagination as any).itemCount = res.data.total;
                tableData.push({
                    key: 0,
                    index: index + 1,
                    functionalarea: functionalAreas,
                    planning: rulesOnNumber,
                    newInvestment: newInvestment,
                    transformation: technicalRenovationInvestment,
                    industrial: industrialOutput,
                    taxrevenue: implementTax,
                    cycle: statisticalCycle,
                    time1: entryTime,
                    id
                })
            })
        }
    })
}
// 获取功能区下拉框
const getdict = () => {
    economics.getdict({
        typeNum: "garden",
        value: ""
    }).then((res: any) => {
        if (res.code == 200) {
            selectOptions.length = 0;
            res.data.forEach((item: any) => {
                selectOptions.push({
                    label: item.name,
                    value: item.name
                })
            })

        }
    })
}
// 获取统计周期下拉框
const statisticalCycle = () => {
    economics.getstatisticalCycle({
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
// 改变页面展示多少条
const handlePageSize = (pageSizes: number) => {
    param.value.current = 1;
    pagination.page = 1;
    param.value.size = pageSizes;
    getList()
}
// 改变当前页
const handlePageChange = (currentPage: number) => {
    param.value.current = currentPage;
    pagination.page = currentPage;
    getList()
}
// 查询
const query = () => {
    param.value.current = 1;
    pagination.page = 1;
    getList()
}
// 重置
const reset = () => {
    queryInfo.entryTime = null
    queryInfo.functionalAreas = ""
    getList()
}
// 弹框（表单验证规则）
const rules = {
    list: {
        year: {
            type: 'number',
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        functionalAreas: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        rulesOnNumber: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        newInvestment: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        technicalRenovationInvestment: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        industrialOutput: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        },
        implementTax: {
            required: true,
            message: '请输入',
            trigger: ['input', 'blur']
        }
    },
}
// 新增详情修改按钮确定（1：新增。2：详情。3：修改。）
let btnNum = ref(1)
// 新增弹框 - 打开（显示隐藏）
const showModal_newAdd = ref(false)
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增'
    btnNum.value = 1;
    form_details.list.year = null;
    form_details.list.quarter = "";
    form_details.list.month = "";
    form_details.list.statisticalCycle = "";
    form_details.list.functionalAreas = "";
    form_details.list.newInvestment = "";
    form_details.list.industrialOutput = "";
    form_details.list.implementTax = "";
    form_details.list.rulesOnNumber = "";
    form_details.list.technicalRenovationInvestment = "";
    showModal_newAdd.value = true
}
// 详情弹框
const rowDetails = (row: any, index: number) => {
    form_details.name = '详情'
    btnNum.value = 2;
    let { functionalarea, planning, cycle, newInvestment, industrial, taxrevenue, transformation } = row
    // form_details.list.statisticalCycle = cycle;
    setStatisticalCycle(cycle)
    form_details.list.functionalAreas = functionalarea;
    form_details.list.newInvestment = newInvestment;
    form_details.list.industrialOutput = industrial;
    form_details.list.implementTax = taxrevenue;
    form_details.list.rulesOnNumber = planning;
    form_details.list.technicalRenovationInvestment = transformation;
    showModal_newAdd.value = true
}
// 修改弹框
const rowChange = (row: any, index: number) => {
    form_details.name = '修改'
    btnNum.value = 3;
    let { functionalarea, planning, cycle, newInvestment, industrial, taxrevenue, transformation, id } = row
    deleteId.value = id
    // form_details.list.statisticalCycle = cycle;
    setStatisticalCycle(cycle)
    form_details.list.functionalAreas = functionalarea;
    form_details.list.newInvestment = newInvestment;
    form_details.list.industrialOutput = industrial;
    form_details.list.implementTax = taxrevenue;
    form_details.list.rulesOnNumber = planning;
    form_details.list.technicalRenovationInvestment = transformation;
    showModal_newAdd.value = true
}

// 获取表单from
const formRef = ref<HTMLElement>();
// 新增弹框 - 点击确认
const getNewAddForm = (e: any) => {
    e.preventDefault()
    const dragDivDom: any = formRef.value;
    dragDivDom.validate((errors: any) => {
        if (!errors) {
            form_details.list.statisticalCycle = getStatisticalCycle()
            if (btnNum.value == 1) {
                let data = { ...form_details.list }
                economics.addList(data).then((res: any) => {
                    if (res.code == 200) {
                        message.success('新增成功')
                        param.value.current = 1;
                        pagination.page = 1;
                        getList()
                    }
                })
            } else {
                let data = { ...form_details.list, id: deleteId.value }
                economics.change(data).then((res: any) => {
                    if (res.code == 200) {
                        message.success('修改成功')
                        getList()
                    }
                })
            }
            showModal_newAdd.value = false
        } else {
            console.log(errors)
            message.error('请检查输入内容')
        }
    })
}
// 删除弹框 - 打开（显示隐藏）
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确定删除？')
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
    economics.delete({
        id: deleteId.value
    }).then((res: any) => {
        if (res.code == 200) {
            message.success('删除成功')
            param.value.current = 1;
            pagination.page = 1;
            getList()
        } else {
            message.error('删除失败')
        }
    })
}
onMounted(() => {
    getList()
    getdict()
    // statisticalCycle()
})
</script>

<style lang="postcss" scoped>
.landPlan {
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