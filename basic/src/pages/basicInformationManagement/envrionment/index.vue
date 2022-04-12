<template>
    <div class="basic_envrionment">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- time -->
                    <n-space>
                        <span>注册时间</span>
                        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                            <n-date-picker
                                :style="{ width: '240px' }"
                                v-model:value="queryInfo.time"
                                type="daterange"
                                clearable
                            />
                        </n-config-provider>
                    </n-space>
                    <!-- type -->
                    <n-space>
                        <span>类型</span>
                        <n-input
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.type"
                            clearable
                            placeholder="输入类型"
                            :maxlength="formMaxLength"
                        />
                    </n-space>
                    <!-- department -->
                    <n-space>
                        <span>状态</span>
                        <!-- <n-input
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.state"
                            clearable
                            placeholder="输入状态"
                            :maxlength="formMaxLength"
                        />-->
                        <n-select
                            placeholder="请选择状态"
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.state"
                            :options="typeArr"
                        />
                    </n-space>
                    <n-space>
                        <span>设备名称</span>
                        <n-input
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.facilityName"
                            clearable
                            placeholder="输入设备名称"
                            :maxlength="formMaxLength"
                        />
                    </n-space>
                    <!-- </div>
                    <div class="right">-->
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
                <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                    <n-data-table
                        :remote="true"
                        :bordered="false"
                        :columns="tableHead"
                        :data="tableData"
                        :pagination="pagination"
                        :loading="tableLoading"
                        @update:page="handlePageChange"
                        :row-key="(row: any) => (row.index)"
                        @update:checked-row-keys="handleCheck"
                        @update:pageSize="handlePageSize"
                    />
                    <!-- :scroll-x="1700" -->
                </n-config-provider>
            </div>
            <div class="topright">
                <n-space>
                    <n-button type="primary" @click="newAdd">新增</n-button>
                    <n-button type="info" @click="tableExport">导出</n-button>
                </n-space>
            </div>
        </div>
        <!-- popup_newAdd/details -->
        <n-modal
            class="custom-card"
            v-model:show="showModal_details"
            preset="card"
            :style="{ width: '800px' }"
            :title="form_details.name"
            size="huge"
            :bordered="false"
            :segmented="false"
        >
            <template #header-extra></template>
            <n-form :model="form_details" :rules="rules">
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="12" label="设施名称" path="user.facilityName">
                        <n-input
                            v-model:value="form_details.user.facilityName"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入设施名称"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="类型" path="user.type">
                        <!-- <n-select v-model:value="form_details.user.type" :options="selectOptions" /> -->
                        <n-input
                            v-model:value="form_details.user.type"
                            :options="selectOptions"
                            :maxlength="formMaxLength"
                            placeholder="输入类型"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="数量" path="user.number">
                        <n-input
                            v-model:value="form_details.user.number"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入数量"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="地点" path="user.location">
                        <n-input
                            v-model:value="form_details.user.location"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入地点"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="经纬度" path="user.state">
                        <n-input
                            v-model:value="form_details.user.latlon"
                            clearable
                            :maxlength="formMaxLength"
                            :disabled="true"
                            placeholder="请点击右侧按钮获取定位"
                        />
                        <n-icon
                            v-if="form_details.name !== '详情'"
                            :component="LocationSharp"
                            size="30"
                            :style="{ cursor: 'pointer', color: 'red' }"
                            @click="locationFun"
                        >
                            <LocationSharp />
                        </n-icon>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="生产厂家 " path="user.manufacturer">
                        <n-input
                            v-model:value="form_details.user.manufacturer"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入生产厂家"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="状态 " path="user.state">
                        <!-- <n-input
                            v-model:value="form_details.user.state"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入状态"
                            :disabled="form_details.name === '详情'"
                        />-->
                        <n-select
                            placeholder="请选择类型"
                            :disabled="form_details.name === '详情'"
                            v-model:value="form_details.user.state"
                            :options="typeArr"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="管理人/企业" path="user.administrator">
                        <n-input
                            v-model:value="form_details.user.administrator"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入管理人/企业"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="注册时间 " path="user.createTime">
                        <!-- <n-input v-model:value="form_details.user.createTime" clearable /> -->
                        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                            <n-date-picker
                                :style="{ width: '350px' }"
                                v-model:value="form_details.user.createTime"
                                type="date"
                                clearable
                                :disabled="form_details.name === '详情'"
                            />
                        </n-config-provider>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="监测时间 " path="user.monitoringTime">
                        <!-- <n-input v-model:value="form_details.user.monitoringTime" clearable /> -->
                        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                            <n-date-picker
                                :style="{ width: '350px' }"
                                v-model:value="form_details.user.monitoringTime"
                                type="date"
                                clearable
                                :disabled="form_details.name === '详情'"
                            />
                        </n-config-provider>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="备注 " path="user.role">
                        <n-input
                            type="textarea"
                            :autosize="{
                                minRows: 3,
                                maxRows: 5
                            }"
                            v-model:value="form_details.user.details"
                            clearable
                            placeholder="输入备注"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button type="info" @click="addOrDetails">确认</n-button>
                    <n-button type="info" @click="showModal_details = false">取消</n-button>
                </n-space>
            </template>
        </n-modal>
        <!-- popup_ delete-->
        <n-modal
            v-model:show="showModal_delete"
            preset="dialog"
            type="error"
            :show-icon="false"
            title="删除"
            content="确定要删除吗？"
            positive-text="确认"
            negative-text="取消"
            @positive-click="submitCallback"
            @negative-click="cancelCallback"
        ></n-modal>
		<n-modal
			v-model:show="showMap"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 700px; height: 600px"
			title="定位"
		>
			<template #header-extra></template>
			<mapBox
				@getPoint="getPoint"
				@cancelGet="showMap = false"
			></mapBox>
		</n-modal>
    </div>
</template>

<script lang="ts" setup>
// vue
import { ref, reactive, h, onMounted } from 'vue'
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui'
// components
import blueTitle from '@components/public/title/index.vue'
import mapBox from '@components/mapBox/index.vue';
import { LocationSharp } from '@vicons/ionicons5';
// api
import api_envrionment from "../../../axios/api/basicInformationManagement/envrionment"
import { dateFormat } from '../../../util/verification'

// ------------------------------------------------state-------------------------------------------------
// 地图弹窗flag
const showMap: any = ref(false);
// 消息组件
const message = useMessage()
/**
 * state_head
 */
// queryInfo
const queryInfo = reactive({
    // time: [0, Date.now()],
    time: <any>ref(),

    type: '',
    state: '',
    facilityName: '',
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

/**
 * state_table
 */
const tableLoading = ref(false)
// table_head
const tableHead = reactive([
    // {
    //     type: 'selection',
    // },
    {
        title: '序号',
        key: 'index',
        align: 'center',
        width: 80,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '设施名称',
        key: 'facilityName',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '类型',
        key: 'type',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '数量',
        key: 'number',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '地点',
        key: 'location',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '状态',
        key: 'state',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '坐标',
        key: 'lat',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },

    {
        title: '管理人/企业',
        key: 'administrator',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '监测时间',
        key: 'monitoringTime',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '注册时间',
        key: 'createTime',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '操作',
        align: 'center',
        key: 'operation',
        width: 200,
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
                            onClick: () => rowDetails(row, index, '详情')
                        },
                        { default: () => '详情' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "warning",
                            onClick: () => rowDetails(row, index, '编辑')
                        },
                        { default: () => '编辑' }
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
// table_data
let tableData = reactive([
    {
        key: 0,
        index: 1,
        facilityName: '水泵',
        type: '水污染',
        number: 2,
        location: '紫金园区',
        state: '未处理',
        lat: '',
        administrator: '邵武市医疗有限公司',
        monitoringTime: '2022-01-15',
        createTime: ""
    },
])
// pagination
const pagination = reactive({
    itemCount: 0,
    pageCount: 5,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20],
    showSizePicker: true,
    suffix: ({ itemCount }: any) => {
        return `总共${itemCount}条`
    }
})
// show_or_hidden_modal
const showModal_details = ref(false)
// 表单最大输入长度
const formMaxLength = ref(24)
// 状态数组
const typeArr = reactive([
    {
        label: "正常",
        value: "正常"
    },
    {
        label: "停用",
        value: "停用"

    },
    {
        label: "失效",
        value: "失效"
    }
])
// form_details
const form_details = reactive({
    name: '新增',
    user: {
        facilityName: '水泵',
        type: '水污染',
        // number: <any>ref(),
        number: 2,
        location: '紫金园区',
        state: '未处理',
        latlon: '经纬度',
        lat: '纬度',
        lon: "经度",
        manufacturer: '生产厂家',
        administrator: '邵武市医疗有限公司',
        // monitoringTime: '2022-01-15',
        // createTime: '2021-01-01',
        monitoringTime: Date.now(),
        createTime: Date.now(),
        details: '备注',
        id: '12134323567'
    },

})
// form_rules
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



// show_or_hidden_modal
const showModal_delete = ref(false)
// ------------------------------------------------methods-------------------------------------------------
// 获取点位信息方法
const getPoint = (point: any) => {
	form_details.user.latlon = point;
	showMap.value = false;
};
// 地图弹窗显示方法
const locationFun = () => {
	showMap.value = true;
};
/**
 * methods_head
 */
// 查询
const query = async () => {
    const params = await dealQueryData()
    pagination.page = 1
    getList(params)
}
// 处理查询参数
const dealQueryData = async () => {
    let params, createTime, endTime
    if (queryInfo.time === undefined || queryInfo.time === null) {
        createTime = await dateFormat(0, "Y-M-D")
        endTime = await dateFormat(Date.now(), "Y-M-D")
    } else {
        createTime = await dateFormat(queryInfo.time[0], "Y-M-D")
        endTime = await dateFormat(queryInfo.time[1], "Y-M-D")
    }
    params = { ...queryInfo, createTime, endTime }
    delete params.time
    return params
}
// 重置
const reset = () => {
    const state = Object.keys(queryInfo).some(item => {
        if (['', null, undefined].includes(queryInfo[item])) {
            return false
        } else {
            return true
        }
    })
    Object.keys(queryInfo).forEach((key: string) => {
        if (key === "time") {
            queryInfo[key] = null
        } else {
            queryInfo[key] = ''
        }
    })
    console.log(state)
    state && getList()
}
/**
 * methods_table
 */
// 分页翻页
const handlePageChange = async (currentPage: number) => {
    const params = await dealQueryData()
    getList({ current: currentPage, ...params })
}
// 展示多少页
const handlePageSize = (pageSizes: number) => {
    pagination.pageSize = pageSizes
    let params, createTime, endTime
    if (queryInfo.time === undefined || queryInfo.time === null) {
        createTime = dateFormat(0, "Y-M-D")
        endTime = dateFormat(Date.now(), "Y-M-D")
    } else {
        createTime = dateFormat(queryInfo.time[0], "Y-M-D")
        endTime = dateFormat(queryInfo.time[1], "Y-M-D")
    }
    params = { ...queryInfo, createTime, endTime }
    delete params.time
    getList({ ...params })
}
// 当前选中行————————————暂未使用该功能
const handleCheck = (rowKeys: any) => {
    console.log(rowKeys)
}
// 详情
const rowDetails = (row: any, index: number, val: string) => {
    console.log(row)
    form_details.name = val
    const copyRow = JSON.parse(JSON.stringify(row))
    form_details.user = copyRow
    form_details.user.monitoringTime = copyRow.monitoringTime ? + new Date(copyRow.monitoringTime) : + new Date()
    form_details.user.createTime = copyRow.createTime ? + new Date(copyRow.createTime) : + new Date()
    showModal_details.value = true
}
// 删除
const rowDelete = (row: any, index: number) => {
    showModal_delete.value = true
    form_details.user.id = row.id
}
// 取消删除
const cancelCallback = () => {
    message.success('取消删除')
}
// 确认删除
const submitCallback = async () => {
    const res: any = await api_envrionment.rowDelete(form_details.user.id)
    if (res.code === 200) {
        message.success('删除成功')
        const lastPage = pagination.pageCount
        const newPage = Math.ceil((pagination.itemCount - 1) / pagination.pageSize)
        const current = lastPage > newPage ? newPage : pagination.page
        const parmas = dealQueryData()
        getList({ current, ...parmas })
    } else {
        message.success('删除失败')
    }
}
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增'
    Object.keys(form_details.user).forEach((key: string) => {
        if (key === 'number') {
            form_details.user[key] = 0
        } else if (key === 'createTime' || key === 'monitoringTime') {
            form_details.user[key] = Date.now()
        } else {
            form_details.user[key] = ''
        }
    })
    showModal_details.value = true
}
// 新增/详情弹框 - 点击确认
const addOrDetails = async () => {
    if (form_details.name === '新增') {
        const parmas = JSON.parse(JSON.stringify(form_details.user))
        parmas.createTime = dateFormat(parmas.createTime, 'Y-m-d h:i:s')
        parmas.monitoringTime = dateFormat(parmas.monitoringTime, 'Y-m-d h:i:s')
        parmas.number = Number(parmas.number)
        const res: any = await api_envrionment.add(parmas)
        if (res.code === 200) {
            message.success('新增成功')
            getList()
        } else {
            message.error('新增失败')
        }
    } else if (form_details.name === '编辑') {
        const res: any = await api_envrionment.rowUpdata(form_details.user)
        if (res.code === 200) {
            message.success('修改成功')
            getList()
        } else {
            message.error('修改失败')
        }
    }
    showModal_details.value = false
}

/**
 * ----------------------------------------------接口------------------------------------------------
 */
// 获取数据列表
const getList = async (params: any = { current: 1 }) => {
    tableLoading.value = true
    const basicData = { current: 1, pageSize: pagination.pageSize }
    const data = { ...basicData, ...params }
    const res: any = await api_envrionment.getList(data)
    console.log(res)
    if (res.code === 200) {
        tableData.length = 0
        pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize)
        pagination.page = data.current;
        pagination.itemCount = res.data.total
        res.data.records.forEach((item: any, index: number) => {
            const obj = {
                key: index,
                index: (data.current - 1) * pagination.pageSize + index + 1,
                ...item,
                monitoringTime: item.monitoringTime?.slice(0, 10),
                createTime: item.createTime?.slice(0, 10),
            }
            tableData.push(obj)
        })
        tableLoading.value = false
    }
}
// 导出
const tableExport = () => {
    api_envrionment.tableExport()
        .then((res: any) => {
            const link = document.createElement("a");
            const blob = new Blob([res]);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "环保设施管理.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href)
        }).catch(function (error) {
            console.log(error);
        });
}
onMounted(() => {
    getList()
})
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
        /* height: 170px; */
        overflow-x: auto;
        .main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px;
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
            padding: 14px 20px;
        }
        .topright {
            position: absolute;
            top: 10px;
            right: 20px;
        }
    }
}
</style>