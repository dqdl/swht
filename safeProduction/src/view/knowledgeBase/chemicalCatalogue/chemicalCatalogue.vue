<!-- 重点监管化学品 -->
<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
		<div class="enterpriseArchives">
			<div class="top">
				<blue-title :prop-value="'查询'" />
				<div class="main">
					<n-form
						ref="queryForm"
						:model="queryInfo"
						label-placement="left"
						:label-width="100"
						size="large"
					>
						<n-form-item label="化学品名称" path="nameCn">
							<n-input
								v-model:value="queryInfo.nameCn"
								placeholder="请输入化学品名称"
							/>
						</n-form-item>
						<n-form-item label="英文名" path="nameEu">
							<n-input
								v-model:value="queryInfo.nameEu"
								placeholder="请输入英文名"
							/>
						</n-form-item>
						<n-form-item>
							<n-button type="info" @click="query">查询</n-button>
							<n-button type="warning" @click="resetQueryForm()">重置</n-button>
						</n-form-item>
					</n-form>
				</div>
			</div>
			<div class="list">
				<blue-title :prop-value="'数据列表'" />
				<div class="tableList">
					<n-data-table
						:remote="true"
						:bordered="false"
						:columns="tableHead"
						:data="tableData"
						:pagination="pagination"
						:loading="tableLoading"
						:row-key="(row: any) => row.code"
						@update:page="handlePageChange"
						@update:checked-row-keys="handleCheck"
						@update:pageSize="handlePageSize"
					/>
				</div>
			</div>
		</div>
		<n-modal
			v-model:show="popShow"
			preset="card"
			:title="form_details.name !== '详情' ? '修改' : '查看'"
			:style="{ width: '700px' }"
		>
			<n-form
				ref="formRef"
				:model="form_details"
				label-placement="left"
				:label-width="120"
				size="large"
				class="popForm"
				:style="{ width: '700px', display: 'flex', flexWrap: 'wrap' }"
				:rules="rules"
			>
				<n-form-item label="化学品名称" path="user.nameCn">
					<n-input
						v-model:value="form_details.user.nameCn"
						:style="{ width: '520px' }"
						placeholder="请输入化学品名称"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="别名" path="user.alias">
					<n-input
						v-model:value="form_details.alias"
						:style="{ width: '520px' }"
						placeholder="请输入别名"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="英文名" path="user.nameEu">
					<n-input
						v-model:value="form_details.user.nameEu"
						:style="{ width: '520px' }"
						placeholder="请输入英文名"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="CAS" path="user.cas">
					<n-input
						v-model:value="form_details.user.cas"
						:style="{ width: '520px' }"
						placeholder="请输入cas"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="是否剧毒" path="user.highlyToxic">
					<n-select
						v-model:value="form_details.user.highlyToxic"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[0]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="是否易制毒" path="user.easyDrug">
					<n-select
						v-model:value="form_details.user.easyDrug"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[0]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
			</n-form>
			<template #footer>
				<n-space>
					<n-button
						type="info"
						@click="onSubmit"
						v-if="form_details.name !== '详情'"
						>确认</n-button
					>
					<n-button type="info" @click="onCancel">{{
						form_details.name !== '详情' ? '取消' : '关闭'
					}}</n-button>
				</n-space>
			</template>
		</n-modal>
		<!-- 删除提示弹窗 -->
		<n-modal
			v-model:show="deleteFlag"
			preset="dialog"
			type="error"
			:show-icon="false"
			title="删除"
			:content="delete_content"
			positive-text="确认"
			negative-text="取消"
			@positive-click="onDeleteClick"
			@negative-click="cancelCallback"
		></n-modal>
	</n-config-provider>
</template>

<script setup lang="ts">
import blueTitle from '@components/public/title/index.vue';
import { ref, reactive, h, onMounted } from 'vue';
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import port from '@/axios/catalogue';
import { LocationSharp } from '@vicons/ionicons5';
import mapBox from '@components/mapBox/index.vue';

const message = useMessage();

// ---------------------------------- 查询数据、重置查询信息 start -----------------------------
// 查询方法
const query = () => {
	pagination.page = 1;
	// 查询flag
	let queryFlag = false;
	for (let i in queryInfo.value) {
		if (queryInfo.value[i]) {
			queryFlag = true;
			break;
		}
	}
	if (queryFlag) {
		getList(queryInfo.value);
	}
};
// 查询条件表单
let queryInfo = ref<any>({
	nameEu: '', // 化学品名称
	nameCn: '', // 英文名
});
// 重置表单方法
const resetForm = (obj: any) => {
	Object.keys(obj).forEach((key: string) => {
		obj[key] = '';
	});
};
// 重置查询表单
const resetQueryForm = () => {
	resetForm(queryInfo.value);
	getList();
};
// ---------------------------------- 获取列表数据 start -----------------------------
// 获取数据列表
const getList = (obj: any = { current: 1 }) => {
	tableLoading.value = true;
	const basic_data = {
		size: pagination.pageSize,
		current: 1,
		nameCn: queryInfo.value.nameCn,
		nameEu: queryInfo.value.nameEu,
	};
	const data = { ...basic_data, ...obj };
	port
		.tableListData(data)
		.then((res: any) => {
			if (res.code === 200) {
				// console.log(res,'res11111111111111111111')
				tableData.length = 0;
				pagination.itemCount = res.data.total;
				pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
				pagination.page = data.current;
				res.data.records.forEach((e: any, index: number) => {
					// console.log('222222value',industryArr)
					const obj: any = {
						num: (data.current - 1) * pagination.pageSize + index + 1,
						nameCn: e.nameCn,
						nameEu: e.nameEu,
						cas: e.cas,
						otherName: e.otherName,
						id: e.id,
						highlyToxic: e.highlyToxic,
						easyDrug: e.easyDrug,
					};
					tableData.push(obj);
				});
			} else {
				message.error('请求数据失败');
			}
			tableLoading.value = false;
		})
		.catch((error) => {
			message.error(error);
			tableLoading.value = false;
		});
};

// ---------------------------------- 表头、页脚、条数、页数 start -----------------------------
// 表头
let tableHead = reactive([
	{
		title: '序号',
		key: 'num',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '化学品名称',
		key: 'nameCn',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '别名',
		key: 'anotherName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: 'CAS',
		key: 'cas',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '英文名',
		key: 'nameEu',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否剧毒',
		key: 'highlyToxic',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否易制毒',
		key: 'easyDrug',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 220,
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
						{ default: () => '查看' }
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
							onClick: () => rowDelete(row, index),
						},
						{ default: () => '删除' }
					),
				]
			);
		},
	},
]);
// 页脚
let pagination = reactive({
	itemCount: 0,
	pageCount: 5, //总共显示几个页码
	page: 1, //当前显示页码
	pageSize: 10, //每页显示数据条数
	pageSizes: [10, 20],
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
// 切换页面方法
const handlePageChange = (currentPage: number) => {
	pagination.page = currentPage;
	getList({ current: currentPage, size: pagination.pageSize });
};
// 页面数据条数方法
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	// console.log('pagination', pageSizes);
	getList();
};

// ---------------------------------- 下拉列表 start -----------------------------
/**
 * 获取下拉框数据列表
 */
const getPullDownData = () => {
	// 是否=30
	port.dictionaries({ typeCode: 30 }).then((res: any) => {
		if (res.code === 200) {
			stateOptions.value[0] = [];
			res.data.forEach((e: any, i: any) => {
				stateOptions.value[0].push({
					label: e.name,
					value: e.value,
					code: e.value,
				});
			});
		}
	});
};

// 下拉选项
const stateOptions = ref([
	[
		{
			label: '否',
			value: '0',
			code: '0',
		},
		{
			label: '是',
			value: '1',
			code: '1',
		},
	],
]);
let selectData = ref([]);

// ---------------------------------- 表格 start -----------------------------
// 表格数据
let tableData = reactive([
	{
		num: 1, // 序号
		nameCn: '', // 化学品名称
		anotherName: '', // 别名
		highlyToxic: '', // 是否剧毒
		easyDrug: '', // 是否易制毒
		cas: '', // cas号
		key: 0,
		id: '',
	},
]);
// 表格加载动画flag
const tableLoading = ref(false);
// ---------------------------------- 表单 start -----------------------------
// 表单详细数据
const form_details: any = ref({
	name: '查看',
	user: {
		anotherName: '',
		appearance: ' ',
		autoIgnitionPoint: ' ',
		bodyProtection: ' ',
		boilingPoint: ' ',
		cas: ' ',
		cn: ' ',
		condition: ' ',
		decompositionProducts: ' ',
		easyDrug: '', // 易毒
		explosionLowerLimit: ' ',
		explosionUpperLimit: ' ',
		eyeProtection: ' ',
		fireExtinguishingAgent: ' ',
		fireExtinguishingMethod: ' ',
		fireId: ' ',
		firstAidEyeContact: ' ',
		firstAidIngestion: ' ',
		firstAidInhalation: ' ',
		firstAidOther: ' ',
		firstAidSkinContact: ' ',
		flashPoint: ' ',
		forbidGoods: ' ',
		formul: ' ',
		handProtectio: ' ',
		hazardCharacteristic: ' ',
		healthHazard: ' ',
		highlyToxic: '', // 剧毒
		id: ' ',
		invasionRout: ' ',
		leakHandl: ' ',
		mac: ' ',
		meltingPoint: ' ',
		nameCn: ' ',
		nameEu: ' ',
		no: ' ',
		otherProtection: ' ',
		packing: ' ',
		pcStel: ' ',
		pcTwa: ' ',
		poisonId: ' ',
		polymerization: ' ',
		prohibitedExtinguishingAgent: ' ',
		relativeDensityAir: ' ',
		relativeDensityWater: ' ',
		respiratorySystemProtection: ' ',
		solubility: ' ',
		stability: ' ',
		store: ' ',
		toxicityData: ' ',
		transport: ' ',
		un: ' ',
		vaporPressure: ' ',
	},
	checked: [],
});

// 弹窗开关状态
let popShow = ref<boolean>(false);
// 打开弹窗
const openPop = () => {
	// 清空表单
	// resetForm(popForm.value);
	popShow.value = true;
};
// 更新表单数据
// const update = () => {
// 	let data = form_details.value.user;
// 	console.log('更新上传的数据', data);
// 	port.formData(data).then((res: any) => {
// 		// console.log('更新上传的数据res---------------------------------',res);
// 		// console.log('formData res',res)
// 		disabled.value = false;

// 		if (res.code === 200) {
// 			form_details.value.user = res.data;
// 			// console.log('formData res', form_details.value.user);
// 			getList();
// 			message.success('保存成功');
// 		} else {
// 			message.error('保存失败');
// 		}
// 	});
// };

// 表单确认提交
const onSubmit = () => {
	let data = form_details.value.user;
	console.log('更新上传的数据', data);
	port.formData(data).then((res: any) => {
		// console.log('更新上传的数据res---------------------------------',res);
		// console.log('formData res',res)
		disabled.value = false;

		if (res.code === 200) {
			form_details.value.user = res.data;
			// console.log('formData res', form_details.value.user);
			getList();
			message.success('保存成功');
		} else {
			message.error('保存失败');
		}
	});
	popShow.value = false;
};
// 表单取消
const onCancel = () => {
	popShow.value = false;
	message.success('取消');
};

// 表单校验规则
const rules: any = reactive({
	user: {
		nameCn: {
			required: true,
			message: '请输入企业名称',
			trigger: ['input', 'blur'],
		},
		alias: {
			required: true,
			message: '请输入别名',
			trigger: ['input', 'blur'],
		},
		nameEu: {
			required: true,
			message: '请输入英文名',
			trigger: ['input', 'blur'],
		},
		cas: {
			required: true,
			message: '请输入cas',
			trigger: ['input', 'blur'],
		},
		highlyToxic: {
			required: true,
			message: '请选择是否剧毒',
			trigger: ['input', 'blur'],
		},
		easyDrug: {
			required: true,
			message: '请选择是否易制毒',
			trigger: ['input', 'blur'],
		},
	},
});

// 查看表单详情
const details = (row?: any, index?: any) => {
	// console.log('详情方法1221', row.id);
	disabled.value = true;
	form_details.value.name = '详情';
	selectByID(row.id);
	popShow.value = true;
};
// 编辑表单
const compile = (row?: any, index?: any) => {
	// console.log('编辑方法1221', row.id);
	getPullDownData();
	form_details.value.name = '编辑';
	disabled.value = false;
	selectByID(row.id);
	popShow.value = true;
};

// 根据id获取单条数据详情
const selectByID = (id: any) => {
	port.selectOne({ id }).then((res: any) => {
		// console.log('根据id获取数据', res.data);
		if (res.code == 200) {
			// console.log('根据id获取单条数据详情',res)
			form_details.value.user = res.data;
		}
	});
};

// 可编辑flag
let disabled = ref(true);
// ---------------------------------- 删除数据 start -----------------------------
// 弹窗显示内容
const delete_content = ref('确认删除吗？');
// 获取选中行数
const handleCheck = (rowKeys: any) => {
	if (rowKeys.length > 0) {
		delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`;
		form_details.value.checked = rowKeys;
	} else {
		delete_content.value = `确认删除吗？`;
		form_details.value.checed = [];
	}
};
// 删除弹窗--状态
let deleteFlag = ref<boolean>(false);
// 删除对象id
let deleteId = ref(null);
// 取消显示弹窗
const cancelCallback = () => {
	message.success('取消删除');
};
// 确定删除方法
const onDeleteClick = (currentPage: number) => {
	port
		.deleteData(deleteId.value)
		.then((res: any) => {
			// console.log('删除res', res);
			// 关闭弹窗
			deleteFlag.value = false;
			message.success('删除成功');
			getList();
			// deleteRowId.value = null;
		})
		.catch((error: any) => {
			message.error(error.msg);
			// deleteRowId.value = null;
		});
};
let deleteRowId: any = ref('');
// 删除单条数据
const deleteById = (row: any) => {
	deleteRowId.value = row.id;
	deleteFlag.value = true;
};
// 删除方法
// let deleteId = ref<any>();
const rowDelete = (row?: any, index?: any) => {
	// console.log('删除id获取', row, index);
	deleteFlag.value = true;
	deleteId.value = row.id;
};
// ---------------------------------- 生命周期 start -----------------------------
onMounted(() => {
	getList();
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
		.main {
			padding: 20px 20px 0 20px;
			.select {
				width: 240px;
			}
			.n-form {
				display: flex;
				flex-wrap: wrap;
				.n-form-item {
					width: 340px;
					margin-right: 10px;
					.n-button {
						margin-left: 10px;
					}
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
</style>
<style>
/* 新增弹窗下拉框样式 */
.chemicalPopFormSelect {
	width: 200px;
}
.n-card > .n-card__footer {
	margin: auto;
}
</style>
