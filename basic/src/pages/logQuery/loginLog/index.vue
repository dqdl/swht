<template>
    <div class="logQuery">
        <!-- topHead -->
        <div class="top">
            <blue-title :propValue="'查询'" />
            <div class="main">
                <div class="left">
                    <!-- type -->
                    <n-space>
                        <span>登录状态</span>
                        <n-select
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.loginStatus"
                            :options="loginOptions"
                        />
                    </n-space>
                    <!-- time -->
                    <n-space>
                        <span>访问时间</span>
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
                    <!-- userType -->
                    <n-space>
                        <span>用户类型</span>
                        <n-select
                            :style="{ width: '140px' }"
                            v-model:value="queryInfo.userType"
                            :options="userptions"
                        />
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
        </div>
    </div>
</template>

<script lang="ts" setup>
// vue
import { ref, reactive, onMounted } from 'vue'
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui'
// components
import blueTitle from '@components/public/title/index.vue'
// api
import loginLog from "../../../axios/api/logQuery/loginLog";
// 引入外部函数
import { dateFormat } from "../../../util/verification"
// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage()

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
//表格类型
const tableHead = reactive([
    {
        type: 'selection',
        options: [
            'all',
            'none',
            {
                // label: "",
                // key: '',
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
        title: '用户名',
        align: 'center',
        key: 'username',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '用户类型',
        align: 'center',
        key: 'usertype',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '访问时间',
        align: 'center',
        key: 'time',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '登录ip地址',
        align: 'center',
        key: 'ip',
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '登录状态',
        align: 'center',
        key: 'status',
        ellipsis: {
            tooltip: true
        }
    }
])
//列表数据
let tableData = reactive([
    {
        key: 0,
        index: 1,
        username: '',
        usertype: '',
        time: '',
        ip: '',
        status: '',
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
    startTime: "",
    endTime: "",
    status: "",
    userType: "",
    username: ""
})
// 查询条件显示
let queryInfo = reactive({
    zhCN: zhCN,
    dateZhCN: dateZhCN,
    loginStatus: '',
    time: null,
    userType: '',
})
// 下拉框数据
const loginOptions = reactive(
    [
        {
            label: '成功',
            value: 0
        },
        {
            label: '失败',
            value: 1
        },
    ]
)
const userptions = reactive(
    [
        {
            label: '管委会用户',
            value: 1
        },
        {
            label: '企业用户',
            value: 2
        },
    ]
)
// 获取日志列表
const getList = () => {
    let data = param.value;
    loginLog.getList(data).then((res: any) => {
        if (res.code == 200) {
            tableData.length = 0;
            res.data.records.forEach((item: any, index: number) => {
                let { accessTime, status, userName, userType, ipaddr } = item;
                pagination.pageCount = res.data.pages;
                (pagination as any).itemCount = res.data.total
                tableData.push({
                    key: index,
                    index: index + 1,
                    username: userName,
                    usertype: userType == 1 ? "管委会用户" : "企业用户",
                    time: accessTime,
                    ip: ipaddr,
                    status: status == 0 ? "成功" : "失败",
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
    param.value.status = queryInfo.loginStatus;
    param.value.userType = queryInfo.userType;
    param.value.startTime = queryInfo.time ? dateFormat(queryInfo.time[0], "y-m-d") : '';
    param.value.endTime = queryInfo.time ? dateFormat(queryInfo.time[1], "y-m-d") : ''
    getList()
}
// 重置
const reset = () => {
    queryInfo.loginStatus = ''
    queryInfo.time = null
    queryInfo.userType = ''
}
onMounted(() => {
    getList()
})
</script>

<style lang="postcss" scoped>
.logQuery {
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
    }
}
</style>