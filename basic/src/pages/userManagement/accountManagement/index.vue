<template>
    <div class="accountManagement">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- user -->
                    <n-space>
                        <span>企业名称</span>
                        <n-input
                            :style="{ width: '220px' }"
                            type="text"
                            v-model:value="queryInfo.ename"
                            placeholder="请输入姓名"
                            :maxlength="formMaxLength"
                            clearable
                        />
                    </n-space>
                    <!-- time -->
                    <n-space>
                        <span>成立时间</span>
                        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                            <n-date-picker
                                :style="{ width: '220px' }"
                                v-model:value="queryInfo.eCreateTime"
                                type="daterange"
                                clearable
                            />
                        </n-config-provider>
                    </n-space>
                    <!-- Role -->
                    <n-space>
                        <span>所属行业</span>
                        <n-select
                            :style="{ width: '220px' }"
                            placeholder="选择行业"
                            v-model:value="queryInfo.industry"
                            :options="industryList"
                        />
                    </n-space>
                    <!-- </div>
                    <div class="right">-->
                    <!-- 地址 -->
                    <n-space>
                        <span>企业地址</span>
                        <n-input
                            type="text"
                            :style="{ width: '220px' }"
                            v-model:value="queryInfo.address"
                            placeholder="请输入地址"
                            :maxlength="formMaxLength"
                            clearable
                        />
                    </n-space>
                    <!-- 归属平台 -->
                    <n-space>
                        <span>归属平台</span>
                        <n-select
                            :style="{ width: '220px' }"
                            placeholder="选择平台"
                            v-model:value="queryInfo.platform"
                            :options="platform"
                        />
                    </n-space>
                    <!-- 企业法人 -->
                    <n-space>
                        <span>企业法人</span>
                        <n-input
                            type="text"
                            :style="{ width: '220px' }"
                            v-model:value="queryInfo.corporate"
                            placeholder="请输入法人"
                            :maxlength="formMaxLength"
                            clearable
                        />
                    </n-space>
                    <!--  -->
                    <n-space>
                        <n-button type="info" @click="query">查询</n-button>
                        <n-button type="warning" @click="reset">重置</n-button>
                    </n-space>
                </div>
                <!-- <div class="right">
                    
                </div>-->
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
                        :loading="false"
                        @update:page="handlePageChange"
                        :row-key="(row: any) => (row.id)"
                        @update:checked-row-keys="handleCheck"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
            <div class="topright">
                <n-space>
                    <n-button type="primary" @click="newAdd">新增</n-button>
                    <!-- <n-button type="success" @click="showModal_batchAdd = true">批量新增</n-button> -->
                    <n-button type="info" @click="exportList">导出</n-button>
                    <n-button
                        type="error"
                        @click="showModal_delete = true"
                        :disabled="!delete_content.includes('你')"
                    >批量删除</n-button>
                </n-space>
            </div>
        </div>
        <!-- popup_newAdd and popup_form_datails-->
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
                <n-form-item label="企业名称" path="user.ename">
                    <n-input
                        v-model:value="form_details.user.ename"
                        clearable
                        placeholder="输入企业名称"
                        :maxlength="formMaxLength"
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
                <n-form-item label="所属行业" path="user.industryName">
                    <n-select
                        placeholder="输入所属行业"
                        v-model:value="form_details.user.industryName"
                        :options="industryList"
                        clearable
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
                <n-form-item label="成立时间" path="user.eCreateTime">
                    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                        <n-date-picker
                            :style="{ width: '520px' }"
                            v-model:value="form_details.user.eCreateTime"
                            type="date"
                            clearable
                            :disabled="form_details.name === '详情'"
                        />
                    </n-config-provider>
                </n-form-item>
                <n-form-item label="地址" path="user.address">
                    <n-input
                        v-model:value="form_details.user.address"
                        clearable
                        placeholder="输入地址"
                        :maxlength="formMaxLength"
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
                <n-form-item label="法人" path="user.corporate">
                    <n-input
                        v-model:value="form_details.user.corporate"
                        clearable
                        placeholder="输入法人"
                        :maxlength="formMaxLength"
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
                <n-form-item label="社会信用代码" path="user.trustNum">
                    <n-input
                        v-model:value="form_details.user.trustNum"
                        clearable
                        placeholder="输入社会信用代码"
                        :maxlength="formMaxLength"
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
                <n-form-item label="企业联系方式 " path="user.contactNum">
                    <n-input
                        v-model:value="form_details.user.contactNum"
                        clearable
                        placeholder="输入企业联系方式"
                        :maxlength="formMaxLength"
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
                <n-form-item label="归属平台 " path="user.platform">
                    <n-select
                        placeholder="输入归属平台"
                        v-model:value="form_details.user.platform"
                        :options="platform"
                        :disabled="form_details.name === '详情'"
                    />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button type="info" @click="getNewAddForm">确认</n-button>
                    <n-button type="info" @click="showModal_newAdd = false">取消</n-button>
                </n-space>
            </template>
        </n-modal>
        <!-- popup_batchAdd -->
        <n-modal
            class="custom-card"
            v-model:show="showModal_batchAdd"
            preset="card"
            :style="{ width: '600px' }"
            title="批量新增"
            size="huge"
            :bordered="false"
            :segmented="false"
        >
            <template #header-extra></template>

            <n-space>
                请先下载文件模板
                <n-button type="info">模板下载</n-button>
            </n-space>
            <n-space style="margin-top: 20px;">
                点击按钮上传文件
                <n-upload
                    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                    :headers="{
                        'naive-info': 'hello!'
                    }"
                    :data="{
                        'naive-data': 'cool! naive!'
                    }"
                >
                    <n-button>上传文件</n-button>
                </n-upload>
            </n-space>

            <template #footer>
                <n-space>
                    <n-button type="info">确认</n-button>
                    <n-button type="info" @click="showModal_batchAdd = false">取消</n-button>
                </n-space>
            </template>
        </n-modal>
        <!-- popup_ delete-->
        <n-modal
            v-model:show="showModal_delete"
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
        <!-- popup_authorization -->
        <n-modal
            class="custom-card"
            v-model:show="showModal_authorization"
            preset="card"
            :style="{ width: '600px' }"
            :title="'授权'"
            size="huge"
            :bordered="false"
            :segmented="false"
        >
            <template #header-extra></template>
            <n-form :model="selectOptions" :rules="rules">
                <n-form-item label="用户角色 " path="user.role">
                    <n-select
                        placeholder="输入角色"
                        v-model:value="form_details.user.role"
                        :options="selectOptions"
                    />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space>
                    <n-button type="info" @click="sureAuthorization">确认</n-button>
                    <n-button type="info" @click="showModal_authorization = false">取消</n-button>
                </n-space>
            </template>
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
// api
import api_account from '../../../axios/api/user/account'
import { dateFormat } from '../../../util/verification'

// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage()
/**
 * state_head
 */
// queryInfo
const queryInfo = reactive({
    ename: '',
    // eCreateTime: Date.now(),
    eCreateTime: <any>ref(),
    industry: '',
    address: '',
    platform: '',
    corporate: '',
})
// 所属行业
const industryList = reactive(
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
// 归属平台
const platform = reactive([
    {
        label: '紫金园区',
        value: '紫金园区'
    }
])
/**
 * state_table
 */
const tableLoading = ref(false)
// table_head
const tableHead = reactive([
    {
        type: 'selection',
    },
    {
        title: '序号',
        key: 'index',
        width: 60,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '企业名称',
        key: 'ename',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '所属行业',
        key: 'industryName',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '成立时间',
        key: 'eCreateTime',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '地址',
        key: 'address',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '法人',
        key: 'corporate',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '社会信用代码',
        key: 'trustNum',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    // {
    //     title: '账号',
    //     key: 'account',
    //      align: 'center',
    //     ellipsis: {
    //         tooltip: true
    //     }
    // },
    {
        title: '企业联系方式',
        key: 'contactNum',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '归属平台',
        key: 'platform',
        align: 'center',
        ellipsis: {
            tooltip: true
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
                        { default: () => '详情' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "warning",
                            onClick: () => rowEdit(row, index)
                        },
                        { default: () => '编辑' }
                    ),
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: "info",
                            onClick: () => authorization(row, index)
                        },
                        { default: () => '授权' }
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
        ename: '企业名称',
        industryName: '行业名称',
        eCreateTime: '成立时间',
        address: '地址',
        corporate: '法人',
        trustNum: '社会信用代码',
        contactNum: '联系电话',
        platform: '什么平台',
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
 * state_pop
 */
// pop_新增
const showModal_newAdd = ref(false)
// 表单最大输入长度
const formMaxLength = ref(24)
// form_details
const form_details = reactive({
    name: '新增',
    user: {
        ename: '',
        industryName: '',
        eCreateTime: Date.now(),
        address: '',
        corporate: '',
        trustNum: '',
        contactNum: '',
        platform: '',
        id: "",
        role: '',
    },
    checed: []
})
// form_rules
const rules = {
    user: {
        ename: {
            required: true,
            message: '请输入企业名称',
            trigger: ['input', 'blur']
        },
        industryName: {
            required: true,
            message: '请输入行业名称',
            trigger: ['input', 'blur']
        },
        eCreateTime: {
            type: 'number',
            message: '请输入成立时间',
            required: true,
            trigger: ['blur', 'change'],
        },
        address: {
            required: true,
            message: '请输入地址',
            trigger: ['input', 'blur']
        },
        corporate: {
            required: true,
            message: '请输入法人',
            trigger: ['input', 'blur']
        },
        trustNum: {
            required: true,
            // message: '请输入社会信用代码',
            trigger: ['input', 'blur'],
            validator(rule: any, value: any) {
                if (!value) {
                    return new Error('请输入社会信用代码')
                } else if (!/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/.test(value)) {
                    return new Error('请输入15或18社会信用代码')
                }
                return true
            },
        },
        contactNum: {
            required: true,
            // message: '请输入联系方式',
            trigger: ['input', 'blur'],
            validator(rule: any, value: any) {
                if (!value) {
                    return new Error('请输入联系方式')
                } else if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(value)) {
                    return new Error('请输入十一位手机号码')
                }
                return true
            },
        },
        platform: {
            required: true,
            message: '请输入归属平台',
            trigger: ['input', 'blur']
        },
    },
}
// pop_批量新增——————————未使用批量新增功能
const showModal_batchAdd = ref(false)
// pop_删除
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除？')
// pop_授权
const showModal_authorization = ref(false)
// 授权列表
const selectOptions = reactive(
    [
        {
            label: '超级管理员',
            value: '0',
            code: '0',
        },
        {
            label: '普通人员',
            value: '1',
            code: '1',
        },
    ]
)

// ------------------------------------------------methods-------------------------------------------------

/**
 * methods_head
 */
// 查询
const query = async () => {
    const params = await dealQueryInfo();
    pagination.page = 1;
    getList(params);
}
// 查询参数出来
const dealQueryInfo = (): Object => {
    let startTime, endTime;
    if (queryInfo.eCreateTime === undefined || queryInfo.eCreateTime === null) {
        startTime = ""
        endTime = ''
    } else {
        startTime = dateFormat(queryInfo.eCreateTime[0], 'Y-M-D')
        endTime = dateFormat(queryInfo.eCreateTime[1], 'Y-M-D')
    }
    let industry = returnIndustryName(queryInfo.industry).code
    const params: any = { ...queryInfo, industry, eName: queryInfo.ename, startTime, endTime }
    delete params.ename
    delete params.eCreateTime
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
    Object.keys(queryInfo).forEach(item => {
        if (item === 'eCreateTime') {
            queryInfo[item] = null
        } else {
            queryInfo[item] = ''
        }
    })
    state && getList()
}
/**
 * methods_table
 */
// 分页翻页
const handlePageChange = async (currentPage: number) => {
    pagination.page = currentPage
    const params = await dealQueryInfo()
    getList({ current: currentPage, ...params })
}
// 展示多少页
const handlePageSize = (pageSizes: number) => {
    pagination.pageSize = pageSizes
    const params = dealQueryInfo()
    getList({ ...params })
}
// 当前选中行——————————————————未使用该功能
const handleCheck = (rowKeys: any) => {
    console.log(rowKeys)
    if (rowKeys.length > 0) {
        delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`
        form_details.checed = rowKeys
    } else {
        delete_content.value = `确认删除吗？`
        form_details.checed = []
    }
}
// 详情
const rowDetails = (row: any, index: number) => {
    form_details.name = '详情'
    open(row)
}
// 编辑
const rowEdit = (row: any, index: number) => {
    form_details.name = '编辑'
    form_details.user.id = row.id
    open(row)
}
// 打开详情/编辑
const open = (row: any) => {
    const {
        ename,
        industryName,
        eCreateTime,
        address,
        corporate,
        trustNum,
        contactNum,
        platform,
    } = row
    form_details.user.ename = ename
    form_details.user.industryName = industryName
    form_details.user.eCreateTime = + new Date(eCreateTime)
    form_details.user.address = address
    form_details.user.corporate = corporate
    form_details.user.trustNum = trustNum
    form_details.user.contactNum = contactNum
    form_details.user.platform = platform
    showModal_newAdd.value = true
}
// 删除
const rowDelete = (row: any, index: number) => {
    delete_content.value = '确认删除？'
    form_details.user.id = row.id
    showModal_delete.value = true
}
// 删除-取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除-确认
const submitCallback = async () => {
    let res: any
    let current
    if (delete_content.value.includes('你')) {
        // 批量删除
        res = await api_account.rowDeleteAll(form_details.checed)
        current = dealPage(1)
    } else {
        // 单行删除
        res = await api_account.rowDelete(form_details.user.id)
        current = dealPage(2)
    }
    if (res.code === 200) {
        message.success('删除成功')
        const params = dealQueryInfo()
        getList({ current, ...params })
    } else {
        message.success('删除失败')
    }
}
// 删除后留在本页页码处理 type===1 批量删除，type === 2 单个删除
const dealPage = (type: number): number => {
    let current: any, newPage
    const lastPage = pagination.pageCount
    if (type === 1) {
        newPage = Math.ceil((pagination.itemCount - form_details.checed.length) / pagination.pageSize);
    } else if (type === 2) {
        newPage = Math.ceil((pagination.itemCount - 1) / pagination.pageSize);
    }
    current = lastPage === newPage ? pagination.page : newPage
    return current
}
// 授权
const authorization = (row: any, index: number) => {
    showModal_authorization.value = true
    form_details.user.id = row.id
}
// 授权-确认授权
const sureAuthorization = () => {
    const { role } = form_details.user
    selectOptions.forEach(item => {
        if (item.label === role) {
            form_details.user.role = item.code
            return
        }
    })
    const params = {
        roleCodeList: [form_details.user.role],
        userCode: form_details.user.id
    }
    api_account.roleAuthorization(params).then((res: any) => {
        if (res.code === 200) {
            message.success('授权成功')
            const params = dealQueryInfo()
            getList({ current: pagination.page, ...params })
        } else {
            message.error('授权失败')
        }
    })
    showModal_authorization.value = false
}
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增'
    form_details.user.ename = ''
    form_details.user.industryName = ''
    form_details.user.eCreateTime = Date.now()
    form_details.user.address = ''
    form_details.user.corporate = ''
    form_details.user.trustNum = ''
    form_details.user.contactNum = ''
    form_details.user.platform = ''
    showModal_newAdd.value = true
}
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增/编辑弹框 - 点击确认
const getNewAddForm = (e: any) => {
    e.preventDefault()
    const dragDivDom: any = formRef.value;
    dragDivDom.validate((errors: any) => {
        if (!errors) {

            if (form_details.name === '新增' || form_details.name === '编辑') {
                const industry = returnIndustryName(form_details.user.industryName).code
                const params = {
                    ...form_details.user,
                    industry,
                    eCreateTime: dateFormat(form_details.user.eCreateTime, 'Y-M-D')
                }
                function mess(res: any) {
                    if (res.code === 200) {
                        if (form_details.name === '新增') {
                            message.success('新增成功')
                            getList()
                        } else {
                            message.success('编辑成功')
                            const params = dealQueryInfo()
                            getList({ current: pagination.page, ...params })
                        }
                    } else {
                        message.warning(`${res.message}`)
                    }
                }
                if (form_details.name === '新增') {
                    api_account.add(params).then((res: any) => {
                        mess(res)
                    })
                }
                if (form_details.name === '编辑') {
                    api_account.edit(params).then((res: any) => {
                        mess(res)
                    })
                }
            }
            showModal_newAdd.value = false

        } else {
            console.log(errors)
            message.error('请检查输入内容')
        }
    })

}
// 导出
const exportList = () => {
    api_account.exportList()
        .then((res: any) => {
            const link = document.createElement("a");
            const blob = new Blob([res]);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "企业账号管理.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href)
        }).catch(function (error) {
            console.log(error);
        });
}
/**
 * methods_popup_delete
 */

/**
 * ----------------------------------------------接口------------------------------------------------
 */
// 获取表格数据
const getList = async (params: any = { current: 1 }) => {
    tableLoading.value = true
    const basic_data = { pageSize: pagination.pageSize, current: 1 }
    const data = { ...basic_data, ...params }
    api_account.getList(data)
        .then((res: any) => {
            if (res.code === 200) {
                tableData.length = 0
                pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize)
                pagination.page = params.current;
                pagination.itemCount = res.data.total
                return res
            } else {
                throw (`code ========> ${res.code}`)
            }
        })
        .then(async (res: any) => {
            res.data.records.forEach((item: any, index: number) => {
                const { ename, industry, eCreateTime, address, corporate, trustNum, contactNum, platform, id } = item
                let industryName = returnIndustryName(industry).value
                const obj = {
                    key: index,
                    index: (data.current - 1) * pagination.pageSize + index + 1,
                    ename,
                    industryName,
                    eCreateTime,
                    address,
                    corporate,
                    trustNum,
                    contactNum,
                    platform,
                    id,
                }
                tableData.push(obj)
            })
            return
        })
        .then(() => {
            tableLoading.value = false
        })
}
// 获取所属行业列表
const getIndustryList = async () => {
    api_account.getIndustryName1({ typeCode: '6' }).then((res: any) => {
        if (res.code === 200) {
            industryList.length = 0
            res.data.forEach((item: any) => {
                const obj = {
                    label: item.name,
                    value: item.name,
                    code: item.value
                }
                industryList.push(obj)
            })
        }
    })
}
// 根据行业对应数字返回行业名称
const returnIndustryName = (str: string): any => {
    let res = {}
    industryList.forEach((item: any) => {
        if (item.code === str || item.value === str) {
            res = item
            return res
        }
    })
    return res
}
// 获取归属平台列表
const getPlatformList = () => {
    const params = { typeNum: 'garden' }
    api_account.getPlatformList(params).then((res: any) => {
        if (res.code === 200) {
            platform.length = 0
            res.data.forEach((item: any) => {
                const obj = { label: item.name, value: item.name }
                platform.push(obj)
            })
        }
    })
}
// 获取用户角色
const getRoleList = async () => {
    const res: any = await api_account.getRoleList()
    if (res.code === 200) {
        selectOptions.length = 0
        res.data.forEach((item: any) => {
            const obj = { label: item.name, value: item.code, code: item.code }
            selectOptions.push(obj)
        })
    }
}
onMounted(() => {
    getList()
    getIndustryList()
    getPlatformList()
    getRoleList()
})

</script>

<style lang="postcss" scoped>
.accountManagement {
    width: 100%;
    > div {
        width: 100%;
        border-radius: 10px;
        background: #fff;
    }
    .top {
        /* height: 210px; */
        /* overflow-x: auto; */

        .main {
            padding: 20px 20px 0 20px;
            > div {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                > div {
                    width: 25%;
                    /* border: 1px solid #f00; */
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    margin-bottom: 20px !important;
                }
                > div:last-child {
                    margin-bottom: 0px;
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
