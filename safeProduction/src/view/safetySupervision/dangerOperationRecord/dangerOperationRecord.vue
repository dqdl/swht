<template>
	<div class="safeRecord">
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="query">
				<div class="left">
					<!-- type -->
					<n-space>
						<span>企业</span>
						<n-input v-model:value="queryInfo.company" type="text" :style="{ width: '160px' }"
							placeholder="请输入企业名称" clearable />
					</n-space>
					<!-- time -->
					<n-space>
						<span>作业时间</span>
						<n-config-provider :locale="lg.zhCN" :date-locale="lg.dateZhCN">
							<n-date-picker v-model:value="queryInfo.time" :style="{ width: '240px' }" type="daterange"
								clearable />
						</n-config-provider>
					</n-space>
					<n-space>
						<span>作业名称</span>
						<n-input v-model:value="queryInfo.taskName" placeholder="请输入作业名称" :style="{ width: '160px' }" />
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
		<div class="list">
			<blue-title :prop-value="'数据列表'" />
			<div class="topright">
				<n-space>
					<n-button type="primary" @click="newAdd">新增</n-button>
					<n-button type="info" @click="exportFile">导出</n-button>
				</n-space>
			</div>
			<div class="tableList">
				<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
					<n-data-table ref="table" :remote="true" :bordered="false" :columns="tableHead" :data="tableData"
						:pagination="pagination" :loading="tableLoading" :row-key="(row: any) => row.id"
						@update:page="handlePageChange" @update:checked-row-keys="handleCheck"
						@update:pageSize="handlePageSize" />
				</n-config-provider>
			</div>
		</div>
		<n-modal v-model:show="showModal" :style="{
			width: '800px',
			height: '800px',
			overflow: 'auto',
			backgroundColor: '#ffffff',
			borderRadius: '15px',
		}" :title="form_details.name" :bordered="false" size="huge" class="custom-card" preset="card">
			<n-card :bordered="false">
				<template #header-extra></template>
				<n-form ref="formRef" :model="form_details" :rules="rules">
					<n-grid :cols="25" :x-gap="25">
						<n-form-item-gi :span="24" label="企业名称" path="user.company">
							<n-input v-model:value="form_details.user.company" type="text" placeholder="点击选择企业"
								clearable :disabled="true" @click="choiceCom" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业类型" path="user.a">
							<n-input v-model:value="form_details.user.taskType" type="text" placeholder="作业类型" clearable
								:disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业等级" path="user.a">
							<n-input v-model:value="form_details.user.taskLevel" type="text" placeholder="作业等级"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业名称" path="user.taskName">
							<n-input v-model:value="form_details.user.taskName" type="text" placeholder="作业名称" clearable
								:disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业地点" path="user.a">
							<n-input v-model:value="form_details.user.taskAddress" type="text" placeholder="作业地点"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业概况" path="user.a">
							<n-input v-model:value="form_details.user.taskDisc" type="text" placeholder="作业概况" clearable
								:disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业开始时间" path="user.a">
							<n-config-provider :style="{ width: '100%' }" :locale="zhCN" :date-locale="dateZhCN">
								<n-date-picker v-model:value="form_details.user.startTime"
									:disabled="form_details.name == '详情'" type="date" clearable />
							</n-config-provider>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业结束时间" path="user.a">
							<n-config-provider :style="{ width: '100%' }" :locale="zhCN" :date-locale="dateZhCN">
								<n-date-picker v-model:value="form_details.user.endTime"
									:disabled="form_details.name == '详情'" type="date" clearable />
							</n-config-provider>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="作业人数" path="user.a">
							<n-input v-model:value="form_details.user.taskPeopleNum" type="text" placeholder="作业人数"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="监督人员" path="user.a">
							<n-input v-model:value="form_details.user.supervisePeople" type="text" placeholder="监督人员"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="电话号码" path="user.phone">
							<n-input v-model:value="form_details.user.phone" type="text" placeholder="电话号码" clearable
								:disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="审批人员" path="user.a">
							<n-input v-model:value="form_details.user.approvePeople" type="text" placeholder="审批人员"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="备案时间" path="user.a">
							<n-config-provider :style="{ width: '100%' }" :locale="zhCN" :date-locale="dateZhCN">
								<n-date-picker v-model:value="form_details.user.taskTime"
									:disabled="form_details.name == '详情'" type="date" clearable />
							</n-config-provider>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="第三方负责人" path="user.a">
							<n-input v-model:value="form_details.user.thirdPeople" type="text" placeholder="第三方负责人"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="第三方服务公司" path="user.a">
							<n-input v-model:value="form_details.user.thirdParty" type="text" placeholder="第三方服务公司"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="危险因素" path="user.a">
							<n-input v-model:value="form_details.user.dangerFactor" type="text" placeholder="危险因素"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="易导致事故类型" path="user.a">
							<n-input v-model:value="form_details.user.easyaAccident" type="text" placeholder="易导致事故类型"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="备注" path="user.a">
							<n-input v-model:value="form_details.user.remark" type="textarea" :autosize="{
								minRows: 3,
								maxRows: 5,
							}" placeholder="隐患备注" clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<!-- 作业名单type1 -->
						<n-form-item-gi :span="24" label="作业名单" path="user.state">
							<n-upload ref="upload" :max="10" :multiple="true" :show-file-list="false"
								:disabled="form_details.name == '详情'" :action="postUrl" @finish="handleFinish"
								@before-upload="beforeUpload">
								<n-button @click="fileUpload(1)">上传文件</n-button>
							</n-upload>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="文件" path="user.state">
							<table border="1" class="table">
								<tr class="tHead">
									<td>序号</td>
									<td>文件名称</td>
									<td>文件大小</td>
									<td>操作</td>
								</tr>
								<tr v-if="!fileList.length" class="not">
									<td></td>
									<td colspan="2">暂无文件</td>
									<td></td>
								</tr>
								<tr v-for="(ele, index) in getFileList" v-else :key="index">
									<td>{{ index + 1 }}</td>
									<td>{{ ele.name }}</td>
									<td>{{ ele.sizes }}</td>
									<td>
										<n-button v-if="form_details.name !== '新增'" type="info">
											<a target="_blank" :href="ele.url">下载</a>
										</n-button>
										<n-button v-if="form_details.name !== '详情'" type="error"
											:style="{ marginLeft: '5px' }" @click="delPng(ele.name)">删除</n-button>
									</td>
								</tr>
							</table>
						</n-form-item-gi>
						<!-- 附件type2 -->
						<n-form-item-gi :span="24" label="附件" path="user.state">
							<n-upload ref="upload" :max="10" :multiple="true" :show-file-list="false"
								:disabled="form_details.name == '详情'" :action="postUrl" @finish="handleFinish"
								@before-upload="beforeUpload">
								<n-button @click="fileUpload(2)">上传文件</n-button>
							</n-upload>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="文件" path="user.state">
							<table border="1" class="table">
								<tr class="tHead">
									<td>序号</td>
									<td>文件名称</td>
									<td>文件大小</td>
									<td>操作</td>
								</tr>
								<tr v-if="!fileList.length" class="not">
									<td></td>
									<td colspan="2">暂无文件</td>
									<td></td>
								</tr>
								<tr v-for="(ele, index) in getFileList1" v-else :key="index">
									<td>{{ index + 1 }}</td>
									<td>{{ ele.name }}</td>
									<td>{{ ele.sizes }}</td>
									<td>
										<n-button v-if="form_details.name !== '新增'" type="info">
											<a target="_blank" :href="ele.url">下载</a>
										</n-button>
										<n-button v-if="form_details.name !== '详情'" type="error"
											:style="{ marginLeft: '5px' }" @click="delPng(ele.name)">删除</n-button>
									</td>
								</tr>
							</table>
						</n-form-item-gi>
					</n-grid>
					<n-space>
						<n-button v-if="form_details.name !== '详情'" type="info" @click="sure">确认</n-button>
						<n-button type="info" @click="showModal = false">取消</n-button>
					</n-space>
				</n-form>

			</n-card>
			<!-- <template #footer>
				<n-space>
					<n-button v-if="form_details.name !== '详情'" type="info" @click="sure">确认</n-button>
					<n-button type="info" @click="showModal = false">取消</n-button>
				</n-space>
			</template> -->
		</n-modal>
		<n-modal v-model:show="showModal_delete" preset="dialog" type="error" :show-icon="false" title="删除"
			content="确认删除这条数据吗？" positive-text="确认" negative-text="取消" @positive-click="submitDelete"
			@negative-click="showModal_delete = false"></n-modal>
		<n-modal v-model:show="showMap" preset="card" size="huge" :bordered="false" :segmented="false"
			style="width: 700px; height: 600px" title="定位">
			<template #header-extra></template>
			<mapBox @getPoint="getPoint" @cancelGet="showMap = false"></mapBox>
		</n-modal>
		<n-modal v-model:show="isShowCom" preset="card" size="huge" :bordered="false" :segmented="false"
			style="width: 700px; height: 600px" title="公司列表">
			<template #header-extra></template>
			<mTable @comEmit="getComInfo" />
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';

import { computed, h, ref, reactive, onMounted } from 'vue';

import {
	NIcon,
	zhCN,
	dateZhCN,
	NButton,
	NSpace,
	useMessage,
	darkTheme,
} from 'naive-ui';
import blueTitle from '@/components/public/title/index.vue';
import mapBox from '@components/mapBox/index.vue';
import mTable from '../table/table.vue';
import { LocationSharp } from '@vicons/ionicons5';
import { dateFormat } from '../../../util/verification';
// api
import { Api } from '@/http/api/safetySupervision/dangerOperationRecord';
// 消息组件
const message = useMessage();
const fileData: any = reactive({
	fileName: '',
});
const lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});
// 查询条件
const queryInfo: any = reactive({
	time: null,
	company: '',
	taskName: '',
});
// 企业列表
const companyList: any = reactive([
	{
		label: '企业1',
		value: '企业1',
	},
	{
		label: '企业2',
		value: '企业2',
	},
]);

// 表单详情
const form_details: any = reactive({
	name: '新增',
	user: {
		company: '',
		taskType: '',
		taskLevel: '',
		taskName: '',
		taskAddress: '',
		taskDisc: '',
		startTime: null,
		endTime: null,
		taskPeopleNum: 0, // 作业人数
		supervisePeople: '', // 监督人员
		phone: '',
		approvePeople: '', // 审批人员
		taskTime: null, // 备案时间
		thirdPeople: '', // 第三方负责人
		thirdParty: '', // 第三方服务公司
		dangerFactor: '', // 危险因素
		easyaAccident: '', // 易导致事故类型
		remark: '',
		id: '',
	},
});

// 数据列表
// 表头
const tableHead = reactive([
	{
		title: '序号',
		key: 'num',
		width: 80,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '企业',
		key: 'company',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作业类型',
		key: 'taskType',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作业名称',
		key: 'taskName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作业概括',
		key: 'taskDisc',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},

	{
		title: '作业地点',
		key: 'taskAddress',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作业开始时间',
		key: 'startTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作业结束时间',
		key: 'endTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '作业人数',
		key: 'taskPeople',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '监督人员',
		key: 'supervisePeople',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '第三方服务公司',
		key: 'thirdParty',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		key: 'operation',
		align: 'center',
		width: 240,
		render(row: object, index: number) {
			return h(
				NSpace,
				{
					justify: 'center',
				},
				[
					h(
						NButton,
						{
							size: 'small',
							type: 'info',
							onClick: () => showModalFun(row, '详情'),
						},
						{ default: () => '查看' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'warning',
							onClick: () => showModalFun(row, '编辑'),
						},
						{ default: () => '编辑' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'error',
							onClick: () => deleteRecord(row),
						},
						{ default: () => '删除' }
					),
				]
			);
		},
	},
]);
// 表格数据
let tableData: any = ref([
	{
		num: 1,
		company: '',
		taskType: '',
		taskName: '',
		taskAddress: '',
		taskDisc: '',
		startTime: '',
		endTime: '',
		taskPeople: '',
		supervisePeople: '',
		thirdParty: '',
	},
]);
// 页码数据
const pagination = reactive({
	pageCount: 1,
	page: 1,
	pageSize: 10,
	pageSizes: [5, 10, 20],
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
const rules = {
	user: {
		company: {
			message: '请选择企业名称',
			required: true,
			trigger: ['blur', 'change'],
		},
		taskName: {
			message: '请输入作业名称',
			required: true,
			trigger: ['blur', 'change'],
		},
		phone: {
			required: true,
			// message: '请输入社会信用代码',
			trigger: ['input', 'blur'],
			validator(rule: any, value: any) {
				if (!value) {
					return new Error('请输入手机或者电话号码')
				} else if ((/^1[3456789]\d{9}$/.test(value)) || (/^(([0-9]{11})|([0-9]{3}\-[0-9]{8})|([0-9]{4}\-[0-9]{7}))$/.test(value))) {
					return true
				} else {
					return new Error('请检查输入的手机或者加区号的电话号码')
				}
			},
		}
	}
}
let tableLoading = ref(false);
// 页码切换
const handlePageChange = (currentPage: number) => {
	console.log('currentPage =>', currentPage);
	pagination.page = currentPage;
	getList({ current: currentPage });
};
// 选中列
let index: any = ref([]);
const handleCheck = (row: any) => {
	// 处理
	console.log(row, 'wwewe');
	index.value = row; // 下标
};
// 展示多少
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	// const params = dealQueryData()
	getList();
};

let showModal: any = ref(false);
let showModal_delete: any = ref(false);
let showMap: any = ref(false);
const getPoint = (point: any) => {
	form_details.user.location = point;
	showMap.value = false;
};
// 新增
const newAdd = () => {
	Object.keys(form_details.user).forEach((key) => {
		form_details.user[key] = '';
		if (key == 'startTime' || key == 'endTime' || key == 'taskTime') {
			form_details.user[key] = null;
		}
	});
	fileList.length = 0;
	form_details.name = '新增';
	showModal.value = true;
};

let deleteId = '';
// 删除
const deleteRecord = (row: any) => {
	showModal_delete.value = true;
	deleteId = row.id;
};
// 确认删除
const submitDelete = async () => {
	let data: any = await Api.deleteList(deleteId);
	if (data.code === 200) {
		getList();
		pagination.page = 1;
		message.success(`${data.message}`);
		return;
	}
	message.error(`删除失败`);
};
/***************Api***************/
// 获取表格列表
const getList = async (params: any = { current: 1 }) => {
	// tableLoading.value = true
	const basicData: any = {
		current: 1,
		pageSize: pagination.pageSize,
		enterpriseName: queryInfo.company,
		jobName: queryInfo.taskName,
		startTime: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
		endTime: queryInfo.time ? dateFormat(queryInfo.time[1], 'y-m-d') : '',
	};
	const paramsData = { ...basicData, ...params };
	let data: any = await Api.getList(paramsData);
	tableData.value = [];
	data.code == 200 && ((pagination as any).itemCount = data.data.total);
	data.code == 200 &&
		data.data.records.forEach((element: any, index: number) => {
			tableData.value.push({
				num: index + 1,
				company: element.enterpriseName,
				taskType: element.jobType,
				taskName: element.jobName,
				taskAddress: element.jobAddr,
				taskDisc: element.jobOverview,
				startTime: element.jobStartTime,
				endTime: element.jobEndTime,
				taskPeople: element.jobPeopleNum,
				supervisePeople: element.monitors,
				thirdParty: element.thirdPartyCompany,
				id: element.id,
			});
		});
};
// 查询方法
const query = () => {
	getList();
};
// 重置方法
const reset = () => {
	let list = Object.values(queryInfo);
	let flag = list.some((val: any) => {
		return !!val;
	});
	if (flag) {
		queryInfo.company = '';
		queryInfo.taskName = '';
		queryInfo.time = null;
		getList();
	}
};
// 导出
const exportFile = async () => {
	let data: any = await Api.export(queryInfo);
	if (!data.status) {
		const url = window.URL.createObjectURL(
			new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
		);
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.setAttribute('download', 'excel.xlsx');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
};
// 企业列表弹框
const isShowCom = ref(false);
// 点击选择企业
const choiceCom = () => {
	let type: any = sessionStorage.getItem('type');
	if (type && type == 1) {
		isShowCom.value = true;
	}
};
// 获取企业名称和id
const getComInfo = (row: any) => {
	console.log('获取企业名称和id', row);
	form_details.user.id = row.companyId;
	form_details.user.company = row.ename;
	isShowCom.value = false;
};
// 上传图片地址
const postUrl: any = `${window.urlConfig.fileUrl}/file/upload`;
let fileList: any = reactive([]);
let isTrue = ref(true);
// 上传文件类型1为作业名单2为附件
let fileType = ref(0);
// 上传文件按钮
const fileUpload = (num: number) => {
	fileType.value = num;
};
// 上传图片
const handleFinish = ({ file, event }: any) => {
	message.success('上传成功');
	isTrue.value = true;
	// fileList.push({
	// 	name: file.name,
	// 	url:
	// });
	for (let i = 0; i < fileList.length; i++) {
		if (fileList[i].name === file.name) {
			fileList[i].url = JSON.parse(event.target.response).data.url;
			break;
		}
	}
};
// 上传文件判断
const beforeUpload = ({ file }: any) => {
	let flag = fileList.some((val: any) => {
		return val.name == file.name;
	});
	if (flag) {
		message.error('已上传同名文件，请重新选择文件或者修改文件名！');
		return false;
	}
	fileList.push({
		type: fileType.value,
		sizes: getFileSize(file.file.size),
		name: file.name,
		url: '',
	});
	return true;
};
// 计算文件大小
const getFileSize = (size: any) => {
	let si: any = `${(size / 1024).toFixed(2)}`;
	let s = `${si}kb`;
	if (si.length >= 4 && si >= 1024) {
		s = `${(si / 1024).toFixed(2)}mb`;
	}
	return s;
};
// 删除图片
const delPng = (name: any) => {
	for (let i = 0; i < fileList.length; i++) {
		if (fileList[i].name === name) {
			fileList.splice(i, 1);
			break;
		}
	}
};
// 获取的ID
let showId: any = '';
// 详情和修改
const showModalFun = async (row: any, val?: string) => {
	form_details.name = val;
	try {
		showId = row.id;
		fileList.length = 0;
		let data: any = await Api.selectById(row.id);
		data = data.data;
		form_details.user.easyaAccident = data.accidentType;
		form_details.user.approvePeople = data.approvalPerson;
		form_details.user.id = data.enterpriseId;
		form_details.user.company = data.enterpriseName;
		form_details.user.taskTime = getTime(data.filTime);
		form_details.user.taskAddress = data.jobAddr;
		form_details.user.endTime = getTime(data.jobEndTime);
		form_details.user.taskLevel = data.jobLevel;
		form_details.user.taskName = data.jobName;
		form_details.user.taskDisc = data.jobOverview;
		form_details.user.taskPeopleNum = data.jobPeopleNum;
		form_details.user.startTime = getTime(data.jobStartTime);
		form_details.user.taskType = data.jobType;
		form_details.user.supervisePeople = data.monitors;
		form_details.user.phone = data.phone;
		form_details.user.remark = data.remarks;
		form_details.user.dangerFactor = data.riskFactor;
		form_details.user.thirdParty = data.thirdPartyCompany;
		form_details.user.thirdPeople = data.thirdPartyHead;
		data.fileUrl &&
			data.fileUrl.forEach((element: any) => {
				fileList.push(element);
			});
		console.log(11111, data);
	} finally {
		showModal.value = true;
	}
};
// 时间转化为时间戳
const getTime = (time: any) => {
	if (time) {
		let date: any = new Date(time.toString());
		let time1 = date.getTime();
		return time1;
	}
	return null;
};
// 过滤
const getFileList = computed(() => {
	let list = fileList.filter((item: any) => {
		return item.type == 1;
	});
	return list;
});
//过滤
const getFileList1 = computed(() => {
	let list = fileList.filter((item: any) => {
		return item.type == 2;
	});
	return list;
});
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增提交
const sure = (e: any) => {
	e.preventDefault()
	const dragDivDom: any = formRef.value;
	dragDivDom.validate(async (errors: any) => {
		if (!errors) {
			let param = {
				accidentType: form_details.user.easyaAccident,
				approvalPerson: form_details.user.approvePeople,
				attachment: '',
				deleted: 0,
				fileUrl: fileList,
				enterpriseId: form_details.user.id,
				enterpriseName: form_details.user.company,
				filTime: dateFormat(form_details.user.taskTime, 'y-m-d'),
				jobAddr: form_details.user.taskAddress,
				jobEndTime: dateFormat(form_details.user.endTime, 'y-m-d'),
				jobLevel: form_details.user.taskLevel,
				jobName: form_details.user.taskName,
				jobOverview: form_details.user.taskDisc,
				jobPeopleNum: form_details.user.taskPeopleNum,
				jobStartTime: dateFormat(form_details.user.startTime, 'y-m-d'),
				jobType: form_details.user.taskType,
				listHomework: '',
				monitors: form_details.user.supervisePeople,
				phone: form_details.user.phone,
				remarks: form_details.user.remark,
				riskFactor: form_details.user.dangerFactor,
				thirdPartyCompany: form_details.user.thirdParty,
				thirdPartyHead: form_details.user.thirdPeople,
			};
			let data: any = '';
			if (form_details.name == '新增') {
				data = await Api.addList(param);
			} else {
				data = await Api.updateList({ ...param, id: showId });
			}
			if (data.code == 200) {
				showModal.value = false;
				getList();
				message.success(`${data.message}`);
			} else {
				message.error(`${data.message}`);
			}
		} else {
			console.log(errors)
			message.error('请检查输入内容')
		}
	})

};
onMounted(() => {
	getList();
});
</script>

<style lang="postcss" scoped>
.top {
	height: 203px;
	border-radius: 10px;
	background-color: #fff;

	.query {
		height: calc(100% - 53px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		/* align-items: center; */
		padding: 30px 20px;

		.left {
			display: flex;

			>div {
				display: flex;
				align-items: center;
				margin-right: 40px;
			}
		}

		.right {
			margin-left: 45px;
		}
	}
}

.list {
	position: relative;
	margin-top: 20px;
	background: #fff;
	border-radius: 10px;

	.tableList {
		padding: 14px 20px;
	}

	.topright {
		position: absolute;
		top: 10px;
		right: 20px;
	}
}

:deep(img) {
	width: 60px;
	height: 60px;
}

.table {
	width: 100%;

	tr {
		height: 50px;
		text-align: center;
		border: 1px solid rgb(241, 241, 241);
		transition: all 0.1s;

		td:nth-child(1) {
			width: 80px;
		}

		td:nth-child(2) {
			width: 180px;
		}
	}

	tr+tr:hover {
		background: rgba(241, 241, 241, 0.664);
	}

	.tHead {
		background: rgba(241, 241, 241, 0.664);
	}

	td {
		img {
			width: 50px;
			height: 50px;
			margin: 0 5px;
		}
	}
}
</style>
