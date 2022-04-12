<template>
	<div class="hidenDanger">
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="query">
				<div class="left">
					<!-- type -->
					<n-space>
						<span>企业名称</span>
						<n-input
							v-model:value="queryInfo.enterpriseName"
							type="text"
							:style="{ width: '160px' }"
							placeholder="请输入企业名称"
							clearable
						/>
					</n-space>
					<n-space>
						<span>计划名称</span>
						<n-input
							v-model:value="queryInfo.planName"
							type="text"
							:style="{ width: '160px' }"
							placeholder="请输入企业名称"
							clearable
						/>
					</n-space>
					<!-- time -->
					<n-space>
						<span>创建时间</span>
						<n-config-provider :locale="lg.zhCN" :date-locale="lg.dateZhCN">
							<n-date-picker
								v-model:value="queryInfo.time"
								:style="{ width: '240px' }"
								type="date"
								clearable
							/>
						</n-config-provider>
					</n-space>
					<n-space>
						<span>巡检状态</span>
						<n-select
							v-model:value="queryInfo.status"
							:options="hiddenFrom"
							placeholder="请选择"
							:style="{ width: '160px' }"
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
		<div class="list">
			<blue-title :prop-value="'数据列表'" />
			<div class="tableList">
				<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
					<n-data-table
						ref="table"
						:remote="true"
						:bordered="false"
						:columns="tableHead"
						:data="tableData"
						:pagination="pagination"
						:loading="tableLoading"
						:row-key="(row: any) => row.id"
						@update:page="handlePageChange"
						@update:pageSize="handlePageSize"
					/>
				</n-config-provider>
			</div>
		</div>
		<!-- 任务详情 -->
		<n-modal
			v-model:show="showModal"
			:style="{
				width: '1400px',
				height: '800px',
				overflow: 'auto',
				backgroundColor: '#ffffff',
				borderRadius: '15px',
			}"
			title="计划详情"
			:bordered="false"
			:segmented="false"
			size="huge"
			class="custom-card"
			preset="card"
		>
			<n-card :bordered="false">
				<template #header-extra></template>
				<n-grid :cols="24" :x-gap="24">
					<n-form-item-gi
						:span="24"
						label="巡检企业名称"
						path="user.facilityName"
					>
						<n-input
							v-model:value="form_details.user.enterpriseName"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="计划名称" path="user.facilityName">
						<n-input
							v-model:value="form_details.user.planName"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="计划编号" path="user.facilityName">
						<n-input
							v-model:value="form_details.user.planNumber"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi
						:span="12"
						label="关联政企互动发文"
						path="user.facilityName"
					>
						<n-input
							v-model:value="form_details.user.sendName"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="任务项" path="user.facilityName">
						<n-data-table
							ref="table"
							:remote="true"
							:bordered="false"
							:max-height="500"
							:virtual-scroll="true"
							:columns="tableHead1"
							:data="tableData1"
							:loading="tableLoading"
							:row-key="(row: any) => row.id"
						/>
					</n-form-item-gi>
				</n-grid>
				<template #footer>
					<n-space>
						<n-button type="info" @click="showModal = false">确定</n-button>
					</n-space>
				</template>
			</n-card>
		</n-modal>
		<!-- 计划详情 -->
		<n-modal
			v-model:show="showModal1"
			:style="{
				width: '900px',
				height: '900px',
				overflow: 'auto',
				backgroundColor: '#ffffff',
				borderRadius: '15px',
			}"
			title="任务详情"
			:bordered="false"
			:segmented="false"
			size="huge"
			class="custom-card"
			preset="card"
		>
			<n-card :bordered="false">
				<template #header-extra></template>
				<n-grid :cols="24" :x-gap="24">
					<n-form-item-gi :span="24" label="任务编号" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.taskSerial"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="任务名称" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.taskName"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="巡检点位" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.checkPoint"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi
						:span="12"
						label="期限完成时间"
						path="user.facilityName"
					>
						<n-input
							v-model:value="form_details1.user.completeTime"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="检查内容" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.checkContent"
							type="textarea"
							:autosize="{
								minRows: 3,
								maxRows: 5,
							}"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="巡检人员" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.checkMan"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="任务状态" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.status"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="受理时间" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.dealTime"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="执行人" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.carryMan"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="执行时间" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.carryTime"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="执行坐标" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.carryPoint"
							type="text"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="执行结果" path="user.facilityName">
						<n-input
							v-model:value="form_details1.user.carryResult"
							type="textarea"
							:autosize="{
								minRows: 3,
								maxRows: 5,
							}"
							placeholder="请输入巡检企业名称"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="执行附件" path="user.facilityName">
						<table border="1" class="table">
							<tr class="tHead">
								<td>序号</td>
								<td>文件名称</td>
								<td>文件大小</td>
								<td>操作</td>
							</tr>
							<tr v-if="!getFileList.length" class="not">
								<td></td>
								<td colspan="2">暂无文件</td>
								<td></td>
							</tr>
							<tr v-for="(ele, index) in getFileList" v-else :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ ele.fileName }}</td>
								<td>{{ ele.fileName }}</td>
								<td>
									<n-button type="info">预览</n-button>
									<n-button>下载</n-button>
								</td>
							</tr>
						</table>
					</n-form-item-gi>
				</n-grid>
				<template #footer>
					<n-space>
						<n-button type="info" @click="showModal1 = false">确定</n-button>
					</n-space>
				</template>
			</n-card>
		</n-modal>
		<n-modal
			v-model:show="showModal_delete"
			preset="dialog"
			type="error"
			:show-icon="false"
			:style="{
				width: '600px',
				backgroundColor: '#ffffff',
			}"
			title="取消"
			content="该计划正处于已派发状态，取消计划后不再执行，是否确认取消?"
			positive-text="确认"
			negative-text="取消"
			@positive-click="submitDelete"
			@negative-click="showModal_delete = false"
		></n-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, h, ref, reactive, onMounted } from 'vue';

import { NIcon, zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import blueTitle from '@/components/public/title/index.vue';
import { dateFormat } from '../../../util/verification';
// api
import { Api1 } from '@/http/api/safetyInspection/enterprisePatrolPlan';
// 消息组件
const message = useMessage();

let lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});
// 查询条件
const queryInfo: any = reactive({
	time: null,
	enterpriseName: '',
	planName: '',
	status: '',
});
// 隐患来源
const hiddenFrom: any = reactive([
	{
		label: '已发布',
		value: '0',
	},
	{
		label: '执行中',
		value: '1',
	},
	{
		label: '已完成',
		value: '2',
	},
	{
		label: '已取消',
		value: '3',
	},
]);

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
		title: '巡检企业名',
		key: 'enterpriseName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '计划编号',
		key: 'planNumber',
		align: 'center',

		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '计划名称',
		key: 'planName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '创建时间',
		key: 'createTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '创建人',
		key: 'createMan',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '任务数',
		key: 'taskNumber',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '完成率',
		key: 'taskLv',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '计划状态',
		key: 'status',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	// {
	// 	title: '巡检结果',
	// 	key: 'completeTime',
	// 	align: 'center',
	// 	ellipsis: {
	// 		tooltip: true,
	// 	},
	// },
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
						{ default: () => '详情' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'info',
							onClick: () => cancel(row),
						},
						{ default: () => '取消' }
					),
				]
			);
		},
	},
]);
const tableHead1 = reactive([
	{
		title: '任务编号',
		key: 'taskSerial',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '任务名称',
		key: 'taskName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '巡检点位',
		key: 'checkPoint',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '巡检时间',
		key: 'createTime',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '期限完成时间',
		key: 'completeTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '巡检人员',
		key: 'checkMan',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '巡检内容',
		key: 'checkContent',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '执行结果',
		key: 'carryResult',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '执行结果',
		key: 'carryResult',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '附件',
		key: 'fileUrl',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		key: 'operation',
		align: 'center',
		width: 120,
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
							onClick: () => showModalFun1(row, '详情'),
						},
						{ default: () => '详情' }
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
		enterpriseName: '',
		planNumber: '',
		planName: '',
		createTime: '',
		createMan: '',
		taskNumber: '',
		taskLv: '',
		status: '',
		// completeTime: '',
	},
]);
let tableData1: any = ref([]);
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
let tableLoading = ref(false);
// 页码切换
const handlePageChange = (currentPage: number) => {
	console.log('currentPage =>', currentPage);
	pagination.page = currentPage;
	getList({ current: currentPage });
};
// 展示多少
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	// const params = dealQueryData()
	getList();
};
// 任务详情
let showModal: any = ref(false);
// 计划详情
let showModal1: any = ref(false);
/***************Api***************/

// 获取的ID
let showId: any = '';
// 表单详情1
const form_details: any = reactive({
	name: '新增',
	user: {
		enterpriseName: '',
		planName: '',
		planNumber: '',
		sendName: '',
		id: '',
	},
});
// 详情
const showModalFun = async (row: any, val?: string) => {
	form_details.name = val;
	tableData1.value = [];
	try {
		showId = row.planNumber;
		let data: any = await Api1.selectById({ planNumber: row.planNumber });
		data = data.data;
		form_details.user.enterpriseName = row.enterpriseName;
		form_details.user.planName = row.planName;
		form_details.user.planNumber = row.planNumber;
		form_details.user.sendName = row.sendName;
		form_details.user.id = row.id;
		tableData1.value = data;
	} finally {
		showModal.value = true;
	}
};
// 表单详情2
const form_details1: any = reactive({
	user: {
		taskSerial: '',
		taskName: '',
		checkPoint: '',
		completeTime: '',
		checkContent: '',
		checkMan: '',
		status: '',
		dealTime: '',
		carryMan: '',
		carryTime: '',
		carryPoint: '',
		carryResult: '',
	},
});
// 执行附件
let getFileList: any = reactive([]);
// 计划详情
const showModalFun1 = async (row: any, val?: string) => {
	getFileList.length = 0;
	try {
		let data: any = await Api1.selectTaskOne({ taskSeria: row.taskSerial });
		data = data.data;
		console.log(21332323, data[0].taskSerial);
		form_details1.user.taskSerial = data[0].taskSerial;
		form_details1.user.taskName = data[0].taskName;
		form_details1.user.checkPoint = data[0].checkPoint;
		form_details1.user.completeTime = data[0].completeTime;
		form_details1.user.checkContent = data[0].checkContent;
		form_details1.user.checkMan = data[0].checkMan;
		form_details1.user.status = data[0].status;
		form_details1.user.dealTime = data[0].dealTime;
		form_details1.user.carryMan = data[0].carryMan;
		form_details1.user.carryTime = data[0].carryTime;
		form_details1.user.carryPoint = data[0].carryPoint;
		form_details1.user.carryResult = data[0].carryResult;
		data[0].fileUrl &&
			data[0].fileUrl.forEach((element: any) => {
				getFileList.push(element);
			});
	} finally {
		showModal1.value = true;
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
// 计划状态处理
const planHandle = (val: any) => {
	switch (val) {
		case '0':
			return '已发布';
		case '1':
			return '执行中';
		case '2':
			return '已完成';
		case '3':
			return '已取消';
		default:
			break;
	}
};
// 任务状态处理
const taskHandle = (val: any) => {
	switch (val) {
		case 0:
			return '待处理';
		case 1:
			return '已超时';
		case 2:
			return '已执行';
		case 3:
			return '已受理';
		default:
			break;
	}
};
// 取消
let showModal_delete = ref(false);
// 取消对象id
let deleteId = ref();
const cancel = (row: any) => {
	deleteId.value = row.planNumber;
	showModal_delete.value = true;
};
const submitDelete = () => {
	Api1.cancel({ planNumber: deleteId.value, planStatus: '3' }).then(() => {
		getList();
	});
};
// 初始化
const init = () => {};
// 获取表格列表
const getList = async (params: any = { current: 1 }) => {
	const basicData: any = {
		current: 1,
		size: pagination.pageSize,
	};
	const paramsData = { ...basicData, ...params };
	let data: any = await Api1.getList(paramsData);
	tableData.value = [];
	data.code == 200 && ((pagination as any).itemCount = data.data.total);
	data.code == 200 &&
		data.data.records.forEach((element: any, index: number) => {
			tableData.value.push({
				num: index + 1,
				enterpriseName: element.enterpriseName,
				planNumber: element.planNumber,
				planName: element.planName,
				createTime: element.createTime,
				createMan: element.createMan,
				taskNumber: element.taskNumber,
				taskLv: element.taskLv,
				status: planHandle(element.planStatus),
				// completeTime: element.rectificationTime,
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
		queryInfo.industry = '';
		queryInfo.hiddenFrom = '';
		queryInfo.hiddenName = '';
		queryInfo.time = null;
		getList();
	}
};

onMounted(() => {
	init();
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
			> div {
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
	tr + tr:hover {
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
