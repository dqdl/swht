<!-- 重大危险源 -->
<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
		<div class="enterpriseArchives">
			<div class="top">
				<blue-title :prop-value="'查询'" />
				<div class="query">
					<div class="left">
						<!-- type -->
						<n-space>
							<span>企业名称</span>
							<n-input
								v-model:value="queryInfo.companyName"
								type="text"
								:style="{ width: '160px' }"
								placeholder="请输入企业名称"
								clearable
							/>
						</n-space>
						<n-space>
							<span>行业</span>
							<n-select
								v-model:value="queryInfo.industry"
								:options="pullDown.industry"
								placeholder="请输入行业"
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
					<n-data-table
						:remote="true"
						:bordered="false"
						:columns="tableHead"
						:data="tableData"
						:pagination="pagination"
						:loading="tableLoading"
						@update:page="handlePageChange"
						@update:pageSize="handlePageSize"
					/>
				</div>
				<div class="topright">
					<n-space>
						<n-button type="primary" @click="openPop">新增</n-button>
						<n-button type="info" @click="exportFile">导出</n-button>
					</n-space>
				</div>
			</div>
		</div>

		<n-modal
			v-model:show="popShow"
			:bordered="false"
			:segmented="false"
			size="huge"
			class="custom-card"
			preset="card"
			:title="popFormName"
			:style="{
				width: '800px',
				height: '800px',
				overflow: 'auto',
				backgroundColor: '#ffffff',
				borderRadius: '15px',
			}"
		>
			<n-card :bordered="false">
				<n-form ref="formRef" :model="popForm" :rules="rules">
					<template #header-extra></template>
					<n-grid :cols="24" :x-gap="24">
						<n-form-item-gi
							:span="24"
							label="企业名称"
							path="popForm.companyName"
						>
							<!-- <n-input v-model:value="popForm.companyName" placeholder="请输入企业名称" /> -->
							<n-input
								v-model:value="popForm.companyName"
								type="text"
								placeholder="点击选择企业"
								clearable
								:disabled="true"
								@click="choiceCom"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="所属行业" path="popForm.industry">
							<n-select
								:disabled="popFormName == '详情'"
								v-model:value="popForm.industry"
								:options="pullDown.industry"
								placeholder="请输入行业"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="重大危险源名称"
							path="popForm.dangerName"
						>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.dangerName"
								placeholder="请输入重大危险源名称"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="危险源类型" path>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.dangerType"
								maxlength="5"
								placeholder="请输入危险源类型"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="主要危险性" path>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.mainDanger"
								maxlength="5"
								placeholder="请输入主要危险性"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="储存量" path>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.saveSize"
								maxlength="5"
								placeholder="请输入储存量"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="R值" path>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.rnumber"
								maxlength="5"
								placeholder="请输入R值"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="是否有监控" path>
							<n-select
								v-model:value="popForm.isMonitor"
								:disabled="popFormName == '详情'"
								placeholder="Select"
								:options="pullDown.yesNoSelect"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="危险区域" path>
							<n-input
								v-model:value="popForm.dangerArea"
								clearable
								:disabled="true"
								placeholder="点击按钮获取定位"
							/>
							<n-icon
								:component="LocationSharp"
								size="30"
								:style="{ cursor: 'pointer', color: 'red' }"
								@click="locationFun(1)"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="危险源坐标" path="popForm">
							<n-input
								v-model:value="popForm.point.plotting"
								clearable
								:disabled="true"
								placeholder="点击按钮获取定位"
							/>
							<n-icon
								:component="LocationSharp"
								size="30"
								:style="{ cursor: 'pointer', color: 'red' }"
								@click="locationFun(2)"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="监管人" path>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.superviseMan"
								maxlength="5"
								placeholder="请输入监管人"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="监管人联系电话" path>
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.phone"
								maxlength="5"
								placeholder="请输入监管人联系电话"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="储存位置" path>
							<!-- <n-input maxlength="5" placeholder="请先选择公司" /> -->
							<n-select
								:disabled="popFormName == '详情'"
								v-model:value="popForm.saveLocation"
								:options="pullDown.repositoryList"
								placeholder="请输入储存位置"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="附件上传" path="user.state">
							<n-upload
								ref="upload"
								:max="10"
								:multiple="true"
								:show-file-list="false"
								:disabled="popFormName == '详情'"
								:action="postUrl"
								@finish="handleFinish"
								@before-upload="beforeUpload"
							>
								<n-button :disabled="popFormName == '详情'">上传文件</n-button>
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
										<n-button v-if="popFormName !== '新增'" type="info">
											<a target="_blank" :href="ele.url">下载</a>
										</n-button>
										<n-button
											v-if="popFormName !== '详情'"
											type="error"
											:style="{ marginLeft: '5px' }"
											@click="delPng(ele.name)"
											>删除</n-button
										>
									</td>
								</tr>
							</table>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="备注" path="popForm.remark">
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.remark"
								placeholder="请输入备注"
								type="textarea"
								maxlength="200"
								:autosize="{
									minRows: 3,
									maxRows: 5,
								}"
							/>
						</n-form-item-gi>
					</n-grid>
				</n-form>
				<template #footer>
					<n-space>
						<n-button type="info" @click="onSubmit">确认</n-button>
						<n-button type="info" @click="onCancel">取消</n-button>
					</n-space>
				</template>
			</n-card>
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
			content="确认删除"
			positive-text="确认"
			negative-text="取消"
			@positive-click="onDeleteClick"
		></n-modal>
		<n-modal
			v-model:show="isShowCom"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 700px; height: 600px"
			title="公司列表"
		>
			<template #header-extra></template>
			<mTable @comEmit="getComInfo" />
		</n-modal>
	</n-config-provider>
</template>

<script setup lang="ts">
import blueTitle from '@components/public/title/index.vue';
import { ref, reactive, h, onMounted } from 'vue';
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import { LocationSharp } from '@vicons/ionicons5';
import mapBox from '@components/mapBox/index.vue';
import mTable from '../../safetySupervision/table/table.vue';
import port from '@/axios/chemical';
// 引入外部函数
import { dateFormat } from '../../../util/verification';
// api
import { Api } from '@/http/api/keyAndMajor/dangerSource';
import { commonApi } from '@/http/api/common/common';
const message = useMessage();
const lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});
// 查询条件表单
let queryInfo = ref<any>({
	companyName: '', // 企业名称
	industry: '', // 行业名称
});
// 重置表单方法
const resetForm = (obj: any) => {
	Object.keys(obj).forEach((key: string) => {
		if (obj[key] != null && typeof obj[key] == 'object') {
			resetForm(obj[key]);
		} else {
			obj[key] = '';
		}
	});
};
// 表头
let tableHead = reactive([
	{
		title: '序号',
		key: 'index',
		width: 80,
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
		title: '重大危险源名称',
		key: 'dangerName',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: 'R值',
		key: 'RNumber',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否有监控',
		key: 'isMonitor	',
		align: 'center',
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
							onClick: () => deleteById(row),
						},
						{ default: () => '删除' }
					),
				]
			);
		},
	},
]);
// 表格数据
let tableData = ref();
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
// 表格加载动画flag
const tableLoading = ref(false);
// 弹窗表单
let popForm = ref<any>({
	companyName: '', // 企业
	companyId: '', //企业id
	industry: '', // 行业
	dangerName: '', // 重大危险源名称
	dangerType: '', //危险源类型
	mainDanger: '', //主要危险性
	saveSize: '', //储存量
	rnumber: '', // r值
	isMonitor: '', //是否有监控
	dangerArea: '', //危险区域
	point: {
		latitude: '',
		longitude: '',
		plotting: '',
	},
	superviseMan: '', //监管人
	phone: '', //监管人联系电话
	saveLocation: '', //存储位置
	remark: '', //备注
});
let popFormName = ref('新增');
// 弹窗开关状态
let popShow = ref<boolean>(false);
// 打开弹窗
const openPop = () => {
	popFormName.value = '新增';
	// 清空表单
	resetForm(popForm.value);
	popShow.value = true;
};

// 表单校验规则
const rules = ref({
	popForm: {
		companyName: { required: true },
		industry: { required: true },
	},
});
// 区分地图是哪种坐标
let numMap: number = 0;
// 地图弹窗flag
const showMap: any = ref(false);
// 地图弹窗显示方法
const locationFun = (num: number) => {
	showMap.value = true;
	numMap = num;
};
// 可编辑flag
let disabled = ref(true);
// 获取点位信息方法
const getPoint = (point: any) => {
	if (numMap == 1) {
		popForm.value.dangerArea = point;
	} else {
		popForm.value.point.plotting = point;
	}
	// popForm.value.location = point;
	showMap.value = false;
};

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
let pullDown = ref({
	industry: [{}], // 行业
	yesNoSelect: [], // 是否
	repositoryList: [],
});
// 获取字典值
const getPullDownData = () => {
	commonApi.selectByTypeCode({ typeCode: 6 }).then((res: any) => {
		pullDown.value.industry = [];
		res.data &&
			res.data.forEach((element: any) => {
				pullDown.value.industry.push({
					label: element.name,
					value: element.name,
					code: element.code,
				});
			});
	});
	port.dictionaries({ typeCode: 30 }).then((res: any) => {
		pullDown.value.yesNoSelect = res.data;
	});
	Api.getHouseRepository().then((res: any) => {
		pullDown.value.repositoryList = res.data;
	});
};
// 查询方法
const query = () => {
	getList({ current: 1 });
};
// 重置方法
const reset = () => {
	let list = Object.values(queryInfo.value);
	let flag = list.some((val: any) => {
		return !!val;
	});
	if (flag) {
		queryInfo.value.companyName = '';
		queryInfo.value.industry = '';
		getList();
	}
};
// 展示多少
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	// const params = dealQueryData()
	getList();
};
// 页码切换
const handlePageChange = (currentPage: number) => {
	pagination.page = currentPage;
	getList({ current: currentPage });
};
// 获取表格列表
const getList = async (params: any = { current: 1 }) => {
	const basicData: any = {
		current: 1,
		pageSize: pagination.pageSize,
		industry: queryInfo.value.industry,
		companyName: queryInfo.value.companyName,
	};
	const paramsData = { ...basicData, ...params };
	let { data }: any = await Api.getList(paramsData);
	tableData.value = [];
	data.records && ((pagination as any).itemCount = data.total);
	data.records &&
		data.records.forEach((element: any, index: number) => {
			tableData.value.push({
				index: index + 1,
				id: element.id,
				companyName: element.companyName,
				industry: element.industry,
				dangerName: element.dangerName,
				isMonitor: element.isMonitor,
				RNumber: element.RNumber,
			});
		});
};
// 获取的ID
let showId: any = '';
// 详情和修改
const showModalFun = async (row: any, val?: string) => {
	popFormName.value = val as string;
	try {
		showId = row.id;
		fileList.length = 0;
		let data: any = await Api.selectById({ id: row.id });
		if (data.code == 200) {
			popForm.value.companyName = data.data.companyName;
			popForm.value.companyId = data.data.companyId;
			popForm.value.industry = data.data.industry;
			popForm.value.dangerName = data.data.dangerName;
			popForm.value.dangerType = data.data.dangerType;
			popForm.value.mainDanger = data.data.mainDanger;
			popForm.value.saveSize = data.data.saveSize;
			popForm.value.rnumber = data.data.rnumber;
			popForm.value.isMonitor = data.data.isMonitor;
			popForm.value.dangerArea = data.data.dangerArea;
			popForm.value.point = data.data.point;
			popForm.value.rviseMan = data.data.rviseMan;
			popForm.value.phone = data.data.phone;
			popForm.value.saveLocation = data.data.saveLocation;
			popForm.value.remark = data.data.remark;
		}
	} finally {
		popShow.value = true;
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
	popForm.value.companyId = row.companyId;
	popForm.value.companyName = row.ename;
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
// 删除弹窗开启状态
let deleteFlag = ref<boolean>(false);
// 删除对象id
let deleteRowId = ref(null);

// 删除单条数据
const deleteById = (row: any) => {
	deleteRowId.value = row.id;
	deleteFlag.value = true;
};
// 确认删除
const onDeleteClick = async () => {
	let data: any = await Api.deleteList({
		id: deleteRowId.value,
	});
	if (data.code === 200) {
		getList();
		pagination.page = 1;
		message.success(`${data.message}`);
		return;
	}
	message.error(`删除失败`);
};
// 表单取消
const onCancel = () => {
	popShow.value = false;
};
// 新增/修改提交
const onSubmit = async () => {
	let param = {};
	if (popFormName.value == '新增') {
		param = {
			fileUrl: fileList,
			...popForm.value,
		};
	} else {
		param = {
			fileUrl: fileList,
			id: showId,
			...popForm.value,
		};
	}
	let data: any = await Api.addList(param);
	if (data.code == 200) {
		popShow.value = false;
		getList();
		message.success(`${data.message}`);
	} else {
		message.error(`${data.message}`);
	}
};
// 导出
const exportFile = async () => {
	let data: any = await Api.export(queryInfo.value);
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
