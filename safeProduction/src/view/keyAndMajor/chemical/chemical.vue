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
						<n-form-item label="企业名称" path="companyName">
							<n-input
								v-model:value="queryInfo.companyName"
								placeholder="请输入企业名称"
							/>
						</n-form-item>
						<n-form-item label="危险品名称" path="dangerName">
							<n-input
								v-model:value="queryInfo.dangerName"
								placeholder="请输入危险品名称"
							/>
						</n-form-item>
						<n-form-item label="危险品类别" path="dangerVariy">
							<n-select
								v-model:value="queryInfo.dangerVariy"
								placeholder="Select"
								:options="stateOptions[0]"
								class="select"
							/>
						</n-form-item>
						<n-form-item label="行业" path="industry">
							<n-select
								v-model:value="queryInfo.industry"
								placeholder="Select"
								:options="stateOptions[1]"
								class="select"
							/>
						</n-form-item>
						<n-form-item label="是否剧毒" path="isPoison">
							<n-select
								v-model:value="queryInfo.isPoison"
								placeholder="Select"
								:options="stateOptions[2]"
								class="select"
							/>
						</n-form-item>
						<n-form-item label="是否易制毒" path="isPrecursor">
							<n-select
								v-model:value="queryInfo.isPrecursor"
								placeholder="Select"
								:options="stateOptions[2]"
								class="select"
							/>
						</n-form-item>
						<n-form-item>
							<n-button type="info" @click="getList(queryInfo)">查询</n-button>
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
				<div class="topright">
					<n-space>
						<n-button type="primary" @click="add">新增</n-button>
						<n-button type="info" @click="exportFile">导出</n-button>
					</n-space>
				</div>
			</div>
		</div>
		<n-modal
			v-model:show="popShow"
			preset="card"
			title="新增"
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
				<n-form-item label="企业名称" path="user.companyName">
					<n-input
						v-model:value="form_details.user.companyName"
						:style="{ width: '520px' }"
						placeholder="请输入企业名称"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="所属行业" path="user.industry">
					<n-input
						v-model:value="form_details.user.industry"
						placeholder="请输入所属行业"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="危险品" path="user.dangerName">
					<n-input
						v-model:value="form_details.user.dangerName"
						placeholder="请输入危险品"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="危险品类别" path="user.dangerVariy">
					<n-select
						v-model:value="form_details.user.dangerVariy"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[0]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="最大储量" path="user.maxSize">
					<n-input
						v-model:value="form_details.user.maxSize"
						maxlength="5"
						:disabled="disabled"
						placeholder="请输入最大储量"
					/>
				</n-form-item>
				<n-form-item label="年度总量" path="user.yearSize">
					<n-input
						v-model:value="form_details.user.yearSize"
						maxlength="5"
						:disabled="disabled"
						placeholder="请输入年度总量"
					/>
				</n-form-item>
				<n-form-item label="储存方式" path="user.saveWay">
					<n-select
						v-model:value="form_details.user.saveWay"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[3]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="是否重点监管" path="user.isSupervise">
					<n-select
						v-model:value="form_details.user.isSupervise"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[2]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="CAS号" path="user.name">
					<n-input
						v-model:value="form_details.user.name"
						placeholder="请输入CAS号"
						:disabled="disabled"
					/>
				</n-form-item>
				<n-form-item label="是否剧毒" path="user.isPoison">
					<n-select
						v-model:value="form_details.user.isPoison"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[2]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="是否易制毒" path="user.isPrecursor">
					<n-select
						v-model:value="form_details.user.isPrecursor"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[2]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="负责人" path="user.dutyMan">
					<n-input
						v-model:value="form_details.user.dutyMan"
						placeholder="输入负责人"
						:disabled="disabled"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="联系方式" path="user.phone">
					<n-input
						v-model:value="form_details.user.phone"
						placeholder="输入联系方式"
						:disabled="disabled"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="储存位置" path="user.saveLoacation">
					<n-select
						v-model:value="form_details.user.saveLoacation"
						placeholder="Select"
						:disabled="disabled"
						:options="stateOptions[3]"
						class="chemicalPopFormSelect"
					/>
				</n-form-item>
				<n-form-item label="经纬度" path="user.location">
					<n-input
						v-model:value="form_details.user.location"
						clearable
						disabled="true"
						placeholder="点击按钮获取定位"
						:style="{ width: '170px' }"
					/>
					<n-icon
						:component="LocationSharp"
						size="30"
						:style="{ cursor: 'pointer', color: 'red' }"
						@click="locationFun"
					/>
				</n-form-item>
				<n-form-item label="上传附件" path="user.uploadValue">
					<n-upload>
						<n-button :disabled="disabled">上传附件</n-button>
					</n-upload>
				</n-form-item>
				<n-form-item label="备注" path="user.remark">
					<n-input
						v-model:value="form_details.user.remark"
						placeholder="请输入备注"
						type="textarea"
						:disabled="disabled"
						:style="{ width: '520px' }"
						maxlength="200"
						:autosize="{
							minRows: 3,
							maxRows: 5,
						}"
					/>
				</n-form-item>
			</n-form>
			<template #footer>
				<n-space>
					<!-- v-if="form_details.name !== '详情'" -->
					<n-button
						type="info"
						v-if="form_details.name !== '详情'"
						@click="onSubmit"
						>确认</n-button
					>
					<!-- {{form_details.name !== '详情' ? '取消' : '关闭'}} -->
					<n-button type="info" @click="onCancel">
						{{ form_details.name !== '详情' ? '取消' : '关闭' }}
					</n-button>
				</n-space>
			</template>
		</n-modal>
		<!-- 地图选点弹窗 -->
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
import port from '@/axios/chemical';
import { LocationSharp } from '@vicons/ionicons5';
import mapBox from '@components/mapBox/index.vue';

const message = useMessage();

// ---------------------------------- 查询数据、重置查询信息 start -----------------------------
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
		getList(queryInfo.value);
	}
	// getList(params)
	// throttle(query, 3000)()
};
// 查询条件表单
let queryInfo = ref<any>({
	companyName: '', // 企业
	dangerName: '', // 危险品名称
	dangerVariy: '', // 危险品类别
	industry: '', // 行业
	isPoison: '', // 是否剧毒
	isPrecursor: '', // 是否易制毒
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
// ---------------------------------- 下拉列表 start -----------------------------
/**
 * 获取下拉框数据列表
 *  @param {number} num 类型代码
 *  危化品类别= 23
    存储方式=31
    行业=6
    危险工艺类型=24
    危险源类型=1
    是否=30
 */
const getPullDownData = () => {
	// 危化品类别= 23
	port.dictionaries({ typeCode: 23 }).then((res: any) => {
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
	// 行业=6
	port.dictionaries({ typeCode: 6 }).then((res: any) => {
		if (res.code === 200) {
			stateOptions.value[1] = [];
			res.data.forEach((e: any, i: any) => {
				stateOptions.value[1].push({
					label: e.name,
					value: e.value,
					code: e.value,
				});
			});
		}
	});
	// 是否=30
	port.dictionaries({ typeCode: 30 }).then((res: any) => {
		if (res.code === 200) {
			stateOptions.value[2] = [];
			res.data.forEach((e: any, i: any) => {
				stateOptions.value[2].push({
					label: e.name,
					value: e.value,
					code: e.value,
				});
			});
		}
	});
	// 存储方式=31
	port.dictionaries({ typeCode: 31 }).then((res: any) => {
		if (res.code === 200) {
			stateOptions.value[3] = [];
			res.data.forEach((e: any, i: any) => {
				stateOptions.value[3].push({
					label: e.name,
					value: e.value,
					code: e.value,
				});
			});
		}
	});
	// 危险源类型=1
	port.dictionaries({ typeCode: 31 }).then((res: any) => {
		if (res.code === 200) {
			stateOptions.value[4] = [];
			res.data.forEach((e: any, i: any) => {
				stateOptions.value[1].push({
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

// ---------------------------------- 获取列表数据 start -----------------------------
// 获取数据列表
const getList = (obj: any = { current: 1 }) => {
	tableLoading.value = true;
	const basic_data = { size: pagination.pageSize, current: 1 };
	const data = { ...basic_data, ...obj };
	port
		.tableListData(data)
		.then((res: any) => {
			if (res.code === 200) {
				console.log(res, 'res11111111111111111111');
				tableData.length = 0;
				pagination.itemCount = res.data.total;
				pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
				pagination.page = data.current;
				let industryArr: any = [];
				let arr = stateOptions.value[1].forEach((it, index) => {
					industryArr.push(it.label);
					return it.label;
				});
				res.data.records.forEach((e: any, index: number) => {
					// console.log('222222value',industryArr)

					const obj: any = {
						num: (data.current - 1) * pagination.pageSize + index + 1,
						companyName: e.companyName, // 企业名称
						dangerName: e.dangerName, // 危险品名称
						dangerVariy: e.dangerVariy, // 危险品类别
						maxSize: e.maxSize, // 最大储量
						industry: industryArr[e.industry], // 行业
						isPoison: e.isPoison == 1 ? '是' : '否', // 是否剧毒
						isPrecursor: e.isPrecursor == 2 ? '否' : '是', // 是否易制毒
						yearSize: e.yearSize, // 年度总量
						cas: e.cas,
						id: e.id,
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
		title: '企业名称',
		key: 'companyName',
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
		title: '危险品名称',
		key: 'dangerName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '危险品类别',
		key: 'dangerVariy',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '最大储量',
		key: 'maxSize',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '年度总量',
		key: 'yearSize',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: 'CAS号',
		key: 'cas',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否剧毒',
		key: 'isPoison',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否易制毒',
		key: 'isPrecursor',
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
	console.log('pagination', pageSizes);
	getList();
};

// ---------------------------------- 表格 start -----------------------------
// 表格数据
let tableData = reactive([
	{
		num: 1, // 序号
		companyName: '', // 企业名称
		dangerName: '', // 危险品名称
		dangerVariy: '', // 危险品类别
		maxSize: '', // 最大储量
		industry: '', // 行业
		isPoison: '', // 是否剧毒
		isPrecursor: '', // 是否易制毒
		yearSize: '', // 年度总量
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
	name: '新增',
	user: {
		cas: '',
		companyId: '',
		companyName: '',
		dangerName: '',
		dangerVariy: '',
		dutyMan: '',
		endTime: '',
		fileUrl: [
			{
				createTime: '',
				exactType: '',
				fileName: '',
				id: '',
				startTime: '',
				type: '',
				url: '',
				userUpload: '',
				ywid: '',
			},
		],
		ide: '',
		industrye: '',
		isDelete: '',
		isPoisone: '',
		isPrecursore: '',
		isSupervise: '',
		maxSize: '',
		phonee: '',
		pointe: {
			createTime: '',
			id: '',
			latitude: '',
			longitude: '',
			plotting: '',
			startTime: '',
			vectorData: '',
			ywId: '',
		},
		remark: '',
		saveLoacation: '',
		saveWay: '',
		startTime: '',
		yearSize: '',
	},
	checked: [],
});
// 弹窗表单
let popForm = ref<any>({
	// 	companyName: '', // 企业
	// 	industry: '', // 行业
	// 	dangerName: '', // 危险品名称
	// 	dangerVariy: '', // 危险品类别
	// 	maxSize: '', // 最大储量
	// 	yearSize: '', // 年度总量
	// 	saveWay: '', // 储存方式
	// 	isSupervise: '', // 是否重点监管
	// 	cas: '', // cas号
	// 	isPoison: '', // 是否剧毒
	// 	isPrecursor: '', // 是否易制毒
	// 	dutyMan: '', // 负责人
	// 	phone: '', // 联系方式
	// 	saveLoacation: '', // 储存位置
	// 	location: '', // 经纬度
	// 	remark: '', // 备注
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
const update = () => {
	console.log('更新上传的数据', form_details.value.user);
	let data = form_details.value.user;
	port.formData(data).then((res: any) => {
		console.log('---------------------------------');
		// console.log('formData res',res)
		if (res.code === 200) {
			form_details.value.user = res.data;
			console.log('formData res', form_details.value.user);
			getList();
			message.success('保存成功');
		} else {
			message.error('保存失败');
		}
	});
};
// 表单确认提交
const onSubmit = () => {
	update();
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
		companyName: {
			required: true,
			message: '请输入企业名称',
			trigger: ['input', 'blur'],
		},
		industry: {
			required: true,
			message: '请输入行业',
			trigger: ['input', 'blur'],
		},
		dangerName: {
			required: true,
			message: '请输入危险品名称',
			trigger: ['input', 'blur'],
		},
		dangerVariy: {
			required: true,
			message: '请输入危险品类别',
			trigger: ['input', 'blur'],
		},
		maxSize: {
			required: true,
			message: '请输入最大储量',
			trigger: ['input', 'blur'],
		},
		saveWay: {
			required: true,
			message: '请输入储存方式',
			trigger: ['input', 'blur'],
		},
		isSupervise: {
			required: true,
			message: '请选择是否重点监管',
			trigger: ['input', 'blur'],
		},
		isPoison: {
			required: true,
			message: '请选择是否剧毒',
			trigger: ['input', 'blur'],
		},
		isPrecursor: {
			required: true,
			message: '请选择是否易制毒',
			trigger: ['input', 'blur'],
		},
		dutyMan: {
			required: true,
			message: '请输入责任人',
			trigger: ['input', 'blur'],
		},
		phone: {
			required: true,
			message: '请输入正确的联系方式',
			trigger: ['input', 'blur'],
			validator(rule: any, value: any) {
				if (!value) {
					return new Error('请输入联系方式');
				} else if (
					!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(value)
				) {
					return new Error('请输入十一位电话号码');
				}
				return true;
			},
		},
		saveLoacation: {
			required: true,
			message: '请输入存储位置',
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
	// console.log('详情方法1221', row.id);
	form_details.value.name = '编辑';
	disabled.value = false;
	selectByID(row.id);
	popShow.value = true;
};

// 根据id获取单条数据详情
const selectByID = (id: any) => {
	let industryArr: any = [];
	let arr = stateOptions.value[1].forEach((it, index) => {
		industryArr.push(it.label);
		return it.label;
	});
	port.selectOne({ id }).then((res: any) => {
		// console.log('根据id获取数据', res.data);
		if (res.code == 200) {
			console.log('industryArr', industryArr);

			form_details.value.user = res.data;
			form_details.value.user.companyName = res.data.companyName;
			form_details.value.user.cas = res.data.cas;
			form_details.value.user.dangerName = res.data.dangerName;
			form_details.value.user.dangerVariy = res.data.dangerVariy;
			form_details.value.user.dutyMan = res.data.dutyMan;
			form_details.value.user.saveLoacation = res.data.saveLoacation;
			form_details.value.user.saveWay = res.data.saveWay;
			form_details.value.user.fileUrl = res.data.fileUrl;
			// form_details.value.user.point = res.data.point;
			form_details.value.user.isSupervise =
				res.data.isSupervise == 1 ? '是' : '否';
			form_details.value.user.isPoison = res.data.isPoison == 1 ? '是' : '否';
			form_details.value.user.isPrecursor =
				res.data.isPrecursor == 1 ? '是' : '否';
			form_details.value.user.industry = industryArr[res.data.industry];

			// console.log('列表详情', form_details.value.user);
			// addDadosPre();
		}
	});
};
// 新增数据
const add = () => {
	disabled.value = false;
	Object.keys(form_details.value.user).forEach((key) => {
		form_details.value.user[key] = '';
	});
	form_details.value.name = '新增';
	openPop();
};
// 导出方法
const exportFile = (row?: any, index?: any) => {
	port
		.getCompanyWord(row.id || '')
		.then((res: any) => {
			console.log(res);
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '化学品清单.xlsx');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
		})
		.catch(function (error) {
			alert(error);
		});
	// console.log('导出方法', row, index);
};

// ---------------------------------- 位置 start -----------------------------
// 地图弹窗flag
const showMap: any = ref(false);
// 地图弹窗显示方法
const locationFun = () => {
	showMap.value = true;
};
// 可编辑flag
let disabled = ref(true);
// 获取点位信息方法
const getPoint = (point: any) => {
	form_details.value.user.location = point;
	showMap.value = false;
};
// 上传文件列表
// let fileList: any = ref([]);
// 文件数据
// const fileData: any = ref({
// 	fileName: '',
// });

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
			console.log('删除res', res);
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
	console.log('删除id获取', row, index);
	deleteFlag.value = true;
	deleteId.value = row.id;
};
// ---------------------------------- 生命周期 start -----------------------------
onMounted(() => {
	getPullDownData();
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
</style>
