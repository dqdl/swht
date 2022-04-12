<template>
	<div class="documentManagement">
		<aside class="aside">
			<div
				:class="{ everItem: true, active: item.name === activeName }"
				v-for="(item, index) of sideTitles"
				:key="item.id"
				@click="goPage(item.name, item.id)"
			>
				{{ item.name }}
			</div>
		</aside>
		<main class="main">
			<div class="hidenDanger">
				<div class="top">
					<blue-title :prop-value="'查询'" />
					<div class="query">
						<div class="left">
							<!-- type -->
							<n-space>
								<span>任务名称</span>
								<n-input
									v-model:value="queryInfo.taskName"
									type="text"
									:style="{ width: '160px' }"
									placeholder="请输入任务名称"
									clearable
								/>
							</n-space>
							<n-space>
								<span>计划名称</span>
								<n-input
									v-model:value="queryInfo.planName"
									type="text"
									:style="{ width: '160px' }"
									placeholder="请输入计划名称"
									clearable
								/>
							</n-space>
							<n-space>
								<span>计划编号</span>
								<n-config-provider :locale="lg.zhCN" :date-locale="lg.dateZhCN">
									<n-input
										v-model:value="queryInfo.planNumber"
										:style="{ width: '160px' }"
										type="text"
										placeholder="请输入计划编号"
										clearable
									/>
								</n-config-provider>
							</n-space>
							<!-- time -->
							<n-space>
								<span>任务编号</span>
								<n-config-provider :locale="lg.zhCN" :date-locale="lg.dateZhCN">
									<n-input
										v-model:value="queryInfo.taskSerial"
										:style="{ width: '160px' }"
										type="text"
										placeholder="请输入任务编号"
										clearable
									/>
								</n-config-provider>
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
				<!-- 计划详情 -->
				<n-modal
					v-model:show="showModal"
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
							<n-form-item-gi
								:span="24"
								label="任务编号"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.taskSerial"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								:span="24"
								label="任务名称"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.taskName"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								:span="12"
								label="巡检点位"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.checkPoint"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								:span="12"
								label="期限完成时间"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.completeTime"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								:span="24"
								label="检查内容"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.checkContent"
									type="textarea"
									:autosize="{
										minRows: 3,
										maxRows: 5,
									}"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="12"
								label="巡检人员"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.checkMan"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="12"
								label="任务状态"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.status"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="12"
								label="受理时间"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.dealTime"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="12"
								label="执行人"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.carryMan"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="12"
								label="执行时间"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.carryTime"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="12"
								label="执行坐标"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.carryPoint"
									type="text"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="24"
								label="执行结果"
								path="user.facilityName"
							>
								<n-input
									v-model:value="form_details.user.carryResult"
									type="textarea"
									:autosize="{
										minRows: 3,
										maxRows: 5,
									}"
									placeholder="请输入巡检企业名称"
									clearable
								/>
							</n-form-item-gi>
							<n-form-item-gi
								v-if="queryInfo.status == 2 || isPerform"
								:span="24"
								label="执行附件"
								path="user.facilityName"
							>
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
									<tr v-for="(ele, index) in fileList" v-else :key="index">
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
								<n-button
									v-if="queryInfo.status == 0"
									type="info"
									@click="showModal_delete = true"
									>确定受理</n-button
								>
								<n-button
									v-if="queryInfo.status == 1 && !isPerform"
									type="info"
									@click="performTasks"
									>填报任务</n-button
								>
								<n-button v-if="isPerform" type="info" @click="executeTask"
									>完成巡检填报</n-button
								>
								<n-button type="info" @click="showModal = false">关闭</n-button>
							</n-space>
						</template>
					</n-card>
				</n-modal>
				<!-- 确认受理 -->
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
					:content="content"
					positive-text="确认"
					negative-text="取消"
					@positive-click="submitDelete"
					@negative-click="showModal_delete = false"
				></n-modal>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import { computed, h, ref, reactive, onMounted } from 'vue';

import { NIcon, zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import blueTitle from '@/components/public/title/index.vue';
import { FastFood, LocationSharp } from '@vicons/ionicons5';
import { dateFormat } from '../../../util/verification';
// api
import { Api1 } from '@/http/api/safetyInspection/inspectionTask';
// 消息组件
const message = useMessage();

let lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});
// 查询条件
const queryInfo: any = reactive({
	taskName: null,
	status: '0',
	planName: '',
	planNumber: '',
	taskSerial: '',
});

// 表单详情
const form_details: any = reactive({
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
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '计划名称',
		key: 'planName',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '巡检点位',
		key: 'checkPoint',
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
		title: '创建时间',
		key: 'createTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '限期完成时间',
		key: 'completeTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '任务状态',
		key: 'status',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '超时状态',
		key: 'lateStatus',
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
			let hbtn: any = null;
			if (queryInfo.status == 0) {
				hbtn = h(
					NButton,
					{
						size: 'small',
						type: 'info',
						onClick: () => sureSl(row),
					},
					{ default: () => '确认受理' }
				);
			} else if (queryInfo.status == 1) {
				hbtn = h(
					NButton,
					{
						size: 'small',
						type: 'info',
						onClick: () => performTasks(row),
					},
					{ default: () => '执行任务' }
				);
			}
			return h(
				NSpace,
				{
					justify: 'center',
				},
				[
					hbtn,
					h(
						NButton,
						{
							size: 'small',
							type: 'info',
							onClick: () => showModalFun(row, '详情'),
						},
						{ default: () => '查看' }
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
		taskSerial: '',
		taskName: '',
		planName: '',
		checkPoint: '',
		checkContent: '',
		createTime: '',
		completeTime: '',
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

let showModal: any = ref(false);
let showMap: any = ref(false);
const getPoint = (point: any) => {
	form_details.user.location = point;
	showMap.value = false;
};

/***************Api***************/

// 获取的ID
let showId: any = '';
// 详情和修改
const showModalFun = async (row: any, val?: string) => {
	form_details.name = val;
	form_details.user = row;
	isPerform.value = false;
	try {
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
const isPerform = ref(false);
// 执行任务
const performTasks = (data: any) => {
	form_details.user = data;
	rowId.value = data.taskSerial;
	showModal.value = true;
	isPerform.value = true;
};
// 完成巡检填报
const executeTask = () => {
	let data = form_details.user;
	data.taskSerial = rowId.value;
	Api1.executeTask(data).then(() => {
		getList();
		showModal.value = false;
	});
};
// 确认受理
let showModal_delete = ref(false);
let content = ref('该任务期限完成时间为S%，是否确认受理');
// 选中行id
let rowId = ref();
// 打开弹框
const sureSl = (row: any) => {
	console.log(1111, row);
	rowId.value = row.taskSerial;
	showModal_delete.value = true;
};
// 确认
const submitDelete = () => {
	Api1.sureAccept({ taskSerial: rowId.value }).then(() => {
		getList();
		showModal_delete.value = false;
	});
};
// const
// 初始化
const init = () => {};
// 任务状态处理
const taskHandle = (val: any) => {
	switch (val) {
		case '0':
			return '待处理';
		case '1':
			return '已受理';
		case '2':
			return '已执行';
		case '3':
			return '已超时';
		default:
			break;
	}
};
// 获取表格列表
const getList = async (params: any = { current: 1 }) => {
	const basicData: any = {
		current: 1,
		pageSize: pagination.pageSize,
		status: queryInfo.status,
	};
	const paramsData = { ...basicData, ...params };
	let data: any = await Api1.getList(paramsData);
	tableData.value = [];
	data.code == 200 && ((pagination as any).itemCount = data.data.total);
	data.code == 200 &&
		data.data.records.forEach((element: any, index: number) => {
			tableData.value.push({
				num: index + 1,
				taskSerial: element.taskSerial,
				taskName: element.taskName,
				planName: element.planName,
				checkPoint: element.checkPoint,
				checkContent: element.checkContent,
				createTime: element.createTime,
				completeTime: element.completeTime,
				id: element.id,
				lateStatus: element.lateStatus == '1' ? '超时' : '正常',
				status: taskHandle(element.status),
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

let fileList: any = reactive([]);
onMounted(() => {
	init();
	getList();
});
let activeName = ref('待办列表');
const sideTitles = reactive([
	{
		name: '待办列表',
		id: '0',
	},
	{
		name: '已确认',
		id: '1',
	},
	{
		name: '已完成',
		id: '2',
	},
]);
const goPage = (val: any, id: any) => {
	activeName.value = val;
	queryInfo.status = id;
	pagination.page = 1;
	getList();
};
</script>

<style lang="postcss" scoped>
.documentManagement {
	width: 100%;
	height: 100%;
	display: flex;
	.aside {
		width: 120px;
		font-weight: bold;
		height: 100%;
		background-color: white;
		border-radius: 10px;
		padding-top: 20px;
		margin-right: 20px;
		.everItem {
			cursor: pointer;
			font-size: 16px;
			color: black;
		}
	}
	.main {
		flex: 1;
	}
	.everItem {
		text-align: center;
		line-height: 50px;
		font-size: 18px;
	}
	.active {
		background-color: rgb(151, 151, 232);
	}

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
