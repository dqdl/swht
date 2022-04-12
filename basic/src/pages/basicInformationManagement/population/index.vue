<template>
    <div class="basic_envrionment">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- type -->
                    <n-space>
                        <span>就业岗位</span>
                        <n-input
                            type="text"
                            :style="{ width: '200px' }"
                            v-model:value="queryInfo.type"
                            placeholder="请输就业岗位"
                            clearable
                        />
                    </n-space>
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
                        <n-button type="info" @click="query" :disabled="isQuery">查询</n-button>
                        <n-button type="warning" @click="reset">重置</n-button>
                    </n-space>
                </div>
            </div>
        </div>
        <!-- table -->
        <div class="list">
            <blue-title :propValue="'数据列表'" />
            <div class="tableList">
                <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                    <n-data-table
                        ref="table"
                        :remote="true"
                        :bordered="false"
                        :columns="tableHead"
                        :data="tableData"
                        :pagination="pagination"
                        :loading="false"
                        @update:page="handlePageChange"
                        @update:checked-row-keys="handleCheck"
                        :row-key="(row: any) => row.id"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
            <div class="topright">
                <n-space>
                    <n-button type="primary" @click="newAdd">新增</n-button>
                    <n-button @click="delMore" type="error">批量删除</n-button>
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
                <n-form ref="formRef" :model="form_details" :rules="rules">
                    <n-form-item label="就业岗位" path="user.jobs">
                        <n-input
                            v-model:value="form_details.user.jobs"
                            clearable
                            placeholder="请输入就业岗位"
                        />
                    </n-form-item>
                    <n-form-item label="外来就业人口" path="user.outsideEmployment">
                        <n-input
                            v-model:value="form_details.user.outsideEmployment"
                            clearable
                            placeholder="请输入外来就业人口"
                        />
                    </n-form-item>
                    <n-form-item label="本地就业人口" path="user.localEmployment">
                        <n-input
                            v-model:value="form_details.user.localEmployment"
                            clearable
                            placeholder="请输入本地就业人口"
                        />
                    </n-form-item>
                    <n-form-item label="统计周期" path="user.year">
                        <!-- <n-input
                        v-model:value="form_details.user.statisticalCycle"
                        clearable
                        placeholder="请输入统计周期"
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
                    <!-- <n-form-item label="联系方式" path="user.tel">
                    <n-input v-model:value="form_details.user.tel" clearable placeholder="输入联系方式" />
                    </n-form-item>-->
                    <!-- <n-form-item label="录入时间" path="user.time1">
                    <n-config-provider :locale="queryInfo.zhCN" :date-locale="queryInfo.dateZhCN">
                        <n-date-picker
                            v-if="form_details.name === '新增'"
                            :style="{ width: '520px' }"
                            v-model:value="form_details.user.entryTime"
                            type="daterange"
                            clearable
                        />
                        <n-date-picker
                            v-else
                            :style="{ width: '520px' }"
                            v-model:value="form_details.user.updateTime"
                            type="date"
                            clearable
                        />
                    </n-config-provider>
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
import { ref, reactive, watch, h } from 'vue'
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui'
// components
import blueTitle from '@components/public/title/index.vue'
import Population from '../../../axios/api/basicInformationManagement/population'
// ------------------------------------------------state-------------------------------------------------
import { dateFormat } from "../../../util/verification"





// 消息组件
const message = useMessage()
/**
 * state_head
 */
// queryInfo
const queryInfo: any = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    type: '',
    time: null,
    startTime: '',
    endTime: '',
    userType: '',
    system: ''
})
// form_details
let form_details: any = reactive({
    name: '',
    user: {
        jobs: "",
        id: "",
        localEmployment: '',
        outsideEmployment: '',
        statisticalCycle: '',
        updateTime: '',
        entryTime: 0,
        year: null,
        quarter: "",
        month: ""
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
// currentPage
const handlePageChange = (currentPage: number) => {
    console.log('currentPage =>', currentPage)
    pagination.page = currentPage
    getList({ current: currentPage })
}
/**
 * methods_head
 */
// query
let isQuery: any = ref(true)
watch(() => queryInfo, () => {
    if (queryInfo.type || queryInfo.time) {
        isQuery.value = false
    } else {
        isQuery.value = true
    }
}, {
    deep: true,
    immediate: true
})
const query = () => {
    // console.log(1, queryInfo.checkedRowKeys)
    console.log('点击了查询按钮')
    // console.log(queryInfo)
    let data: any = []
    // if (!queryInfo.time) {
    //     queryInfo.time = [0, (new Date()).valueOf()]
    // }
    pagination.pageCount = 1;
    let info = {
        current: pagination.pageCount,
        pageSize: pagination.pageSize,
        job: queryInfo.type,
        startTime: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
        endTime: queryInfo.time ? dateFormat(queryInfo.time[1], 'y-m-d') : ''
    }

    Population.getPopulation(info).then((res: any) => {
        if (res.code == "200") {
            pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
            (pagination as any).itemCount = res.data.total;
            res.data.records.forEach((e: any, index: number) => {
                e.num = index + 1;
                e.updateTime = dateFormat(e.updateTime, null)
                e.entryTime = dateFormat(e.entryTime, null)
            })
            tableData.value = res.data.records;
            // if (!queryInfo.time) {
            //     queryInfo.time = [0, new Date()]
            // }
            // if (queryInfo.type) {
            //     for (let i = 0; i < tableData.value.length; i++) {
            //         if (tableData.value[i].jobs === queryInfo.type && (new Date(tableData.value[i].entryTime)).valueOf() >= queryInfo?.time[0]) {
            //             data.push(tableData.value[i])
            //         }
            //     }
            //     tableData.value = data
            // } else {
            //     for (let i = 0; i < tableData.value.length; i++) {
            //         if ((new Date(tableData.value[i].entryTime)).valueOf() >= queryInfo?.time[0]) {
            //             data.push(tableData.value[i])
            //         }
            //     }
            //     tableData.value = data
            // }
        }
    })

}
// reset
const reset = () => {
    queryInfo.type = ''
    queryInfo.time = null
    pagination.pageCount = 1
    getList()
}
/**
 * state_table
 */
// table_head
// 选中的列
const checkedRowKeys = ref([])
let index: any = ref([])
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
        key: 'num',
        width: 80,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '就业岗位',
        key: 'jobs',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '外来就业人口',
        key: 'outsideEmployment',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '本地就业人口',
        key: 'localEmployment',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '统计周期',
        key: 'statisticalCycle',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '录入时间',
        key: 'entryTime',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '操作',
        key: 'operation',
        align: "right",
        width: 260,
        render(row: object, index: number) {
            return h(
                NSpace,
                {
                    justify: "end"
                },
                [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "warning",
                            onClick: () => rowDetails(row)
                        },
                        { default: () => '修改' }
                    ),
                    h(NButton, {
                        type: "error",
                        size: 'small',
                        onClick: () => rowDelete(row)
                    }, {
                        default: () => '删除'
                    })
                ]
            )
        }
    }
])
// table_data
let tableData = ref()
// pagination
// let pagination = reactive({
//     current:1,
//     job:null,
//     pageCount: 10,
//     pageSize: 10,
//     endTime:null,
//     startTime:null
// })
const pagination = reactive({
    pageCount: 5,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20],
    showSizePicker: true,
    suffix: ({ itemCount }: any) => {
        return `总共${itemCount}条`
    }
})
let getList = async (params: any = { current: 1 }) => {
    const basicData = {
        current: 1,
        size: pagination.pageSize,
        job: queryInfo.type,
        startTime: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
        endTime: queryInfo.time ? dateFormat(queryInfo.time[1], 'y-m-d') : ''
    }
    const data = { ...basicData, ...params }
    const res: any = await Population.getPopulation(data)
    if (res.code == "200") {
        pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
        (pagination as any).itemCount = res.data.total;
        pagination.page = data.current
        res.data.records.forEach((e: any, index: number) => {
            e.num = index + 1;
            e.updateTime = dateFormat(e.updateTime, null)
            e.entryTime = dateFormat(e.entryTime, null)
        })
        tableData.value = res.data.records;
    }
};
getList();

// 新增弹框 - 打开（显示隐藏）
const showModal_newAdd = ref(false)
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增'
    form_details.user.id = ''
    form_details.user.year = null;
    form_details.user.quarter = "";
    form_details.user.month = "";
    form_details.user.entryTime = 0
    form_details.user.jobs = ''
    form_details.user.localEmployment = ''
    form_details.user.outsideEmployment = ''
    form_details.user.statisticalCycle = ''
    form_details.user.updateTime = ''
    showModal_newAdd.value = true
}
// 新增弹框（表单验证规则）
const rules = {
    user: {
        jobs: {
            required: true,
            message: '请输入就业岗位',
            trigger: ['input', 'blur']
        },
        outsideEmployment: {
            required: true,
            message: '请输入外来就业人口',
            trigger: ['input', 'blur']
        },
        localEmployment: {
            required: true,
            message: '请输入本地就业人口',
            trigger: ['input', 'blur']
        },
        year: {
            type: 'number',
            required: true,
            message: '请输入统计周期',
            trigger: ['input', 'blur']
        }
    },
}
const formRef = ref(null)
// 新增弹框 - 点击确认
const getNewAddForm = () => {
    (formRef.value as any).validate((errors: any) => {
        if (!errors) {
            showModal_newAdd.value = false
            console.log(form_details)
            if (form_details.name === '新增') {
                form_details.user.entryTime = (new Date()).valueOf()
                form_details.user.statisticalCycle = getStatisticalCycle()
                Population.addPopulation(form_details.user).then((res: any) => {
                    message.success('新增成功')
                    getList();
                })
            } else {
                Population.updatePopulation(form_details.user).then((res: any) => {
                    getList();
                })
            }
        } else {
            message.error('请将信息填写完整')
        }
    })
}
// 展示多少页
const handlePageSize = (pageSizes: number) => {
    pagination.pageSize = pageSizes
    // const params = dealQueryData()
    getList({
        pageSize: pageSizes
    })
}
// 修改弹框
const rowDetails = (row: any) => {
    form_details.name = "修改"
    form_details.user.entryTime = (new Date(row.entryTime)).valueOf()
    form_details.user.jobs = row.jobs
    form_details.user.id = row.id
    form_details.user.localEmployment = row.localEmployment
    form_details.user.outsideEmployment = row.outsideEmployment
    form_details.user.updateTime = (new Date(row.updateTime)).valueOf()
    setStatisticalCycle(row.statisticalCycle)
    showModal_newAdd.value = true
    // debugger
}
let delMultiple: any = ref(false)
// 删除弹框 - 打开（显示隐藏）
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('你选中了0条数据，确认删除吗？')
// 删除弹框
const rowDelete = (row: any) => {
    delete_content.value = row.id
    showModal_delete.value = true
    console.log(`this is delete => ${index}`)
}
// 删除取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除确定
const submitCallback = () => {
    // debugger
    if (delMultiple.value) {
        index.value.forEach((ele: any, i: any) => {
            Population.delPopulation(ele).then((res: any) => {
                if (i === index.value.length - 1) {
                    message.success('删除成功')
                    getList();
                    delMultiple.value = false
                }
            })
        });
    } else {
        Population.delPopulation(delete_content.value).then((res: any) => {
            message.success('删除成功')
            getList();
        })
    }

}
const delMore = () => {
    delete_content.value = `你选中了${index.value.length}条数据，确认删除吗？`
    showModal_delete.value = true
    delMultiple.value = true
}
</script>

<style lang="postcss" scoped>
.basic_envrionment {
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