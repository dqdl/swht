/* * @Author: 吴文宇 * @Date: 2022-03-09 11:19:40 * @Last Modified by: 吴文宇 *
@Last Modified time: 2022-03-09 11:19:40 */
<template>
	<div class="enterpriseArchives">
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<!-- name -->
					<n-space>
						<span>点位名称</span>
						<n-input
							v-model:value="queryInfo.name"
							type="text"
							:style="{ width: '240px' }"
							placeholder="请输入名称"
							:maxlength="formMaxLength"
							clearable
						/>
					</n-space>

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
						:remote="true"
						:bordered="false"
						:columns="tableHead"
						:data="tableData"
						:pagination="pagination"
						:loading="tableLoading"
						:row-key="(row: any) => (row.code)"
						@update:page="handlePageChange"
						@update:checked-row-keys="handleCheck"
						@update:pageSize="handlePageSize"
					/>
				</n-config-provider>
			</div>
			<div class="topright">
				<n-space>
					<n-button type="success" @click="add">新增</n-button>
				</n-space>
			</div>
		</div>
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
		<n-modal
			v-if="detailFlag"
			v-model:show="detailFlag"
			class="custom-card"
			preset="card"
			:style="{
				width: '66%',
				height: '800px',
				overflow: 'auto',
				backgroundColor: '#eaf2f7',
				borderRadius: '15px',
			}"
			title="查看详情"
			size="huge"
			:bordered="false"
			:segmented="false"
		>
		</n-modal>
		<n-modal
			v-model:show="showModal_newAdd"
			class="custom-card"
			preset="card"
			:style="{ width: '800px', height: '600px', overflowY: 'auto' }"
			:title="form_details.name"
			size="huge"
			:bordered="false"
			:segmented="false"
		>
			<template #header-extra></template>
			<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
				<n-form ref="formRef" :model="form_details" :rules="rules">
					<n-grid :cols="24" :x-gap="24">
						<n-form-item-gi :span="24" label="点位名称" path="user.ename">
							<n-input
								v-model:value="form_details.user.name"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="具体位置描述"
							path="user.warehouseId"
						>
							<n-input
								v-model:value="form_details.user.description"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="经纬度" path="user.state">
							<n-input
								v-model:value="form_details.user.lonLat"
								clearable
								:maxlength="formMaxLength"
								:disabled="true"
								placeholder="请点击右侧按钮获取定位"
							/>
							<n-icon
								v-if="form_details.name !== '详情'"
								:component="LocationSharp"
								size="30"
								:style="{ cursor: 'pointer', color: 'red' }"
								@click="locationFun"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="点位编号" path="user.latlon">
							<n-input
								v-model:value="form_details.user.number"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="是否关停"
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.shutDown"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="点位联系人"
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.contactPerson"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="联系人电话"
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.contactNumber"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="设计处理量（吨）"
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.designedDeal"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
								type="number"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="实际处理量（吨）"
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.realDeal"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
								type="number"
							/>
						</n-form-item-gi>
					</n-grid>
				</n-form>
			</n-config-provider>
			<template #footer>
				<n-space>
					<n-button
						v-if="form_details.name !== '详情'"
						type="info"
						@click="sure"
						>确认</n-button
					>
					<n-button type="info" @click="showModal_newAdd = false">{{
						form_details.name !== '详情' ? '取消' : '关闭'
					}}</n-button>
				</n-space>
			</template>
		</n-modal>
		<n-modal
			v-model:show="showMap"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 700px; height: 600px"
			title="定位"
		>
			<template #header-extra></template>
			<mapBox
				:disabled="disabled"
				@getPoint="getPoint"
				@cancelGet="showMap = false"
			></mapBox>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import blueTitle from '@components/public/title/index.vue';
import {
	Ref,
	ref,
	reactive,
	h,
	onMounted,
	PropType,
	watch,
	computed,
} from 'vue';
import mapBox from '@components/mapBox/index.vue';
import { LocationSharp } from '@vicons/ionicons5';

import { zhCN, dateZhCN, NButton, NSpace, useMessage, NImage } from 'naive-ui';

import { dateFormat } from '../../../util/verification';
import noImg from '@/assets/images/riskControl/noImg.webp';
// api
// import api_riskIdentification from '@/http/api/riskControl/riskIdentification';
import { Api } from '@/http/api/basicData/basicData';
// ------------------------------------------------state-------------------------------------------------
// 表格加载动画flag
const tableLoading = ref(false);
// 删除弹窗flag
const showModal_delete = ref(false);
// 详情弹窗flag
let detailFlag = ref(false);
// 新增弹窗flag
let showModal_newAdd = ref(false);
// 可编辑flag
let disabled = ref(true);
// 地图弹窗flag
const showMap: any = ref(false);
// ------------------------------------------------data-------------------------------------------------
// 弹窗显示内容
const delete_content = ref('确认删除吗？');
// title数据
const queryInfo: any = ref({
	name: '',
	indutry: '',
	technicsName: '',
});
// 删除id
let deleteId = ref('');
// 下拉选项
const stateOptions = ref([
	[
		{
			label: '爆炸',
			value: '0',
			code: '0',
		},
		{
			label: '腐蚀',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '危险化学品',
			value: '0',
			code: '0',
		},
		{
			label: '危险爆炸物',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '低风险',
			value: '0',
			code: '0',
		},
		{
			label: '中风险',
			value: '1',
			code: '1',
		},
		{
			label: '高风险',
			value: '2',
			code: '2',
		},
	],
]);
// 弹窗下拉选项
let selectOption = ref([
	[
		{
			label: '1级',
			value: '1级',
			code: '1',
		},
		{
			label: '2级',
			value: '2级',
			code: '1',
		},
	],
	[
		{
			label: '1级',
			value: '1级',
			code: '1',
		},
		{
			label: '2级',
			value: '2级',
			code: '1',
		},
	],
	[
		{
			label: '1级',
			value: '1级',
			code: '1',
		},
		{
			label: '2级',
			value: '2级',
			code: '1',
		},
	],
]);
// 最大长度限制
const formMaxLength = ref(24);
// 表头
const tableHead = reactive([
	{
		title: '序号',
		key: 'index',
		width: 70,
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '点位名称',
		key: 'name',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '点位编号',
		key: 'number',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '经纬度',
		key: 'lonLat',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '具体位置',
		key: 'description',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否关停',
		key: 'shutDown',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 200,
		fixed: 'right',
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
							onClick: () => details(row, index),
						},
						{ default: () => '详情' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'warning',
							onClick: () => compile(row, index),
						},
						{ default: () => '编辑' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'error',
							onClick: () => rowDelete(row),
						},
						{ default: () => '删除' }
					),
				]
			);
		},
	},
]);
// 表格数据
const tableData = reactive([
	{
		key: 0,
		index: 1,
		name: 'aaaaaaa',
		number: '11111111',
		lonLat: '1111111212121',
		description: '',
		shutDown: '是',
	},
]);
// 页脚
const pagination = reactive({
	itemCount: 1,
	pageCount: 5, //总共显示几个页码
	page: 1, //当前显示页码
	pageSize: 10, //每页显示数据条数
	pageSizes: [10, 20],
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
// 详情数据
let form_details: any = ref({
	name: '新增',
	user: {
		name: '', //点位名称
		description: '', //具体位置描述
		lonLat: '', //经纬度
		number: '', //点位编号
		shutDown: '', //是否关停
		contactPerson: '', //点位联系人
		contactNumber: '', //联系人电话
		designedDeal: '', //设计处理量（吨）
		realDeal: '', //实际处理量（吨）
	},
	checed: [],
});
// 校验规则
const rules: any = reactive({
	user: {
		ename: {
			required: true,
			message: '请输入企业名称',
			trigger: ['input', 'blur'],
		},
		warehouseName: {
			required: true,
			message: '请输入车间名称',
			trigger: ['input', 'blur'],
		},
		warehouseId: {
			required: true,
			message: '请输入车间编号',
			trigger: ['input', 'blur'],
		},
	},
});
// 上传文件列表
let fileList: any = ref([]);
// 文件数据
const fileData: any = ref({
	fileName: '',
});
// ------------------------------------------------methods-------------------------------------------------
// 获取下拉选项
const getSelectOption = () => {
	let arr = [6],
		arr1 = [3, 2, 25, 13, 6];
	// arr.forEach((item: any, index: any) => {
	// 	api_riskIdentification.getSelectOption(item).then((res: any) => {
	// 		if (res.code == 200) {
	// 			stateOptions.value[index] = [];
	// 			res.data.forEach((e: any, i: any) => {
	// 				stateOptions.value[index].push({
	// 					label: e.name,
	// 					value: e.value,
	// 					code: e.value,
	// 				});
	// 			});
	// 			console.log(stateOptions.value);
	// 		}
	// 	});
	// });
	// arr1.forEach((item: any, index: any) => {
	// 	api_riskIdentification.getSelectOption(item).then((res: any) => {
	// 		if (res.code == 200) {
	// 			selectOption.value[index] = [];
	// 			res.data.forEach((e: any, i: any) =>
	// 				selectOption.value[index].push({
	// 					label: e.name,
	// 					value: e.value,
	// 					code: e.value,
	// 				})
	// 			);
	// 			console.log(stateOptions.value);
	// 		}
	// 	});
	// });
};
// 表单确认
const sure = async () => {
	console.log('确定方法');
	if (form_details.value.name == '新增') {
		addData();
	} else {
		update();
	}
	showModal_newAdd.value = false;
};
// 地图弹窗显示方法
const locationFun = () => {
	showMap.value = true;
};
// 获取点位信息方法
const getPoint = (point: any) => {
	form_details.value.user.lonLat = point;
	showMap.value = false;
};
// 消息提示方法注册
const message = useMessage();
//获取表格数据
const getCompanyDataList = (params: any = { current: 1 }) => {
	tableLoading.value = true;
	const basic_data = { size: pagination.pageSize, current: 1, type: '水' };
	const data = { ...basic_data, ...params };
	Api.Api.getList(data).then((res: any) => {
		console.log('列表数据', res);
		if (res.code === 200) {
			tableData.length = 0;
			pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
			pagination.page = data.current;
			pagination.itemCount = res.data.total;
			res.data.records.forEach((item: any, index: number) => {
				// const { name, account, deptName,job, phone,role, createTime, toustate,biao } = item

				const obj: any = {
					key: index,
					index: (data.current - 1) * pagination.pageSize + index + 1,
					name: item.name,
					number: item.number,
					lonLat: item.lonLat,
					description: item.description,
					shutDown: item.shutDown,
					id: item.id,
				};
				tableData.push(obj);
			});
		}
		tableLoading.value = false;
	});
};
// 更新、新增数据方法
const addData = () => {
	// const parmas: any = JSON.parse(JSON.stringify(form_details.value.user));
	console.log('更新上传数据', form_details.value.user);
	let data = { ...form_details.value.user, type: '水' };
	Api.Api.add(data).then((res: any) => {
		console.log('更新返回数据', res);

		if (res.code == 200) {
			console.log('更新企业信息');
			getCompanyDataList();
			message.success('保存成功');
		} else {
			console.log(res);

			message.error('保存失败');
		}
	});
};
// 更新、新增数据方法
const update = () => {
	// const parmas: any = JSON.parse(JSON.stringify(form_details.value.user));
	console.log('更新上传数据', form_details.value.user);
	Api.Api.update(form_details.value.user).then((res: any) => {
		console.log('更新返回数据', res);

		if (res.code == 200) {
			console.log('更新企业信息');
			getCompanyDataList();
			message.success('保存成功');
		} else {
			console.log(res);

			message.error('保存失败');
		}
	});
};
// 根据id获取数据
const selectByID = async (id: any) => {
	let res: any = await Api.Api.selectById(id);
	console.log('根据id获取数据', res);
	if (res.code == 200) {
		form_details.value.user = res.data;
		console.log('列表详情', form_details.value);
		// addDadosPre();
	}
};
// 查询方法
const query = () => {
	console.log('数据查询', queryInfo.value);
	pagination.page = 1;
	// 查询flag
	let queryFlag = false;
	for (let i in queryInfo.value) {
		if (queryInfo.value[i]) {
			queryFlag = true;
			console.log('查询数据+++++++++++');
			break;
		}
	}
	console.log(queryFlag);
	if (queryFlag) {
		getCompanyDataList(queryInfo.value);
	}
	// getList(params)
	// throttle(query, 3000)()
};
// 重置方法
const reset = () => {
	console.log('重置方法');
	let queryFlag = false;
	for (let i in queryInfo.value) {
		if (queryInfo.value[i]) {
			queryFlag = true;
			queryInfo.value[i] = '';
		}
	}
	if (queryFlag) {
		// queryInfo.value = Object.assign({}, queryInfo.value);
		getCompanyDataList();
	}
};
// 切换页面方法
const handlePageChange = (currentPage: number) => {
	pagination.page = currentPage;
	// getList({ current: currentPage, ...params })
	getCompanyDataList({ current: currentPage, size: pagination.pageSize });
};
// 页面数据条数方法
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	getCompanyDataList({ current: pagination.page, size: pageSizes });
};
// 选中行数方法
const handleCheck = (rowKeys: any) => {
	if (rowKeys.length > 0) {
		delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`;
		form_details.value.checed = rowKeys;
	} else {
		delete_content.value = `确认删除吗？`;
		form_details.value.checed = [];
	}
};
// 新增方法
const add = () => {
	disabled.value = false;
	Object.keys(form_details.value.user).forEach((key) => {
		form_details.value.user[key] = '';
	});
	form_details.value.name = '新增';
	showModal_newAdd.value = true;
	fileList.value.length = 0;
};
// 删除弹窗确认方法
const submitCallback = () => {
	// 单行删除
	Api.Api.delete(deleteId.value).then((res: any) => {
		// current = dealPage(2)
		showModal_delete.value = false;
		console.log('删除返回数据', res);
		if (res.code === 200) {
			message.success('删除成功');
			getCompanyDataList();
		} else {
			message.error('删除失败');
		}
	});
};
// 删除弹窗取消方法、
const cancelCallback = () => {
	message.success('取消删除');
};
// 详情方法
const details = (row?: any, index?: any) => {
	console.log('详情方法', row, index);
	disabled.value = true;
	fileList.value = [];
	form_details.value.name = '详情';
	selectByID(row.id);
	showModal_newAdd.value = true;
};
// 编辑方法
const compile = (row?: any, index?: any) => {
	console.log('编辑方法', row, index);

	fileList.value.length = 0;
	disabled.value = false;
	form_details.value.name = '编辑';
	selectByID(row.id);
	showModal_newAdd.value = true;
};
// 删除方法
const rowDelete = (row?: any, index?: any) => {
	console.log('详情方法', row, index);
	showModal_delete.value = true;
	deleteId.value = row.id;
};
onMounted(() => {
	getCompanyDataList();
	getSelectOption();
});
</script>

<style lang="postcss" scoped>
.enterpriseArchives {
	width: 100%;

	> div {
		width: 100%;
		border-radius: 10px;
		background: #fff;
	}
	.top {
		/* overflow-x: auto; */

		.main {
			padding: 20px 20px 0 20px;
			.left {
				display: flex;
				flex-wrap: wrap;
				align-items: center;

				> div {
					width: 23%;
					/* border: 1px solid #f00; */
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-bottom: 20px !important;
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
	.n-scrollbar-container {
		width: 66%;
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
