<template>
	<div class="accountManagement">
		<!-- topHead -->
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<n-space>
						<span>数据所属时间</span>
						<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
							<n-date-picker
								v-model:value="queryInfo.time"
								:style="{ width: '240px' }"
								type="daterange"
								clearable
							/>
						</n-config-provider>
					</n-space>
					<n-space>
						<n-button type="info" @click="query">查询</n-button>
						<n-button type="warning" @click="reset">重置</n-button>
					</n-space>
				</div>
			</div>
		</div>
		<!-- table -->
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
					<n-button type="primary" @click="newAdd">新增</n-button>
					<n-button type="info" @click="exportList">导出</n-button>
				</n-space>
			</div>
		</div>
		<n-modal
			v-model:show="showModal_newAdd"
			class="custom-card"
			preset="card"
			:style="{ width: '800px' }"
			:title="form_details.name"
			size="huge"
			:bordered="false"
			:segmented="false"
		>
			<template #header-extra></template>
			<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
				<n-form ref="formRef" :model="form_details" :rules="rules">
					<n-grid :cols="24" :x-gap="24">
						<n-form-item-gi :span="24" label="企业名称" path="user.company">
							<n-input
								v-model:value="form_details.user.company"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="月度产值（元）"
							path="user.number"
						>
							<n-input
								v-model:value="form_details.user.monthProduct"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="月度纳税（元）"
							path="user.location"
						>
							<n-input
								v-model:value="form_details.user.monthTaxes"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="月度用电量（kwh）"
							path="user.latlon"
						>
							<n-input
								v-model:value="form_details.user.monthElectric"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="月度用气量（m³） "
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.monthGas"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="月度用水量（m³） "
							path="user.state"
						>
							<n-input
								v-model:value="form_details.user.monthWater"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="固体垃圾量（m³）"
							path="user.administrator"
						>
							<n-input
								v-model:value="form_details.user.fulishSolid"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="废水排放量（吨）"
							path="user.administrator"
						>
							<n-input
								v-model:value="form_details.user.fulishWater"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="废气排放量（m³）"
							path="user.state"
						>
							<n-input
								v-model:value="form_details.user.fulishGas"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							v-if="form_details.name === '编辑'"
							:span="12"
							label="数据所属年月"
							path="user.state"
						>
							<n-input
								v-model:value="form_details.user.time"
								clearable
								:disabled="true"
							/>
						</n-form-item-gi>

						<n-form-item-gi :span="24" label="备注 " path="user.role">
							<n-input
								v-model:value="form_details.user.remark"
								type="textarea"
								:autosize="{
									minRows: 3,
									maxRows: 5,
								}"
								clearable
								placeholder="输入备注"
								:disabled="disabled"
							/>
						</n-form-item-gi>
					</n-grid>
				</n-form>
			</n-config-provider>
			<template #footer>
				<n-space v-if="form_details.name !== '详情'">
					<n-button type="info" @click="sure">确认</n-button>
					<n-button type="info" @click="showModal_newAdd = false"
						>取消</n-button
					>
				</n-space>
				<n-space v-else>
					<n-button type="info" @click="showModal_newAdd = false"
						>关闭</n-button
					>
				</n-space>
			</template>
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

<script lang="ts" setup>
// vue
import { ref, reactive, h, onMounted } from 'vue';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
// api
import api_info from '../../../axios/api/information/index';
import { dateFormat } from '../../../util/verification';
// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage();
const formMaxLength = 24;
/**
 * state_head
 */
// queryInfo
const queryInfo = reactive({
	time: <any>ref(null),
});
// 所属行业
const industryList = reactive([
	{
		label: '超级管理员',
		value: '超级管理员',
	},
	{
		label: '普通人员',
		value: '普通人员',
	},
]);
// 归属平台
const platform = reactive([
	{
		label: '紫金园区',
		value: '紫金园区',
	},
]);

/**
 * state_table
 */
const tableLoading = ref(false);
// table_head
const tableHead = reactive([
	{
		title: '序号',
		key: 'index',
		width: 60,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '企业名称',
		key: 'company',
		// width: 120,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '月度产值(元)',
		key: 'monthProduct',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '月度纳税(元)',
		key: 'monthTaxes',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '月度用电量(kwh)',
		key: 'monthElectric',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '月度用气量(m³)',
		key: 'monthGas',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '月度用水量(m³)',
		key: 'monthWater',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '固体垃圾量(m³)',
		key: 'fulishSolid',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '废水排放量(吨)',
		key: 'fulishWater',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '废气排放量(m³)',
		key: 'fulishGas',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '数据日期',
		key: 'time',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '填报时间',
		key: 'createTime',
		width: 120,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 240,
		fixed: 'right',
		render(row: object, index: number) {
			return h(
				NSpace,
				{
					justify: 'end',
				},
				[
					h(
						NButton,
						{
							size: 'small',
							type: 'info',
							onClick: () => rowDetails(row, index),
						},
						{ default: () => '详情' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'warning',
							onClick: () => rowEdit(row, index),
						},
						{ default: () => '编辑' }
					),

					h(
						NButton,
						{
							size: 'small',
							type: 'error',
							onClick: () => rowDelete(row, index),
						},
						{ default: () => '删除' }
					),
				]
			);
		},
	},
]);
// table_data
const tableData = reactive([
	{
		key: 0,
		index: 1,
		company: '',
		monthProduct: '',
		monthTaxes: '',
		monthElectric: '',
		monthGas: '',
		monthWater: '',
		fulishSolid: '',
		fulishWater: '',
		fulishGas: '',
		time: '',
		createTime: '',
	},
]);
// pagination
const pagination = reactive({
	itemCount: 0, //数据总条数
	pageCount: 5, //总共显示几个页码
	page: 1, //当前显示页码
	pageSize: 10, //每页显示数据条数
	pageSizes: [10, 20], //每页显示几条
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});

/**
 * methods_table
 */
// 查询
const query = () => {
	if (queryInfo.time != null) {
		const time = dateFormat(queryInfo.time[0], 'y-m-d');
		// const transEnd = dateFormat(queryInfo.time[1], 'y-m-d')
		getList({ time });
	} else {
		getList();
	}
};
// 重置
const reset = () => {
	queryInfo.time = null;
	getList();
};
const form_details: any = reactive({
	name: '新增',
	user: {
		company: '企业名称',
		monthProduct: '月度产值(元)',
		monthTaxes: '月度纳税（元）',
		monthElectric: '月度用电量（kwh）',
		monthGas: '月度用气量（m³）',
		monthWater: '月度用水量（m³）',
		fulishSolid: '固体垃圾量（m³）',
		fulishWater: '废水排放量（吨）',
		fulishGas: '废气排放量（m³）',
		time: '数据所属年月',
		remark: '备注',
		id: '',
	},
});
const formRef: any = ref(null);
const rules: any = reactive({
	user: {
		company: {
			required: true,
			message: '请输入企业名称',
			trigger: ['input', 'blur'],
		},
	},
});

const disabled = ref(true);
// show_or_hidden_modal
const showModal_newAdd = ref(false);
const showModal_delete = ref(false);
// 新增
const newAdd = () => {
	form_details.name = '新增';
	Object.keys(form_details.user).forEach((item) => {
		form_details.user[item] = '';
	});
	disabled.value = false;
	showModal_newAdd.value = true;
};
// 表单确认
const sure = async () => {
	formRef.value?.validate(async (error: any) => {
		if (!error) {
			let res: any;
			if (form_details.name === '新增') {
				const {
					company,
					monthProduct,
					monthTaxes,
					monthElectric,
					monthGas,
					monthWater,
					fulishSolid,
					fulishWater,
					fulishGas,
					time,
					remark,
				} = form_details.user;
				res = await api_info.newAdd({
					company: company,
					companyId: '',
					createTime: '',
					fulishGas: Number(fulishGas),
					fulishSolid: Number(fulishSolid),
					fulishWater: Number(fulishWater),
					isDelete: 0,
					monthElectric: Number(monthElectric),
					monthGas: Number(monthGas),
					monthProduct: Number(monthProduct),
					monthTaxes: Number(monthTaxes),
					monthWater: Number(monthWater),
					remark: remark,
					time: dateFormat(new Date().valueOf(), 'y-m-d'),
					startTime: '',
				});
			} else if (form_details.name === '编辑') {
				const {
					company,
					monthProduct,
					monthTaxes,
					monthElectric,
					monthGas,
					monthWater,
					fulishSolid,
					fulishWater,
					fulishGas,
					time,
					remark,
					id,
				} = form_details.user;
				res = await api_info.edit({
					company: company,
					companyId: '',
					createTime: '',
					fulishGas: Number(fulishGas),
					fulishSolid: Number(fulishSolid),
					fulishWater: Number(fulishWater),
					id: id,
					isDelete: 0,
					monthElectric: Number(monthElectric),
					monthGas: Number(monthGas),
					monthProduct: Number(monthProduct),
					monthTaxes: Number(monthTaxes),
					monthWater: Number(monthWater),
					remark: remark,
					startTime: '',
				});
			}
			if (res.code === 200) {
				getList();
			} else {
				message.error('操作失败', { duration: 3000 });
				console.error(`${res.code}======>${res.message}`);
			}
			showModal_newAdd.value = false;
		} else message.error('请将信息填写完整');
	});
};
// 编辑
const rowEdit = async (row: any, index: number) => {
	form_details.name = '编辑';
	form_details.user = row;
	disabled.value = false;
	showModal_newAdd.value = true;

	form_details.user.id = row.id;
};
// 删除
const rowDelete = (row: any, index: number) => {
	showModal_delete.value = true;
	form_details.user.id = row.id;
};
// 确认删除
const submitDelete = async () => {
	const id = form_details.user.id;
	const res: any = await api_info.delete(id);
	if (res.code === 200) {
		getList();
	} else {
		console.log(`res.code====>${res.code}`);
	}
};
// 详情
const rowDetails = async (row: any, index: number) => {
	form_details.name = '详情';
	form_details.user = row;
	disabled.value = true;
	showModal_newAdd.value = true;
};

// 导出
const exportList = () => {
	const params = {};
	api_info
		.exportList(params)
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '经营信息管理.xlsx');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
		})
		.catch(function (error) {
			console.log(error);
			message.error('导出失败', { duration: 3000 });
		});
};
// 分页翻页
const handlePageChange = (currentPage: number) => {
	getList({ current: currentPage });
};
// 展示多少页
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	getList();
};
// 表格当前选中行
const handleCheck = async (rowKeys: any) => {
	console.log(rowKeys);
};
/**-----------------------------------------------------接口--------------------------------------------------------- */
// 获取列表数据
const getList = async (data?: any) => {
	tableLoading.value = true;
	const basicData = { current: 1, size: pagination.pageSize };
	const params = { ...basicData, ...data };
	const res: any = await api_info.getList(params);
	console.log(res);
	if (res.code === 200) {
		// page
		pagination.itemCount = res.data.total;
		pagination.page = params.current;
		pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
		// table
		tableData.length = 0;
		res.data.records.forEach((item: any, i: number) => {
			item.index = (params.current - 1) * pagination.pageSize + i + 1;
			tableData.push(item);
		});
		tableLoading.value = false;
	} else {
		message.error('操作失败', { duration: 3000 });
		console.error(`${res.code}======>${res.message}`);
	}
};
onMounted(() => {
	console.log('经营信息管理');
	getList();
});
</script>

<style lang="postcss" scoped>
.accountManagement {
	width: 100%;
	> div {
		width: 100%;
		border-radius: 10px;
		background: #fff;
	}
	.top {
		/* height: 210px; */
		/* overflow-x: auto; */

		.main {
			padding: 20px 20px 0 20px;
			> div {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				> div {
					width: 25%;
					/* border: 1px solid #f00; */
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-bottom: 20px !important;
				}
				> div:last-child {
					margin-bottom: 0px;
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
}
</style>
