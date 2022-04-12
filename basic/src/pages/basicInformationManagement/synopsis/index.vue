<!--
 * @Author: liyuan
 * @Date: 2022-01-15 11:28:01
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-17 17:57:43
 * @FilePath: \swyqxt\basic\src\pages\basicInformationManagement\synopsis\index.vue
-->
<template>
    <div class="videoCompont">
        <div class="list">
            <blue-title :propValue="'数据列表'" />
            <div class="topright">
                <n-space justify="end">
                    <n-button type="primary" @click="add">新增</n-button>
                </n-space>
            </div>

            <div class="tableList">
                <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                    <n-data-table
                        :remote="true"
                        :bordered="false"
                        :columns="columns"
                        :data="dataList"
                        :pagination="pagination"
                        @update:page="handlePageChange"
                        :row-key="(row: any) => (row.code)"
                        @update:pageSize="handlePageSize"
                    />
                </n-config-provider>
            </div>
        </div>
    </div>
    <!-- 新增删除弹窗 -->
    <n-modal v-model:show="showModal.addOrUpdate" preset="dialog" title="Dialog">
        <template #header>
            <div>{{ modalName.name }}</div>
        </template>
        <n-form :model="model" ref="formRef" :rules="rules">
            <n-form-item path="name" label="园区名称">
                <n-input v-model:value="model.name" @keydown.enter.prevent placeholder="请输入园区名称" />
            </n-form-item>
            <n-form-item path="parkIntroduc" label="园区介绍">
                <n-input
                    v-model:value="model.parkIntroduc"
                    @keydown.enter.prevent
                    placeholder="请输入园区介绍"
                />
            </n-form-item>
            <!-- <n-form-item path="promotionalVideo" label="宣传视频地址">
                <n-input
                    v-model:value="model.promotionalVideo"
                    @keydown.enter.prevent
                    placeholder="请输入宣传视频地址"
                />
            </n-form-item> -->
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content:flex-end;">
                        <n-button
                            @click="save"
                            :disabled="model.name === ''"
                            round
                            type="primary"
                        >保存</n-button>
                    </div>
                </n-col>
            </n-row>
        </n-form>
    </n-modal>
    <!-- 删除 -->
    <n-modal
        v-model:show="showModal.del"
        preset="dialog"
        title="是否删除该数据"
        content="你确认?"
        positive-text="确认"
        @positive-click="submitCallback"
        @negative-click="cancelCallback"
        negative-text="取消"
    />
</template>
<script lang="ts" setup>
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import { reactive, h, ref } from 'vue';
import Synopsis from '../../../axios/api/basicInformationManagement/synopsis'
import blueTitle from '@components/public/title/index.vue'
const message = useMessage();
const model = ref<any>({
    name: "",
    parkIntroduc: "",
    promotionalVideo: "",
    reenteredPassword: ""
})
const pagination = reactive({
    pageCount: 5,//总共显示几个页码
    page: 1,//当前显示页码
    pageSize: 10,//每页显示数据条数
    pageSizes: [10, 20],
    showSizePicker: true,
    suffix: ({ itemCount }: any) => {
        return `总共${itemCount}条`
    }
})
// 宣传视频
const columns = reactive([
    {
        title: "序号",
        key: "num",
        // align: 'center'
    }, {
        title: "园区名",
        key: "name",
        align: 'center'
    }, {
        title: "园区简介",
        key: "parkIntroduc",
        align: 'center'
    }, {
        // title:"操作",
        key: "active",
        align: "right",
        render(row: object) {
            return h(NSpace,
                {
                    justify: "end"
                },
                [
                    /* h(NButton, {
                        type: "info",
                        size: 'small',
                        onClick: () => query(row)
                    }, {
                        default: () => '查看'
                    }), */
                    h(NButton, {
                        type: "warning",
                        size: 'small',
                        onClick: () => updata(row)
                    }, {
                        default: () => '修改'
                    }),
                    h(NButton, {
                        type: "error",
                        size: 'small',
                        onClick: () => del(row)
                    }, {
                        default: () => '删除'
                    })
                ])
        }
    }
]);
let dataList = ref();

//获取数据
let getList = (params: any = { current: 1 }) => {
    Synopsis.getSynopsis(params).then((res: any) => {
        if (res.code == "200") {
            pagination.pageCount = Math.ceil(res.data.length / pagination.pageSize);
            (pagination as any).itemCount = res.data.total;
            res.data.records.forEach((e: any, index: number) => {
                e.num = index + 1;
            })
            dataList.value = res.data.records;
        }
    })
};
getList();

const query = (raw: object) => {
    console.log(raw);

}
const updata = (raw: any) => {
    showModal.addOrUpdate = true;
    modalName.name = "修改";
    model.value = Object.assign({}, raw)
    console.log(model.value);
}
let delDataId = ""
const del = (raw: any) => {
    showModal.del = true;
    delDataId = raw.id
}

const add = () => {
    showModal.addOrUpdate = true;
    modalName.name = "新增";
    for (const key in model.value) {
        model.value[key] = ""
    }
}

let modalName = reactive({ name: "" })
//新增
let showModal = reactive({ addOrUpdate: false, del: false })

const rules = ref();
//新增编辑保存
const save = () => {
    if (modalName.name == "新增") {
        Synopsis.addSynopsis(model.value).then((res: any) => {
            if (res.code == "200") {
                message.success('操作成功！')
                showModal.addOrUpdate = false;
                getList();
            }
        })
    } else if (modalName.name == "修改") {
        Synopsis.updateSynopsis(model.value).then((res: any) => {
            if (res.code == "200") {
                message.success('操作成功！')
                showModal.addOrUpdate = false;
                getList();
            }
        })
    }

}
//删除确认
let submitCallback = () => {
    Synopsis.delSynopsis(delDataId).then((res: any) => {
        if (res.code == "200") {
            message.success('操作成功！')
            showModal.del = false;
            getList();
        }
    })
}
let cancelCallback = () => {
    //  window.$message.success('Cancel')
}
// 分页翻页
const handlePageChange = (currentPage: number) => {
    pagination.page = currentPage
    // const params = dealQueryData()
    getList({ current: currentPage })
}
// 展示多少页
const handlePageSize = (pageSizes: number) => {
    pagination.pageSize = pageSizes
    // const params = dealQueryData()
    getList({ pageSize: pageSizes })
}
</script>
<style lang="postcss" scoped>
.videoCompont {
    > div {
        width: 100%;
        border-radius: 10px;
        background: #fff;
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
</style>