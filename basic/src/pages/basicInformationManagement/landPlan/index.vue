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
                        <span>录入时间</span>
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
                    <n-form-item label="总用地面积" path="list.totalLandArea">
                        <n-input
                            :disabled="true"
                            v-model:value="form_details.list.totalLandArea"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="工业用地面积" path="list.industrialLandArea">
                        <n-input
                            @change="allChange(form_details.list.industrialLandArea)"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.industrialLandArea"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="物流仓库储用地面积" path="list.logisticsWarehousingLandArea">
                        <n-input
                            @change="allChange(form_details.list.logisticsWarehousingLandArea)"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.logisticsWarehousingLandArea"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="居住用地面积" path="list.residentialLandArea">
                        <n-input
                            @change="allChange(form_details.list.residentialLandArea)"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.residentialLandArea"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="绿化面积" path="list.greenArea">
                        <n-input
                            @change="allChange(form_details.list.greenArea)"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.greenArea"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="道路广场" path="list.roadSquare">
                        <n-input
                            @change="allChange(form_details.list.roadSquare)"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.roadSquare"
                            clearable
                        />
                    </n-form-item>
                    <n-form-item label="其他" path="list.other">
                        <n-input
                            @change="allChange(form_details.list.other)"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.list.other"
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
import landPlan from "../../../axios/api/basicInformationManagement/landPlan"
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
        title: '用地总面积',
        key: 'area',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '工业用地面积/占比',
        key: 'quantity',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '物流仓储用地面积/占比',
        key: 'logistics',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },

    {
        title: '居住用地面积/占比',
        key: 'livearea',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },

    {
        title: '绿化面积/占比',
        key: 'greenArea',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '道路广场/占比',
        key: 'square',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '其他/占比',
        key: 'other',
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
        title: '功能区',
        key: 'functionalAreas',
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
        width: 260,
        align: 'right',
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
    startTime: '',
    endTime: '',
    functionalAreas: ""
})
// 查询条件显示
let queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    entryTime: null,
    functionalAreas: ''
})
// 新增详情修改数据
const form_details = reactive({
    name: '新增',
    list: {
        statisticalCycle: '',
        functionalAreas: "",
        totalLandArea: 0,
        industrialLandArea: 0,
        logisticsWarehousingLandArea: 0,
        residentialLandArea: 0,
        greenArea: 0,
        roadSquare: 0,
        other: 0,
        year: null,
        quarter: '',
        month: ''
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
// 计算占比
const proportion = (num1: any, num2: any) => {
    let num = num1 / num2 * 100
    if (isNaN(num)) return `0%`
    return `${num.toFixed(2)}%`
}
// 获取日志列表
const getList = () => {
    param.value.functionalAreas = queryInfo.functionalAreas;
    param.value.startTime = queryInfo.entryTime ? dateFormat(queryInfo.entryTime[0], 'y-m-d') : '';
    param.value.endTime = queryInfo.entryTime ? dateFormat(queryInfo.entryTime[1], 'y-m-d') : '';
    let data = param.value;
    landPlan.getList(data).then((res: any) => {
        if (res.code == 200) {
            tableData.length = 0;
            pagination.pageCount = res.data.pages;
            (pagination as any).itemCount = res.data.total;
            res.data.records.forEach((item: any, index: number) => {
                let { totalLandArea, industrialLandArea, logisticsWarehousingLandArea, residentialLandArea, roadSquare, other, statisticalCycle, entryTime, greenArea, functionalAreas, id, createTime } = item;
                tableData.push({
                    createTime,
                    key: 0,
                    index: index + 1,
                    area: totalLandArea,
                    quantity: `${industrialLandArea}/${proportion(industrialLandArea, totalLandArea)}`,
                    logistics: `${logisticsWarehousingLandArea}/${proportion(logisticsWarehousingLandArea, totalLandArea)}`,
                    livearea: `${residentialLandArea}/${proportion(residentialLandArea, totalLandArea)}`,
                    square: `${roadSquare}/${proportion(roadSquare, totalLandArea)}`,
                    other: `${other}/${proportion(other, totalLandArea)}`,
                    id,
                    functionalAreas,
                    cycle: statisticalCycle,
                    greenArea: `${greenArea}/${proportion(greenArea, totalLandArea)}`,
                    time1: dateFormat(entryTime, "y-m-d"),
                })
            })
        }
    })
}
// 获取功能区下拉框
const getdict = () => {
    landPlan.getdict({
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
    landPlan.getstatisticalCycle({
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
        industrialLandArea: {
            required: true,
            validator(rule: any, value: any) {
                if (!(value.toString())) {
                    return new Error('请输入')
                } else if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return new Error('必须为数字')
                } else if (Number(value) < 0) {
                    return new Error('必须大于0')
                }
                return true
            },
            trigger: ['input', 'blur']
        },
        logisticsWarehousingLandArea: {
            required: true,
            validator(rule: any, value: any) {
                if (!(value.toString())) {
                    return new Error('请输入')
                } else if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return new Error('必须为数字')
                } else if (Number(value) < 0) {
                    return new Error('必须大于0')
                }
                return true
            },
            trigger: ['input', 'blur']
        },
        residentialLandArea: {
            required: true,
            validator(rule: any, value: any) {
                if (!(value.toString())) {
                    return new Error('请输入')
                } else if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return new Error('必须为数字')
                } else if (Number(value) < 0) {
                    return new Error('必须大于0')
                }
                return true
            },
            trigger: ['input', 'blur']
        },
        greenArea: {
            required: true,
            validator(rule: any, value: any) {
                if (!(value.toString())) {
                    return new Error('请输入')
                } else if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return new Error('必须为数字')
                } else if (Number(value) < 0) {
                    return new Error('必须大于0')
                }
                return true
            },
            trigger: ['input', 'blur']
        },
        roadSquare: {
            required: true,
            validator(rule: any, value: any) {
                if (!(value.toString())) {
                    return new Error('请输入')
                } else if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return new Error('必须为数字')
                } else if (Number(value) < 0) {
                    return new Error('必须大于0')
                }
                return true
            },
            trigger: ['input', 'blur']
        },
        other: {
            required: true,
            validator(rule: any, value: any) {
                if (!(value.toString())) {
                    return new Error('请输入')
                } else if (!/^[0-9]+.?[0-9]*$/.test(value)) {
                    return new Error('必须为数字')
                } else if (Number(value) < 0) {
                    return new Error('必须大于0')
                }
                return true
            },
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
    form_details.list.totalLandArea = 0;
    form_details.list.industrialLandArea = 0
    form_details.list.logisticsWarehousingLandArea = 0
    form_details.list.residentialLandArea = 0
    form_details.list.greenArea = 0
    form_details.list.roadSquare = 0;
    form_details.list.other = 0
    showModal_newAdd.value = true
}
// 详情弹框
const rowDetails = (row: any, index: number) => {
    form_details.name = '详情'
    btnNum.value = 2;
    let { area, cycle, livearea, other, logistics, quantity, square, greenArea, functionalAreas } = row
    setStatisticalCycle(cycle)
    form_details.list.functionalAreas = functionalAreas;
    form_details.list.totalLandArea = area;
    form_details.list.industrialLandArea = quantity.split("/")[0];
    form_details.list.logisticsWarehousingLandArea = logistics.split("/")[0];
    form_details.list.residentialLandArea = livearea.split("/")[0];
    form_details.list.greenArea = greenArea.split("/")[0];
    form_details.list.roadSquare = square.split("/")[0];
    form_details.list.other = other.split("/")[0];
    showModal_newAdd.value = true
}
// 修改弹框
const rowChange = (row: any, index: number) => {
    form_details.name = '修改'
    btnNum.value = 3;
    let { area, cycle, livearea, other, logistics, quantity, square, greenArea, id, functionalAreas } = row
    deleteId.value = id
    setStatisticalCycle(cycle)
    form_details.list.functionalAreas = functionalAreas;
    form_details.list.totalLandArea = area;
    form_details.list.industrialLandArea = quantity.split("/")[0];
    form_details.list.logisticsWarehousingLandArea = logistics.split("/")[0];
    form_details.list.residentialLandArea = livearea.split("/")[0];
    form_details.list.greenArea = greenArea.split("/")[0];
    form_details.list.roadSquare = square.split("/")[0];
    form_details.list.other = other.split("/")[0];
    showModal_newAdd.value = true
}
// 实时计算总面积
const allChange = (value: any) => {
    let list = form_details.list;
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(value)) {
        let data = Number(list.industrialLandArea) + Number(list.logisticsWarehousingLandArea) + Number(list.residentialLandArea) + Number(list.greenArea) + Number(list.roadSquare) + Number(list.other);
        list.totalLandArea = isNaN(data) ? 0 : data
    }
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
                landPlan.addList(data).then((res: any) => {
                    if (res.code == 200) {
                        message.success('新增成功')
                        param.value.current = 1;
                        pagination.page = 1;
                        showModal_newAdd.value = false
                        getList()
                    }else{
                        message.error(`${res.message}`)
                    }
                })
            } else {
                let data = { ...form_details.list, id: deleteId.value }
                landPlan.change(data).then((res: any) => {
                    if (res.code == 200) {
                        message.success('修改成功')
                        showModal_newAdd.value = false
                        getList()
                    }else{
                        message.error(`${res.message}`)
                    }
                })
            }
            

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
    landPlan.delete({
        id: deleteId.value
    }).then((res: any) => {
        if (res.code == 200) {
            param.value.current = 1;
            pagination.page = 1;
            message.success('删除成功')
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