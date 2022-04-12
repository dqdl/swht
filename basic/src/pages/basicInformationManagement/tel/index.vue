<template>
    <div class="basic_envrionment">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- type -->
                    <n-space>
                        <span>单位</span>
                        <n-input
                            type="text"
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.unitName"
                            placeholder="请输单位名"
                            clearable
                        />
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
                    <n-form-item label="单位名" path="user.unitName">
                        <n-input
                            v-model:value="form_details.user.unitName"
                            clearable
                            placeholder="请输入单位名"
                        />
                    </n-form-item>
                    <n-form-item label="联系方式" path="user.contactInformation">
                        <n-input
                            v-model:value="form_details.user.contactInformation"
                            clearable
                            placeholder="请输入联系方式"
                        />
                    </n-form-item>
                    <n-form-item label="人员类型" path="user.personnelType">
                        <n-input
                            v-model:value="form_details.user.personnelType"
                            :disabled="true"
                            clearable
                            placeholder="请输入人员类型"
                        />
                    </n-form-item>
                    <n-form-item label="备注" path="user.remark">
                        <n-input
                            v-model:value="form_details.user.remark"
                            type="textarea"
                            :autosize="{
                                minRows: 3,
                                maxRows: 5
                            }"
                            clearable
                            placeholder="备注"
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
import Api from '../../../axios/api/tel/index'
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
    unitName: '',
    time: null,
})
// form_details
let form_details: any = reactive({
    name: '',
    user: {
        unitName: '',
        contactInformation: '',
        personnelType: '园区外部应急人员',
        remark: '',
        id: ''
    },
})

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
    if (queryInfo.unitName) {
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
        unitName: queryInfo.unitName,
    }
    Api.getList(info).then((res: any) => {
        if (res.code == "200") {
            pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
            (pagination as any).itemCount = res.data.total;
            res.data.records.forEach((e: any, index: number) => {
                e.num = index + 1;
            })
            tableData.value = res.data.records;
        }
    })

}
// reset
const reset = () => {
    queryInfo.unitName = ''
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
        title: '单位名称',
        key: 'unitName',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '人员类型',
        key: 'personnelType',
        align: 'center',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '联系方式',
        key: 'contactInformation',
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
    }
    const data = { ...basicData, ...params }
    const res: any = await Api.getList(data)
    console.log(1111, res)
    if (res.code == "200") {
        pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
        (pagination as any).itemCount = res.data.total;
        pagination.page = data.current
        res.data.records.forEach((e: any, index: number) => {
            e.num = index + 1;
        })
        tableData.value = res.data.records;
    }
};
getList();

// 新增弹框 - 打开（显示隐藏）
const showModal_newAdd = ref(false)
// 新增弹框 - 打开
const newAdd = () => {
    form_details.name = '新增';
    form_details.user.unitName = '';
    form_details.user.contactInformation = '';
    form_details.user.remark = '';
    showModal_newAdd.value = true;
}
// 新增弹框（表单验证规则）
const rules = {
    user: {
        unitName: {
            required: true,
            message: '请输单位名称',
            trigger: ['input', 'blur']
        },
        contactInformation: {
            required: true,
            message: '请输入联系方式',
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
            if (form_details.name === '新增') {
                Api.addList(form_details.user).then((res: any) => {
                    message.success('新增成功')
                    getList();
                })
            } else {
                Api.updateList({ ...form_details.user }).then((res: any) => {
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
    form_details.user.id = row.id
    form_details.user.unitName = row.unitName
    form_details.user.contactInformation = row.contactInformation
    form_details.user.remark = row.remark
    showModal_newAdd.value = true
    // debugger
}
// 删除弹框 - 打开（显示隐藏）
const showModal_delete = ref(false)
// 删除共用提示内容
const delete_content = ref('确认删除吗？')
let rowDeleteId = ref('')
// 删除弹框
const rowDelete = (row: any) => {
    rowDeleteId.value = row.id
    showModal_delete.value = true
}
// 删除取消
const cancelCallback = () => {
    message.success('取消删除')
}
// 删除确定
const submitCallback = () => {
    Api.deleteList({ id: rowDeleteId.value }).then((res: any) => {
        if (res.code === 200) {
            message.success('删除成功')
            getList();
        }

    })

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