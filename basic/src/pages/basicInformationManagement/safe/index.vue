<template>
    <div class="basic_safe">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- time -->
                    <n-space>
                        <span>发生时间</span>
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
                            :maxlength="formMaxLength"
                            placeholder="输入类型"
                        />
                    </n-space>
                    <!-- state -->
                    <n-space>
                        <span>状态</span>
                        <n-input
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.state"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入状态"
                        />
                    </n-space>
                    <!-- eventTheme -->
                    <n-space>
                        <span>事件主题</span>
                        <n-input
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.eventTheme"
                            clearable
                            :maxlength="formMaxLength"
                            placeholder="输入事件主题"
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
                        :loading="loading"
                        :scroll-x="1500"
                        @update:page="handlePageChange"
                        :row-key="(row: any) => (row.index)"
                        @update:checked-row-keys="handleCheck"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
            <div class="topright">
                <n-space>
                    <n-button type="primary" @click="newAdd">新增</n-button>
                    <n-button type="info" @click="exportList">导出</n-button>
                </n-space>
            </div>
        </div>
        <!-- popup_newAdd-->
        <n-modal
            class="custom-card"
            v-model:show="showModal_newAdd"
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
                    <n-form-item-gi :span="12" label="事件主题" path="user.eventTheme">
                        <n-input
                            v-model:value="form_details.user.eventTheme"
                            placeholder="输入主题"
                            clearable
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="类型" path="user.type">
                        <n-input
                            v-model:value="form_details.user.type"
                            clearable
                            placeholder="输入类型"
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="涉及企业" path="user.involvingEnterprises">
                        <n-input
                            v-model:value="form_details.user.involvingEnterprises"
                            clearable
                            placeholder="输入涉及企业"
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="发生地点 " path="user.place">
                        <n-input
                            v-model:value="form_details.user.place"
                            clearable
                            placeholder="输入发生地点"
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="事件坐标" path="user.state">
                        <n-input
                            v-model:value="form_details.user.latlon"
                            clearable
                            :maxlength="formMaxLength"
                            :disabled="true"
                            placeholder="请点击右侧按钮获取坐标"
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
                    <n-form-item-gi :span="12" label="发生时间 " path="user.timeOccurrence">
                        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                            <n-date-picker
                                :style="{ width: '350px' }"
                                v-model:value="form_details.user.timeOccurrence"
                                type="datetime"
                                clearable
                                :disabled="form_details.name === '详情'"
                            />
                        </n-config-provider>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="事件详情" path="user.details">
                        <n-input
                            v-model:value="form_details.user.details"
                            clearable
                            placeholder="输入事件详情"
                            :maxlength="formMaxLength * 10"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="协同处置单位" path="user.synergy">
                        <n-input
                            v-model:value="form_details.user.synergy"
                            clearable
                            placeholder="输入协同处置单位"
                            :maxlength="formMaxLength * 10"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="影响规模" path="user.affectSize">
                        <n-input
                            v-model:value="form_details.user.affectSize"
                            clearable
                            placeholder="输入影响规模"
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="处置时间" path="user.disposalTime">
                        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                            <n-date-picker
                                :style="{ width: '350px' }"
                                v-model:value="form_details.user.disposalTime"
                                type="datetime"
                                clearable
                                :disabled="form_details.name === '详情'"
                            />
                        </n-config-provider>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="处置状态" path="user.disposalTheState">
                        <n-input
                            v-model:value="form_details.user.disposalTheState"
                            clearable
                            placeholder="输入处置状态"
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="12"
                        label="上传照片"
                        path="user.role"
                        v-if="form_details.name === '新增'"
                    >
                        <n-button
                            :disabled="!fileListLength"
                            style="margin-bottom: 12px;"
                            @click="handleClick"
                        >上传文件</n-button>
                        <n-upload
                            action="http://10.51.100.70:9527/file/upload"
                            method="POST"
                            headers="{ Content-Type: 'multipart/form-data' }"
                            :default-upload="false"
                            multiple
                            ref="upload"
                            @change="handleChange"
                            @finish="handleFinish"
                            @error="handleError"
                        >
                            <n-button>选择文件</n-button>
                        </n-upload>
                    </n-form-item-gi>
                    <n-form-item-gi
                        :span="24"
                        label="照片"
                        path="user.disposalTheState"
                        v-if="form_details.name === '详情' && form_details.user.photoOrVideo"
                    >
                        <img
                            :src="form_details.user.photoOrVideo"
                            :style="{ width: '200px', height: '200px', objectFit: 'cover' }"
                            @click="bigImage(form_details.user.photoOrVideo)"
                        />
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button type="info" @click="getNewAddForm">确认</n-button>
                    <n-button type="info" @click="showModal_newAdd = false">取消</n-button>
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
import { zhCN, dateZhCN, NButton, NSpace, useMessage, c } from 'naive-ui'
import { LocationSharp } from '@vicons/ionicons5';
// components
import blueTitle from '@components/public/title/index.vue'
import mapBox from '@components/mapBox/index.vue';
// api
import api_safe from '../../../axios/api/basicInformationManagement/safe'
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
    eventTheme: '',
})
/**
 * state_table
 */
// tableLoading
const loading = ref(false)
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
        title: '事件主题',
        key: 'eventTheme',
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
        title: '涉及企业',
        key: 'involvingEnterprises',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '发生时间',
        key: 'timeOccurrence',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '影响规模',
        key: 'affectSize',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '处置状态',
        key: 'disposalTheState',
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
const tableData = reactive([
    {
        key: 0,
        index: 1,
        eventTheme: '主题',
        type: '类型',
        involvingEnterprises: '涉及企业',
        timeOccurrence: '2022-01-15',
        affectSize: '影响规模',
        disposalTheState: '未处理',
        // photoOrVideo: ''
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
/**
 * state_pop_newAdd
 */
// show_or_hidden_modal
const showModal_newAdd = ref(false)
// 表单最大输入长度 
const formMaxLength = ref(24)
// form_details
const form_details = reactive({
    name: '新增',
    user: {
        eventTheme: '主题',
        type: '类型',
        involvingEnterprises: '涉及企业',
        place: '发生地点',
        lat: '纬度',
        lon: '经度',
        latlon: '事件坐标',
        // timeOccurrence: '发生时间',
        timeOccurrence: 0,
        details: '事件详情',
        synergy: '协同处置单位',
        affectSize: '影响规模',
        // disposalTime: '处置时间',
        disposalTime: 0,
        disposalTheState: "处置状态",
        photoOrVideo: '',
        id: ''
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
/**
 * state_pop_delete
 */
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
// 时间处理
const toTimestr = (time_stamp: number) => {
    let times = Number((time_stamp + '').padEnd(13, '0'));
    const time = new Date(times)
    const Y = time.getFullYear()
    const M = (time.getMonth() + 1).toString().padStart(2, '0')
    const D = time.getDate().toString().padStart(2, '0')
    const h = time.getHours().toString().padStart(2, '0')
    const m = time.getMinutes().toString().padStart(2, '0')
    const s = time.getSeconds().toString().padStart(2, '0')
    return `${Y}-${M}-${D}`
}
// 查询
const query = () => {
    const params = dealQueryData()
    pagination.page = 1
    getList(params)
}
// 查询参数处理
const dealQueryData = () => {
    let params: any, timeOccurrenceStart, timeOccurrenceEnd
    if (queryInfo.time === undefined || queryInfo.time === null) {
        timeOccurrenceStart = toTimestr(0)
        let now = Date.now()
        timeOccurrenceEnd = toTimestr(now)
    } else {
        timeOccurrenceStart = toTimestr(queryInfo.time[0])
        timeOccurrenceEnd = toTimestr(queryInfo.time[1])
    }
    params = { ...queryInfo, timeOccurrenceStart, timeOccurrenceEnd }
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
            // queryInfo[key] = [0, Date.now()]
            queryInfo[key] = null
        } else {
            queryInfo[key] = ''
        }
    })
    if (state) {
        const params = dealQueryData()
        getList(params)
    }
}
/**
 * methods_table
 */
// 分页-翻页
const handlePageChange = (currentPage: number) => {
    const params = dealQueryData()
    getList({ current: currentPage, ...params })
}
// 改变每页显示条数
const handlePageSize = (pageSizes: number) => {
    pagination.pageSize = pageSizes
    const params = dealQueryData()
    getList({ ...params })
}
// 当前选中行——————————————————未使用该功能
const handleCheck = (rowKeys: any) => {
    console.log(rowKeys)
}
// 详情
const rowDetails = (row: any, index: number, val: string) => {
    form_details.name = val
    const timeOccurrence = + new Date(row.timeOccurrence)
    const disposalTime = + new Date(row.disposalTime)
    const params = { ...form_details.user, ...row, timeOccurrence, disposalTime }
    form_details.user = params
    showModal_newAdd.value = true
}
// 详情图片预览
const bigImage = (url: string) => {
    window.open(url)
}
// 删除
const rowDelete = (row: any, index: number) => {
    form_details.user.id = row.id
    showModal_delete.value = true
}
// 取消删除
const cancelCallback = () => {
    message.success('取消删除')
}
// 确认删除
const submitCallback = async () => {
    const res: any = await api_safe.rowDelete(form_details.user.id)
    if (res.code === 200) {
        message.success('删除成功')
        const lastPage = pagination.pageCount
        const newPage = Math.ceil((pagination.itemCount - 1) / pagination.pageSize)
        const current = lastPage > newPage ? newPage : pagination.page
        const params = dealQueryData()
        getList({ current, ...params })
    } else {
        message.success('删除失败')
    }
}
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增'
    Object.keys(form_details.user).forEach((item: string) => {
        if (item === 'timeOccurrence' || item === 'disposalTime') {
            form_details.user[item] = 0
        } else {
            form_details.user[item] = ''
        }
    })
    showModal_newAdd.value = true
}
// 新增/详情弹框 - 点击确认
const getNewAddForm = async () => {
    showModal_newAdd.value = false
    console.log(131313131313,form_details.name)
    if (form_details.name === '新增') {
        const photoOrVideo = response.value?.data?.url
        const timeOccurrence = dateFormat(form_details.user.timeOccurrence, 'y-m-d H:m:s')
        const disposalTime = dateFormat(form_details.user.disposalTime, 'y-m-d H:m:s')
        const params = { ...form_details.user, timeOccurrence, disposalTime, photoOrVideo }
        const res: any = await api_safe.add(params)
        if (res.code === 200) {
            message.success('新增成功')
            getList()
        } else {
            message.error('新增失败')
        }
    } else if (form_details.name === '编辑') {
        const res: any = await api_safe.edit(form_details.user)
        if (res.code === 200) {
            message.success('修改成功')
            getList()
        } else {
            message.error('修改失败')
        }
    }

}
// 导出
const exportList = () => {
    api_safe.exportList()
        .then((res: any) => {
            const link = document.createElement("a");
            const blob = new Blob([res]);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "安全事件表.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }).catch(function (error) {
            console.log(error);
        });
}

/**
 * 文件上传
 */
const fileListLength = ref(0)
const upload = ref()
const response: any = ref()
// 上传完成的回调
const handleFinish = (e: any) => {
    response.value = JSON.parse(e.event.target.response)
    message.success('文件上传成功')
}
// 上传失败回调
const handleError = (e: any) => {
    console.log(e)
    message.success('文件上传失败')
}
// 选中文件时
const handleChange = ({ fileList }: any) => {
    fileListLength.value = fileList.length
}
// 上传文件
const handleClick = () => {
    upload.value.submit()
}


/**
 * ----------------------------------------------接口------------------------------------------------
 */
const getList = async (params: any = { current: 1 }) => {
    loading.value = true
    pagination.page = params.current
    const basicData = { current: 1, pageSize: pagination.pageSize }
    const data = { ...basicData, ...params }
    const res: any = await api_safe.getList(data)
    if (res.code === 200) {
        tableData.length = 0
        pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize)
        pagination.page = data.current;
        pagination.itemCount = res.data.total
        res.data.records.forEach((item: any, index: number) => {
            const obj = {
                key: item.id,
                index: (data.current - 1) * pagination.pageSize + index + 1,
                ...item
            }
            tableData.push(obj)
        })
        loading.value = false
    }
}
onMounted(() => {
    let params: any, timeOccurrenceStart, timeOccurrenceEnd
    if (queryInfo.time === undefined || queryInfo.time === null) {
        timeOccurrenceStart = toTimestr(0)
        let now = Date.now()
        timeOccurrenceEnd = toTimestr(now)
    } else {
        timeOccurrenceStart = toTimestr(queryInfo.time[0])
        timeOccurrenceEnd = toTimestr(queryInfo.time[1])
    }
    params = { ...queryInfo, timeOccurrenceStart, timeOccurrenceEnd }
    delete params.time
    pagination.page = 1
    getList(params)
})

</script>

<style lang="postcss" scoped>
.basic_safe {
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