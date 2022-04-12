<template>
    <div class="userManagement">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- user -->
                    <n-space>
                        <span>用户名</span>
                        <n-input
                            type="text"
                            :style="{ width: '120px' }"
                            v-model:value="queryInfo.name"
                            placeholder="请输入姓名"
                            :maxlength="formMaxLength"
                            clearable
                        />
                    </n-space>
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
                    <!-- Role -->
                    <n-space>
                        <span>用户角色</span>
                        <n-select
                            :style="{ width: '140px' }"
                            placeholder="选择角色"
                            v-model:value="queryInfo.roleCode"
                            :options="selectOptions"
                        />
                    </n-space>
                    <!-- department -->
                    <n-space>
                        <span>部门</span>
                        <n-cascader
                            :style="{ width: '160px' }"
                            :options="departmentOptions"
                            v-model:value="queryInfo.deptName"
                            label-field="label"
                            value-field="value"
                            children-field="children"
                            default-value="test_1_1"
                            check-strategy="child"
                        />
                    </n-space>
                    <!--  -->
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
                        :row-key="(row: any) => (row.code)"
                        @update:checked-row-keys="handleCheck"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
            <div class="topright">
                <n-space>
                    <n-button type="primary" @click="newAdd">新增</n-button>
                    <n-button type="success" @click="showModal_batchAdd = true">批量新增</n-button>
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
        <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
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
                    <n-form-item label="用户姓名" path="user.name">
                        <n-input
                            v-model:value="form_details.user.name"
                            clearable
                            :disabled="form_details.name === '详情'"
                            :maxlength="formMaxLength"
                            placeholder="输入姓名"
                        />
                    </n-form-item>
                    <n-form-item label="用户账号" path="user.account">
                        <n-input
                            v-model:value="form_details.user.account"
                            clearable
                            :disabled="form_details.name === '详情'"
                            :maxlength="formMaxLength"
                            placeholder="输入账号"
                        />
                    </n-form-item>
                    <n-form-item label="归属部门" path="user.deptName">
                        <n-cascader
                            :options="departmentOptions"
                            v-model:value="form_details.user.deptName"
                            label-field="label"
                            value-field="value"
                            children-field="children"
                            default-value="test_1_1"
                            check-strategy="child"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item>
                    <n-form-item label="归属职位" path="user.job">
                        <n-input
                            v-model:value="form_details.user.job"
                            :disabled="form_details.name === '详情'"
                            :maxlength="formMaxLength"
                            clearable
                            placeholder="输入职位"
                        />
                    </n-form-item>
                    <n-form-item label="联系方式" path="user.phone">
                        <n-input
                            v-model:value="form_details.user.phone"
                            clearable
                            placeholder="输入联系方式"
                            :maxlength="formMaxLength"
                            :disabled="form_details.name === '详情'"
                        />
                    </n-form-item>
                    <n-form-item label="用户角色 " path="user.role">
                        <n-select
                            placeholder="输入角色"
                            v-model:value="form_details.user.role"
                            :options="selectOptions"
                            :disabled="form_details.name === '详情' || form_details.name === '编辑'"
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
        </n-config-provider>

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
                <n-button type="info" @click="batchDown">模板下载</n-button>
            </n-space>
            <n-space style="margin-top: 20px;">
                点击按钮上传文件
                <!-- <n-upload
                    method="POST"
                    action="http://10.51.100.70:9527/uaa/user-role"
                    :headers="{ 'Content-Type': 'multipart/form-data' }"
                    :data="{
                        'type': 1
                    }"
                >
                    <n-button>上传文件</n-button>
                </n-upload>-->
                <!-- 手写测试 -->
                <!-- <n-upload> -->
                <input type="file" ref="file" />
                <!-- </n-upload> -->
            </n-space>

            <template #footer>
                <n-space>
                    <n-button type="info" @click="batchSure">确认</n-button>
                    <n-button type="info" @click="showModal_batchAdd = false">取消</n-button>
                </n-space>
            </template>
        </n-modal>
        <!-- popup_delete-->
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
            <n-form :model="selectOptions">
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
import { ref, reactive, h, onMounted, } from 'vue'
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui'
// components
import blueTitle from '@components/public/title/index.vue'
// api
import api_user from '../../../axios/api/user/index'
import { dateFormat } from '../../../util/verification';

// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage()
/**
 * state_head
 */
// queryInfo
const queryInfo = reactive({
    name: '',
    // time: [0, Date.now()],
    time: <any>ref(),

    roleCode: '',
    deptId: '',
    deptName: "",
})
// role
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
// department
const departmentOptions = reactive(
    [
        {
            label: 'test_1',
            value: 'test_1',
            id: '0',
            parentId: '-1',
            children: [
                {
                    label: "test_1_1",
                    value: "test_1_1",
                    id: '1',
                    parentId: '0',

                },
            ]
        }
    ]
)
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
        width: 80,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '用户姓名',
        key: 'name',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '用户账号',
        key: 'account',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '归属部门',
        key: 'deptName',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '职位',
        key: 'job',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '联系方式',
        key: 'phone',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '用户角色',
        key: 'role',
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
        name: '',
        account: '',
        deptName: '',
        job: '',
        phone: '',
        role: '',
        createTime: '',
    }
])
// pagination
const pagination = reactive({
    itemCount: 0,
    pageCount: 5,//总共显示几个页码
    page: 1,//当前显示页码
    pageSize: 10,//每页显示数据条数
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
        name: '',
        account: "",
        deptName: '',
        deptId: '',
        job: '',
        role: '',
        phone: '',
        code: '',
    },
    checed: [],
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
        },
        deptName: {
            required: true,
            message: '请输入部门',
            trigger: ['input', 'blur']
        },
        job: {
            required: true,
            message: '请输入职位',
            trigger: ['input', 'blur']
        },
        role: {
            required: true,
            message: '请输入角色',
            trigger: ['input', 'blur']
        },
        phone: {
            required: true,
            // message: '请输入联系方式',
            trigger: ['input', 'blur'],
            validator(rule: any, value: any) {
                if (!value) {
                    return new Error('请输入联系方式')
                } else if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(value)) {
                    return new Error('请输入十一位电话号码')
                }
                return true
            },
        },
    },
}
/**
 * state_pop_bacthAdd
 */
// show_or_hidden_modal
const showModal_batchAdd = ref(false)
/**
 * state_pop_delete
 */
// show_or_hidden_modal
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除吗？')
/**
 * state_pop_authorization
 */
const showModal_authorization = ref(false)

// ------------------------------------------------methods-------------------------------------------------

/**
 * methods_head
 */
// test

// 查询
const query = () => {
    const params = dealQueryData()
    pagination.page = 1
    getList(params)
    // throttle(query, 3000)()
}
// 处理查询参数
const dealQueryData = () => {
    let startTime, endTime
    if (queryInfo.time === undefined || queryInfo.time === null) {
        startTime = dateFormat(0, 'Y-m-d')
        endTime = dateFormat(Date.now(), 'Y-m-d')
    } else {
        startTime = dateFormat(queryInfo.time[0], 'Y-m-d')
        endTime = dateFormat(queryInfo.time[1], 'Y-m-d')
    }
    const { name, deptName, roleCode, deptId } = queryInfo
    const params = {
        name,
        deptName,
        deptId,
        startTime,
        endTime,
        roleCode,
    }
    departmentOptions.forEach((item: any) => {
        if (item.label === deptName) {
            params.deptId = item.id
            return
        }
        item.children && item.children.forEach((p: any) => {
            if (p.label === deptName) {
                params.deptId = p.id
                return
            }
        })
    })
    return params
}
// 重置
const reset = () => {
    const state = Object.keys(queryInfo).some((item: string) => {
        if (item !== 'deptId') {
            if (['', null, undefined].includes(queryInfo[item])) {
                return false
            } else {
                return true
            }
        }
    })
    queryInfo.name = ''
    queryInfo.roleCode = ''
    queryInfo.deptId = ''
    queryInfo.deptName = ''
    // queryInfo.time = [0, Date.now()]
    queryInfo.time = null
    state && getList()
}
/**
 * methods_table
 */
// 分页翻页
const handlePageChange = (currentPage: number) => {
    pagination.page = currentPage
    const params = dealQueryData()
    getList({ current: currentPage, ...params })
}
// 展示多少页
const handlePageSize = (pageSizes: number) => {
    pagination.pageSize = pageSizes
    const params = dealQueryData()
    getList({ ...params })
}
// 详情
const rowDetails = (row: any, index: number) => {
    form_details.name = '详情'
    open(row)
}
// 编辑
const rowEdit = (row: any, index: number) => {
    form_details.name = '编辑'
    open(row)
}
// 详情/编辑弹框打开时
const open = (row: any) => {
    const { name, account, deptName, job, role, phone, code } = row
    form_details.user.name = name
    form_details.user.account = account
    form_details.user.deptName = deptName
    form_details.user.job = job
    form_details.user.role = role
    form_details.user.phone = phone
    form_details.user.code = code
    showModal_newAdd.value = true
}
// 批量删除表格当前选中行
const handleCheck = async (rowKeys: any) => {
    if (rowKeys.length > 0) {
        delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`
        form_details.checed = rowKeys
    } else {
        delete_content.value = `确认删除吗？`
        form_details.checed = []
    }
}
// 单个删除
const rowDelete = (row: any, index: number) => {
    form_details.user.code = row.code
    delete_content.value = '确认删除吗'
    showModal_delete.value = true
}
// 删除-取消删除
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除-确认删除
const submitCallback = async () => {
    let res: any
    let current
    if (delete_content.value.includes('你')) {
        // 批量删除
        res = await api_user.batchDelete(form_details.checed)
        current = dealPage(1)
    } else {
        // 单行删除
        res = await api_user.deleteOne(form_details.user.code)
        current = dealPage(2)
    }
    if (res.code === 200) {
        message.success('删除成功')
        const params = dealQueryData()
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
    const params = { code: row.code }
    api_user.queryRole(params).then((res: any) => {
        form_details.user.role = res.data[0].name
        form_details.user.code = row.code
    })
    showModal_authorization.value = true
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
        userCode: form_details.user.code
    }
    api_user.roleAuthorization(params).then((res: any) => {
        if (res.code === 200) {
            message.success('授权成功')
            const params = dealQueryData()
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
    Object.keys(form_details.user).forEach(item => {
        form_details.user[item] = ''
    })
    showModal_newAdd.value = true
}
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增/编辑弹框 - 点击确认 - 新增/编辑用户
const getNewAddForm = (e: any) => {
    e.preventDefault()
    const dragDivDom: any = formRef.value;
    dragDivDom.validate((errors: any) => {
        if (!errors) {

            if (form_details.name === '新增') {
                const data = dealFormData('新增')
                if (!!data) {
                    const parmas: any = {
                        ...data,
                        roleCodeList: [form_details.user.role]
                    }
                    api_user.addUser({ ...parmas, type: userType }).then((res: any) => {
                        if (res.code === 200) {
                            message.success('新增成功')
                            getList()
                        } else {
                            message.error(res.message)
                        }
                    })
                }
            }
            if (form_details.name === '编辑') {
                const data = dealFormData('编辑')
                if (!!data) {
                    api_user.editUser({ ...data, type: userType }).then((res: any) => {
                        if (res.code === 200) {
                            message.success('编辑成功')
                            const params = dealQueryData()
                            getList({ current: pagination.page, ...params })
                        } else {
                            message.error('编辑失败')
                        }
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
// 新增/编辑判断是否填完参数，并处理数据
const dealFormData = (str: string) => {
    // 判断是否填完参数
    const { name, account, deptName, role, job, phone } = form_details.user
    let state
    if (str === '编辑') {
        state = Object.values({ name, account, deptName, job, phone }).some((item: string) => item === '')
    } else {
        state = Object.values({ name, account, deptName, role, job, phone }).some((item: string) => item === '')
    }
    if (state) {
        message.error('请填写相关信息')
        return false
    } else {
        // 数据处理-获取部门id
        const id = ref('')
        departmentOptions.forEach((item: any) => {
            if (item.label === deptName) {
                id.value = item.id
                return
            }
            item.children && item.children.forEach((p: any) => {
                if (p.label === deptName) {
                    id.value = p.id
                    return
                }
            })
        })
        const parmas: any = { ...form_details.user }
        parmas.deptId = id.value
        delete parmas.role
        return parmas
    }
}
// 批量新增模板下载
const batchDown = () => {
    api_user.batchFileDownload(userType)
        .then((res: any) => {
            const link = document.createElement("a");
            const blob = new Blob([res]);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "批量新增模板.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href)
        }).catch(function (error) {
            console.log(error);
        });
}
// 批量新增上传文件
const file = ref()
const batchSure = async () => {
    const Checkedfile = file.value.files
    if (Checkedfile.length === 0) {
        message.error('请选择文件')
    } else {
        const formData = new FormData()
        formData.append('file', Checkedfile[0])
        formData.append('type', '' + userType)
        const res: any = await api_user.batchUpload(formData)
        if (res.code === 200) {
            showModal_batchAdd.value = false
            message.success('批量新增成功')
            getList()
        } else {
            message.error(res.message)
        }
    }
}
// 导出
const exportList = () => {
    api_user.exportList({ type: userType })
        .then((res: any) => {
            const link = document.createElement("a");
            const blob = new Blob([res]);
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "企业用户管理.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href)
        }).catch(function (error) {
            console.log(error);
        });
}
/**
 * ----------------------------------------------接口------------------------------------------------
 */
// 1-管委会 2-企业用户
const userType = 1
// 获取表格数据
const getList = (params: any = { current: 1 }) => {
    tableLoading.value = true
    const basic_data = { type: userType, size: pagination.pageSize, current: 1 }
    const data = { ...basic_data, ...params }
    api_user.getList(data)
        .then((res: any) => {
            if (res.code === 200) {
                console.log(res)
                tableData.length = 0
                pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize)
                pagination.page = data.current
                pagination.itemCount = res.data.total
                res.data.records.forEach((item: any, index: number) => {
                    const { name, account, createTime, phone, deptName, job, code } = item
                    const role = item.roleNameList.join()
                    const obj = {
                        key: index,
                        index: (data.current - 1) * pagination.pageSize + index + 1,
                        name,
                        account,
                        deptName,
                        job,
                        phone,
                        role,
                        createTime,
                        code
                    }
                    tableData.push(obj)
                })
            }
            tableLoading.value = false
        })
}
// 获取用户角色
const getRoleList = async () => {
    api_user.getRoleList().then((res: any) => {
        if (res.code === 200) {
            selectOptions.length = 0
            res.data.forEach((item: any) => {
                const obj = { label: item.name, value: item.code, code: item.code }
                selectOptions.push(obj)
            })
        }
    })
}
// 获取部门
const getDeptment = () => {
    api_user.getDetList().then((res: any) => {
        if (res.code === 200) {
            departmentOptions.length = 0
            res.data.forEach((item: any) => {
                const obj = {
                    label: item.deptName,
                    value: item.deptName,
                    id: item.id,
                    parentId: item.parentId,
                    children: <any>[],
                }
                item.children && item.children.forEach((p: any) => {
                    obj.children.push({
                        label: p.deptName,
                        value: p.deptName,
                        id: p.id,
                        parentId: p.parentId,
                    })
                })
                departmentOptions.push(obj)
            })
        }
    })
}
/**
 * ----------------------------------------------live------------------------------------------------
 */
onMounted(() => {
    getList()
    getRoleList()
    getDeptment()
})
</script>

<style lang="postcss" scoped>
.userManagement {
    width: 100%;
    > div {
        width: 100%;
        border-radius: 10px;
        background: #fff;
    }
    .top {
        /* height: 170px; */
        /* overflow-x: auto; */
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