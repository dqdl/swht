<!--
 * @Author: liyuan
 * @Date: 2022-01-15 11:28:01
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-19 16:42:56
 * @FilePath: \swyqxt\basic\src\pages\basicInformationManagement\video\index.vue
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
    <n-modal v-model:show="showModal.video" preset="dialog" title="Dialog">
        <template #header>
            <div>预览视频</div>
        </template>
        <div>
            <video
                ref="videourl"
                style="width:400px;height:400px;"
                :src="model.videoAddress"
                controls
            ></video>
        </div>
    </n-modal>
    <!-- 新增编辑弹窗 -->
    <n-modal
        @after-leave="afterLeave"
        v-model:show="showModal.addOrUpdate"
        preset="dialog"
        title="Dialog"
    >
        <template #header>
            <div>{{ modalName.name }}</div>
        </template>
        <n-form :model="model" ref="formRef" :rules="rules">
            <!-- <n-form-item path="name" label="版本号">
                <n-input v-model:value="model.version" @keydown.enter.prevent placeholder="该字段不能为空" />
            </n-form-item>-->
            <n-form-item path="name" label="视频名称">
                <n-input
                    v-model:value="model.videoName"
                    @keydown.enter.prevent
                    placeholder="请输入视频名称"
                />
            </n-form-item>
            <n-form-item path="promotionalVideo" label="视频上传(仅支持MP4格式)">
                <n-upload
                    ref="upload"
                    accept="video/mp4"
                    @remove="videoRemove"
                    @finish="handleFinish"
                    :default-file-list="defaultFileList"
                    @before-upload="beforeUpload"
                    action="http://121.204.146.20:9527/file/upload"
                >
                    <n-button>上传文件</n-button>
                </n-upload>
                <!-- <n-upload
                :default-file-list="defaultFileList"
            >
                <n-button>视频上传</n-button>
                </n-upload>-->
            </n-form-item>
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content:flex-end;">
                        <n-button @click="save" round type="primary">保存</n-button>
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
    <!-- <n-modal v-model:show="showModal.video" preset="dialog" title="Dialog">
        <template #header>
            <div>{{ modalName.name }}</div>
        </template>

    </n-modal>-->
</template>
<script lang="ts" setup>
import {
    NSwitch,
    zhCN,
    dateZhCN,
    NButton,
    NSpace,
    useMessage
} from 'naive-ui';
import {
    reactive,
    h,
    ref
} from 'vue';
import Synopsis from '../../../axios/api/basicInformationManagement/synopsis'
import {
    dateFormat
} from "../../../util/verification"
import blueTitle from '@components/public/title/index.vue'
const message = useMessage();
let videourl: any = ref(null)
const columns = reactive([{
    title: "序号",
    key: "num",
}, {
    title: "视频名称",
    key: "videoName",
    align: 'center',
},
/* {
        title: "版本号",
        key: "version",
    }, */
{
    title: "上传时间",
    key: "uploadTime",
    align: 'center',
}, {
    key: "active",
    align: "right",
    width: 300,
    render(row: any) {
        return h(NSpace, {
            justify: "end"
        },
            [
                h(NSwitch, {
                    size: 'large',
                    value: Boolean(row.enable),
                    onClick: () => railStyle(row)
                }, {
                    checked: () => '启用',
                    unchecked: () => '禁用'
                }),
                h(NButton, {
                    type: "info",
                    size: 'small',
                    onClick: () => query(row)
                }, {
                    default: () => '查看'
                }),
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
])
let defaultFileList: any = reactive([

])
const pagination = reactive({
    pageCount: 5, //总共显示几个页码
    page: 1, //当前显示页码
    pageSize: 10, //每页显示数据条数
    pageSizes: [10, 20],
    showSizePicker: true,
    suffix: ({
        itemCount
    }: any) => {
        return `总共${itemCount}条`
    }
})
const data = ref()
let dataList = ref();
//获取数据
let getList = (params: any = {
    current: 1
}) => {
    Synopsis.getSynopsisVideo(params).then((res: any) => {
        if (res.code == "200") {
            pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
            (pagination as any).itemCount = res.data.total
            res.data.records.forEach((e: any, index: number) => {
                e.num = index + 1;
                e.updateTime = dateFormat(e.updateTime, null)
                e.uploadTime = dateFormat(e.uploadTime, null)
            })
            dataList.value = res.data.records;
        }
    })
};

getList();
const query = (raw: any) => {
    if (!raw.videoAddress) {
        message.success('暂无视频，请上传视频！！')
        return
    }
    console.log(raw);
    modalName.name = "视频详情";
    showModal.video = true;
    model.value.videoAddress = raw.videoAddress
}
const updata = (raw: any) => {
    defaultFileList.length = 0;
    showModal.addOrUpdate = true;
    modalName.name = "修改";
    model.value.videoName = raw.videoName;
    model.value.id = raw.id;
    model.value.enable = raw.enable;
    // model
    // if (raw.videoAddress) {
    //     let file = { id: raw.id, name: raw.videoName, status: 'finished' }
    //     defaultFileList.push(file)
    // }
}
let delDataId = ""
const del = (raw: any) => {
    showModal.del = true;
    delDataId = raw.id;
}
const add = () => {
    defaultFileList.length = 0;
    showModal.addOrUpdate = true;
    modalName.name = "新增";
    for (var obj in model.value) {
        model.value[obj] = ""
    }
}


let modalName = reactive({
    name: ""
})
let fileUpload = ref()
//新增
let showModal = reactive({
    addOrUpdate: false,
    del: false,
    video: false
})
let model = ref<any>({
    version: "",
    uploadTime: "",
    videoName: "",
    videoAddress: ''
})
const rules = ref({
    name: [
        {
            required: false,
            message: '',
            trigger: ['input', 'blur']
        }
    ],
    promotionalVideo: [
        {
            required: false,
            message: '',
            trigger: ['input', 'blur']
        }
    ]
});
const formRef = ref(null)
//新增编辑保存
const save = () => {
    if (!isTrue.value) {
        message.success('文件正在上传，请稍后！')
        return
    }
    // model.value.file = fileUpload.value.files[0];
    console.log(model.value.videoName);

    if (model.value.videoName) {
        if (modalName.name == "新增") {
            Synopsis.addSynopsisVideo(model.value).then((res: any) => {
                if (res.code == "200") {
                    message.success('操作成功！')
                    showModal.addOrUpdate = false;
                    model.value.videoName = ''
                    getList();
                }
            })
        } else if (modalName.name == "修改") {
            let data = JSON.parse(JSON.stringify(model.value));
            delete data.uploadTime
            delete data.version
            delete data.videoAddress
            Synopsis.updateSynopsisVideo(data).then((res: any) => {
                if (res.code == "200") {
                    message.success('操作成功！')
                    showModal.addOrUpdate = false;
                    model.value.videoName = ''
                    getList();
                }
            })
        }
    } else {
        message.error('请填写视频名称')
    }


}

//删除
let submitCallback = () => {
    Synopsis.delSynopsisVideo(delDataId).then((res: any) => {
        if (res.code == "200") {
            message.success('操作成功！')
            showModal.del = false;
            getList();
        }
    })
}
let cancelCallback = () => {
    message.success('Cancel')
}

// 分页翻页
const handlePageChange = (currentPage: number) => {
    pagination.page = currentPage
    // const params = dealQueryData()
    getList({
        current: currentPage
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

const handleFinish = ({
    file,
    event
}: any) => {

    // event.target.response
    message.success('上传视频成功')
    isTrue.value = true;
    model.value.videoAddress = JSON.parse(event.target.response).data.url;
}
let isTrue = ref(true)
const beforeUpload = ({ file, fileList }: any) => {
    if (file.file.type !== 'video/mp4') {
        message.error('只能上传mp4格式的视频文件，请重新上传')
        return false
    }
    isTrue.value = false;
    return true
}
const videoRemove = () => {
    isTrue.value = true;
    // model.value.videoAddress = "";
}
// let upload: any = ref<HTMLElement>();
const afterLeave = () => {
    isTrue.value = true;
    // console.log(111111111,upload.value)
    // upload.value?.clear()
}
const railStyle = (res: any) => {
    // debugger
    // dataList.value.forEach((ele:any) => {
    //     if(ele.id !== res.id) {
    //         ele.enable = 0
    //     }
    // });
    console.log(res.enable);
    res.enable = Number(!res.enable);
    Synopsis.updateSynopsisVideo(res).then((res: any) => {
        if (res.code == "200") {
            message.success('操作成功！')
            showModal.addOrUpdate = false;
            getList();
        }
    })
}
</script>
<style lang="postcss" scoped>
/* .content {
    display: flex;
    margin-top: 10px;
    height: 97%;
} */
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