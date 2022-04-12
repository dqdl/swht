<template>
	<div class="hidenDanger">
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
					<n-space>
						<span>行业</span>
						<n-select v-model:value="queryInfo.industry" :options="industryList" placeholder="请输入行业"
							:style="{ width: '160px' }" />
					</n-space>
					<!-- time -->
					<n-space>
						<span>排查时间</span>
						<n-config-provider :locale="lg.zhCN" :date-locale="lg.dateZhCN">
							<n-date-picker v-model:value="queryInfo.time" :style="{ width: '240px' }" type="daterange"
								clearable />
						</n-config-provider>
					</n-space>
					<n-space>
						<span>隐患来源</span>
						<n-select v-model:value="queryInfo.hiddenFrom" :options="hiddenFrom" placeholder="请选择"
							:style="{ width: '160px' }" />
					</n-space>
					<n-space>
						<span>隐患点名称</span>
						<n-input v-model:value="queryInfo.hiddenName" placeholder="隐患点名称" :style="{ width: '160px' }" />
					</n-space>
				</div>
				<div class="right">
					<n-space>
						<n-button type="info" @click="query">查询</n-button>
						<n-button type="warning" :disabled="isCanUse" @click="reset">重置</n-button>
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
		}" :title="form_details.name" :bordered="false" :segmented="false" size="huge" class="custom-card" preset="card">
			<n-card :bordered="false">
				<template #header-extra></template>
				<n-form ref="formRef" :model="form_details" :rules="rules">
					<n-grid :cols="24" :x-gap="24">
						<n-form-item-gi :span="24" label="企业名称" path="user.company">
							<n-input v-model:value="form_details.user.company" type="text" placeholder="点击选择企业"
								clearable :disabled="true" @click="choiceCom" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="行业名称" path="user.industry">
							<n-select v-model:value="form_details.user.industry" type="text" :options="industryList"
								placeholder="行业名称" clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="隐患点名称" path="user.hiddenDanger">
							<n-input v-model:value="form_details.user.hiddenDanger" type="text" placeholder="隐患点名称"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="检查内容" path="user.content">
							<n-input v-model:value="form_details.user.content" type="text" placeholder="检查内容" clearable
								:disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="隐患来源" path="user.hiddenFrom">
							<n-input v-model:value="form_details.user.hiddenFrom" type="text" placeholder="隐患来源"
								clearable :disabled="true" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="隐患内容" path="user.facilityName">
							<n-input v-model:value="form_details.user.hiddenContent" type="text" placeholder="隐患内容"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="排查人员" path="user.facilityName">
							<n-input v-model:value="form_details.user.checkPeople" type="text" placeholder="排查人员"
								clearable :disabled="true" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="排查时间" path="user.facilityName">
							<n-config-provider :style="{ width: '100%' }" :locale="zhCN" :date-locale="dateZhCN">
								<n-date-picker v-model:value="form_details.user.checkTime"
									:disabled="form_details.name == '详情'" type="date" clearable />
							</n-config-provider>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="整改要求" path="user.facilityName">
							<n-input v-model:value="form_details.user.requirement" type="text" placeholder="整改要求"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="整改责任人" path="user.facilityName">
							<n-input v-model:value="form_details.user.requirementPerson" type="text" placeholder="整改责任人"
								clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="限期完成时间" path="user.facilityName">
							<n-config-provider :style="{ width: '100%' }" :locale="zhCN" :date-locale="dateZhCN">
								<n-date-picker v-model:value="form_details.user.arriveTime"
									:disabled="form_details.name == '详情'" type="date" clearable />
							</n-config-provider>
						</n-form-item-gi>
						<n-form-item-gi :span="form_details.name == '详情' ? 13 : 12" label="位置" path="user.facilityName">
							<n-input v-model:value="form_details.user.location" clearable :disabled="true"
								placeholder="请点击右侧按钮获取定位" />
							<n-icon v-if="form_details.name !== '详情'" :component="LocationSharp" size="30"
								:style="{ cursor: 'pointer', color: 'red' }" @click="showMap = true" />
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="隐患备注" path="user.facilityName">
							<n-input v-model:value="form_details.user.remark" type="textarea" :autosize="{
								minRows: 3,
								maxRows: 5,
							}" placeholder="隐患备注" clearable :disabled="form_details.name == '详情'" />
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="附件上传" path="user.state">
							<n-upload ref="upload" :max="10" :multiple="true" :show-file-list="false"
								:disabled="form_details.name == '详情'" :action="postUrl" @finish="handleFinish"
								@before-upload="beforeUpload">
								<n-button>上传文件</n-button>
							</n-upload>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="附件文件" path="user.state">
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

import { NIcon, zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import blueTitle from '@/components/public/title/index.vue';
import mapBox from '@components/mapBox/index.vue';
import mTable from '../table/table.vue';
import { LocationSharp } from '@vicons/ionicons5';
import { dateFormat } from '../../../util/verification';
// api
import { Api } from '@/http/api/safetySupervision/hiddenDangerInvestigation';
import { commonApi } from '@/http/api/common/common';
// 消息组件
const message = useMessage();

const fileData: any = reactive({
	fileName: '',
});
let lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});
// 查询条件
const queryInfo: any = reactive({
	time: null,
	company: '',
	industry: '',
	hiddenFrom: '',
	hiddenName: '',
});
// 隐患来源
const hiddenFrom: any = reactive([
	{
		label: '园区巡查',
		value: '园区巡查',
	},
	{
		label: '企业自查',
		value: '企业自查',
	},
]);
// 行业列表
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
		industry: '',
		hiddenDanger: '',
		hiddenFrom: '',
		content: '',
		location: '',
		hiddenContent: '',
		checkPeople: '',
		checkTime: null,
		requirement: '',
		requirementPerson: '',
		arriveTime: null,
		remark: '',
		id: '',
	},
});

let isCanUse: any = ref(false);
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
		title: '企业名称',
		key: 'company',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '行业',
		key: 'industry',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},


	{
		title: '隐患点名称',
		key: 'hiddenDanger',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '隐患来源',
		key: 'hiddenFrom',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '隐患级别',
		key: 'hiddenLevel',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '排查人员',
		key: 'checkPeople',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '排查时间',
		key: 'checkTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '治理状态',
		key: 'status',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '限期完成时间',
		key: 'arriveTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '整改完成时间',
		key: 'completeTime',
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
		hiddenDanger: '',
		hiddenFrom: '',
		checkPeople: '',
		hiddenLevel: '',
		checkTime: '',
		status: '',
		arriveTime: '',
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
const rules = {
	user: {
		company: {
			message: '请输入企业名称',
			required: true,
			trigger: ['blur', 'change'],
		},
		industry: {
			message: '请选择行业名称',
			required: true,
			trigger: ['blur', 'change'],
		},
		hiddenDanger: {
			message: '请输入隐患点名称',
			required: true,
			trigger: ['blur', 'change'],
		},
		content: {
			message: '请输入检查内容',
			required: true,
			trigger: ['blur', 'change'],
		}
	},
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

/***************Api***************/
// 新增
const newAdd = () => {
	Object.keys(form_details.user).forEach((key) => {
		form_details.user[key] = '';
		if (key == 'checkTime' || key == 'arriveTime') {
			form_details.user[key] = null;
		}
	});
	fileList.length = 0;
	form_details.name = '新增';
	showModal.value = true;
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
		form_details.user.content = data.checkContent;
		form_details.user.arriveTime = getTime(data.completionTime);
		form_details.user.hiddenFrom = data.hazardSources;
		form_details.user.hiddenContent = data.hiddenContent;
		form_details.user.remark = data.hiddenRemarks;
		form_details.user.industry = data.industry;
		form_details.user.hiddenDanger = data.name;
		form_details.user.id = data.enterpriseId;
		form_details.user.company = data.enterpriseName;
		data.fileUrl &&
			data.fileUrl.forEach((element: any) => {
				fileList.push(element);
			});
		form_details.user.location = data.point;
		form_details.user.checkTime = getTime(data.screenTime);
		form_details.user.checkPeople = data.screeningPersonnel;
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

// 初始化
const init = () => {
	let type = sessionStorage.getItem('type');
	let name = sessionStorage.getItem('name');
	type && type == '1' && (form_details.user.hiddenFrom = '园区巡检');
	type && type == '2' && (form_details.user.hiddenFrom = '企业自查');
	name && (form_details.user.checkPeople = name);
};
// 获取表格列表
const getList = async (params: any = { current: 1 }) => {
	const basicData: any = {
		current: 1,
		pageSize: pagination.pageSize,
		enterpriseName: queryInfo.company,
		industry: queryInfo.industry,
		hazardSources: queryInfo.hiddenFrom,
		name: queryInfo.hiddenName,
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
				hiddenDanger: element.name,
				hiddenFrom: element.hazardSources,
				checkPeople: element.screeningPersonnel,
				hiddenLevel: element.hazardLevel,
				checkTime: element.screenTime,
				industry: element.industry,
				status: element.governanceStatus,
				arriveTime: element.completionTime,
				completeTime: element.rectificationTime,
				id: element.id,
			});
		});
};
// 获取行业
const selectByTypeCode = async () => {
	let param = {
		typeCode: 6,
	};
	let { data }: any = await commonApi.selectByTypeCode(param);
	industryList.length = 0;
	data &&
		data.forEach((element: any) => {
			industryList.push({
				label: element.name,
				value: element.name,
				code: element.code,
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
	if (form_details.name == '详情') {
		return;
	}
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
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增提交
const sure = (e: any) => {
	e.preventDefault()
	const dragDivDom: any = formRef.value;
	dragDivDom.validate(async (errors: any) => {
		if (!errors) {
			let param = {
				checkContent: form_details.user.content,
				completionTime: dateFormat(form_details.user.arriveTime, 'y-m-d'),
				enterpriseId: form_details.user.id,
				enterpriseName: form_details.user.company,
				hazardSources: form_details.user.hiddenFrom,
				hiddenContent: form_details.user.hiddenContent,
				hiddenRemarks: form_details.user.remark,
				industry: form_details.user.industry,
				name: form_details.user.hiddenDanger,
				fileUrl: fileList,
				point: form_details.user.location,
				screenTime: dateFormat(form_details.user.checkTime, 'y-m-d'),
				screeningPersonnel: form_details.user.checkPeople,
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
	init();
	getList();
	selectByTypeCode();
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
