<template>
	<div class="hidenDanger">
		<div class="top">
			<blue-title :prop-value="'新增计划'" />
			<div class="query">
				<div class="left">
					<!-- type -->
					<div style="width: 100%">
						<n-space>
							<span>巡检企业名称</span>
							<n-input
								v-model:value="queryInfo.enterpriseName"
								type="text"
								:disabled="true"
								:style="{ width: '800px' }"
								placeholder="请输入巡检企业名称"
								clearable
							/>
						</n-space>
					</div>
					<div>
						<n-space>
							<span>计划名称</span>
							<n-input
								v-model:value="queryInfo.planName"
								type="text"
								:style="{ width: '300px' }"
								placeholder="请输入计划名称"
								clearable
							/>
						</n-space>
						<n-space>
							<span>计划编号</span>
							<n-input
								v-model:value="queryInfo.planNumber"
								type="text"
								:disabled="true"
								:style="{ width: '300px' }"
								placeholder="请输入计划编号"
								clearable
							/>
						</n-space>
					</div>
					<!-- time -->
					<div>
						<n-space>
							<span>关联政企互动发文</span>
							<n-select
								v-model:value="queryInfo.sendName"
								:options="industryList"
								placeholder="请选择关联政企互动发文"
								:style="{ width: '300px' }"
								@update:value="getSendId"
							/>
						</n-space>
					</div>
					<!-- <div>
						<n-space>
							<span>三级联动</span>
							<address-ssq />
						</n-space>
					</div>-->
				</div>
			</div>
		</div>
		<div class="list">
			<blue-title :prop-value="'计划任务项'" />
			<div class="topright">
				<n-space>
					<n-button type="primary" @click="newAdd">新增任务</n-button>
					<!-- <n-button type="info" @click="exportFile">导出</n-button> -->
				</n-space>
			</div>
			<div class="tableList">
				<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
					<n-data-table
						ref="table"
						:remote="true"
						:bordered="false"
						:max-height="500"
						:virtual-scroll="true"
						:columns="tableHead"
						:data="tableData"
						:loading="tableLoading"
						:row-key="(row: any) => row.id"
					/>
				</n-config-provider>
			</div>
		</div>
		<div class="fawenbtn">
			<n-space>
				<n-button @click="Release" type="info">立即发布</n-button>
				<n-button @click="cancelRelease" type="info">取消发布</n-button>
			</n-space>
		</div>
		<n-modal
			v-model:show="showModal"
			:style="{
				width: '800px',
				height: '800px',
				overflow: 'auto',
				backgroundColor: '#ffffff',
				borderRadius: '15px',
			}"
			:title="form_details.name"
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
							v-model:value="form_details.user.taskSerial"
							type="text"
							placeholder="请输入任务编号"
							:disabled="true"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="任务名称" path="user.facilityName">
						<n-input
							v-model:value="form_details.user.taskName"
							type="text"
							placeholder="请输入任务名称"
							:disabled="form_details.name == '详情'"
							clearable
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="12" label="巡查点位" path="user.facilityName">
						<!-- <n-input
							v-model:value="form_details.user.checkPoint"
							type="text"
							placeholder="请输入任务名称"
							clearable
						/>-->
						<n-select
							v-model:value="form_details.user.checkPoint"
							:options="repositoryList"
							placeholder="请选巡查点位"
							:disabled="form_details.name == '详情'"
						/>
					</n-form-item-gi>
					<n-form-item-gi
						:span="12"
						label="期限完成时间"
						path="user.facilityName"
					>
						<n-config-provider
							:style="{ width: '100%' }"
							:locale="zhCN"
							:date-locale="dateZhCN"
						>
							<n-date-picker
								v-model:value="form_details.user.completeTime"
								:disabled="form_details.name == '详情'"
								type="date"
								clearable
							/>
						</n-config-provider>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="检查内容" path="user.facilityName">
						<n-input
							v-model:value="form_details.user.checkContent"
							type="textarea"
							:autosize="{
								minRows: 3,
								maxRows: 5,
							}"
							placeholder="请输入检查内容"
							clearable
							:disabled="form_details.name == '详情'"
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="24" label="巡检人员" path="user.facilityName">
						<!-- <n-input
							v-model:value="form_details.user.company"
							type="text"
							placeholder="点击选择企业组织架构"
							clearable
						/>-->
						<n-select
							v-model:value="form_details.user.userId"
							multiple
							:options="userList"
							:disabled="form_details.name == '详情'"
							placeholder="选择巡检人员"
							:style="{ width: '300px' }"
						/>
					</n-form-item-gi>
				</n-grid>
				<template #footer>
					<n-space>
						<n-button
							v-if="form_details.name !== '详情'"
							type="info"
							@click="sure"
							>保存</n-button
						>
						<n-button type="info" @click="showModal = false">取消</n-button>
					</n-space>
				</template>
			</n-card>
		</n-modal>
		<n-modal
			v-model:show="showModal_delete"
			preset="dialog"
			type="error"
			:show-icon="false"
			title="删除"
			content="确认删除这条数据吗？"
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
import { dateFormat } from '../../../util/verification';
// import addressSsq from "@components/address/address.vue"
// api=
import { Api1 } from '../../../http/api/safetyInspection/parkPatrolPlan';

// 消息组件
const message = useMessage();

// let lg = reactive({
// 	zhCN: zhCN,
// 	dateZhCN: dateZhCN,
// });
// 条件
const queryInfo: any = reactive({
	enterpriseName: '公司测试test',
	planName: '',
	planNumber: '',
	sendName: '',
});

// 列表
const industryList: any = reactive([
	{
		label: '是',
		value: '是',
	},
	{
		label: '否',
		value: '否',
	},
]);
const repositoryList: any = ref([
	{
		label: '',
		value: '',
	},
]);
const userList: any = reactive([
	{
		label: '',
		value: '',
	},
]);
// 表单详情
const form_details: any = reactive({
	name: '新增',
	user: {
		taskSerial: '', //任务编号
		taskName: '', //任务名称
		checkPoint: '', //巡查点位
		completeTime: null, //完成时间
		checkContent: '', //检查内容
		checkMan: '', //巡检人员
		userId: [],
	},
});
// 数据列表
// 表头
const tableHead = reactive([
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
					// h(
					// 	NButton,
					// 	{
					// 		size: 'small',
					// 		type: 'warning',
					// 		onClick: () => showModalFun(row, '编辑'),
					// 	},
					// 	{ default: () => '编辑' }
					// ),
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
		taskSerial: 1,
		taskName: '',
		checkPoint: '',
		createTime: '',
		completeTime: '',
		checkMan: '',
		checkContent: '',
	},
]);

let tableLoading = ref(false);
let showModal: any = ref(false);
let showModal_delete: any = ref(false);
let showMap: any = ref(false);
const getPoint = (point: any) => {
	form_details.user.location = point;
	showMap.value = false;
};

/***************Api***************/
// 新增
const newAdd = () => {
	Object.keys(form_details.user).forEach((key) => {
		form_details.user[key] = '';
		if (key == 'completeTime') {
			form_details.user[key] = null;
		}
	});
	numberProduct2();
	form_details.name = '新增';
	showModal.value = true;
};
// 获取的ID
let showId: any = '';
// 详情和修改
const showModalFun = async (row: any, val?: string) => {
	form_details.name = val;
	try {
		form_details.user = JSON.parse(JSON.stringify(row));
		form_details.user.completeTime = getTime(form_details.user.completeTime);
		console.log(1111, form_details.user);
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
let deleteId = '';
// 删除
const deleteRecord = (row: any) => {
	showModal_delete.value = true;
	deleteId = row.taskSerial;
};
// 确认删除
const submitDelete = async () => {
	for (let i = 0; i < tableData.value.length; i++) {
		if (tableData.value[i].taskSerial == deleteId) {
			tableData.value.splice(i, 1);
			break;
		}
	}
	// let data: any = await Api.deleteList(deleteId);
	// if (data.code === 200) {
	// 	message.success(`${data.message}`);
	// 	return;
	// }
	// message.error(`删除失败`);
};

// 初始化
const init = () => {
	tableData.value = [];
	// let type = sessionStorage.getItem('type');
	// let name = sessionStorage.getItem('name');
	// type && type == '1' && (form_details.user.hiddenFrom = '园区巡检');
	// type && type == '2' && (form_details.user.hiddenFrom = '企业自查');
	// name && (form_details.user.checkPeople = name);
};

// 获取
const selectByTypeCode = async () => {
	let { data }: any = await Api1.selectByTypeCode();
	industryList.length = 0;
	data &&
		data.forEach((element: any) => {
			industryList.push({
				label: element.title,
				value: element.title,
				enterpriseId: element.enterpriseId,
				sendId: element.sendId,
				userId: element.userId,
			});
		});

	Api1.getHouseRepository().then((res: any) => {
		let list: any = [];
		if (res.code == 200) {
			res.data.forEach((element: any) => {
				list.push({
					label: element.label,
					value: element.label,
					code: element.code,
				});
			});
			repositoryList.value = list;
		}
	});
	Api1.getUser().then((res: any) => {
		userList.length = 0;
		if (res.code == 200) {
			res.data.forEach((element: any) => {
				userList.push({
					label: element.name,
					value: element.code,
					id: element.code,
				});
			});
		}
	});
	numberProduct1();
};
// 获取随机计划编号
const numberProduct1 = () => {
	Api1.numberProduct().then((res: any) => {
		queryInfo.planNumber = res.data.scjh;
	});
};
// 获取随机任务编号
const numberProduct2 = () => {
	Api1.numberProduct().then((res: any) => {
		form_details.user.taskSerial = res.data.scrw;
	});
};
let sendId: any = '';
// 获取发文ID
const getSendId = (value: any, option: any) => {
	sendId = option.sendId;
};
let list: any = [];
// 新增/修改提交
const sure = async () => {
	let param = {
		...form_details.user,
		...queryInfo,
		createTime: dateFormat(new Date(), 'y-m-d'),
		completeTime: dateFormat(form_details.user.completeTime, 'y-m-d'),
		sendId,
	};
	let data: any = '';
	if (form_details.name == '新增') {
		let fale = list.some((item: any) => {
			return form_details.user.taskSerial == item.taskSerial;
		});
		if (fale) {
			message.error(`编号相同,请重新输入编号！！`);
			return;
		} else {
			tableData.value = [];
			list.push(param);
		}
		tableData.value = list;
		data = await Api1.addPlan(param);
	} else {
		// data = await Api.updateList({ ...param, id: showId });
	}
	if (data.code == 200) {
		showModal.value = false;
		message.success(`${data.message}`);
	} else {
		message.error(`${data.message}`);
	}
};
// 发布
const Release = async () => {
	let data: any = await Api1.updatePlan({ ...queryInfo });
	data.code == 200 && message.success(`发布成功`) && cancelRelease();
	data.code !== 200 && message.error(`${data.message}`);
	// cancelRelease()
	numberProduct1();
};
// 取消发布
const cancelRelease = () => {
	tableData.value = [];
	queryInfo.planName = '';
	// queryInfo.planNumber: '2022032201',
	queryInfo.sendName = '';
};
onMounted(() => {
	init();
	selectByTypeCode();
});
</script>

<style lang="postcss" scoped>
.top {
	height: 353px;
	border-radius: 10px;
	background-color: #fff;
	.query {
		height: calc(100% - 53px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 30px 20px;
		.left {
			span {
				display: inline-block;
				width: 150px;
				text-align: right;
				line-height: 36px;
			}
			> div {
				margin-top: 30px;
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
.fawenbtn {
	position: relative;
	margin-top: 20px;
	background: #fff;
	border-radius: 10px;
	padding: 40px;
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
