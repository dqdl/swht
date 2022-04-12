<!-- 法律法规 -->
<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
		<div class="enterpriseArchives">
			<div class="top">
				<blue-title :prop-value="'查询'" />
				<div class="query">
					<div class="left">
						<!-- type -->
						<n-space>
							<span>资料名称</span>
							<n-input
								v-model:value="queryInfo.name"
								type="text"
								:style="{ width: '160px' }"
								placeholder="请输入资料名称"
								clearable
							/>
						</n-space>
						<n-space>
							<span>类型</span>
							<n-select
								v-model:value="queryInfo.type"
								:options="pullDownData"
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
						<n-form-item-gi :span="24" label="企业名称" path="list.name">
							<n-input v-model:value="popForm.list.name" type="text" placeholder="点击选择企业" clearable />
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="类型" path="list.type">
							<n-select v-model:value="popForm.list.type" :options="pullDownData" />
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="描述" path="popForm.description">
							<n-input
								:disabled="popFormName == '详情'"
								v-model:value="popForm.list.description"
								placeholder="请输入描述"
								type="textarea"
								maxlength="200"
								:autosize="{
									minRows: 3,
									maxRows: 5,
								}"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="附件上传" path="popForm.state">
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
										>删除</n-button>
									</td>
								</tr>
							</table>
						</n-form-item-gi>
					</n-grid>
				</n-form>
				<template #footer>
					<n-space>
						<n-button type="info" @click="onSubmit">确认</n-button>
						<n-button type="info" @click="popShow = false">取消</n-button>
					</n-space>
				</template>
			</n-card>
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
import { Api } from '@/http/api/repository/lawsAndRegulations';
const message = useMessage();
const lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});
// 查询条件表单
let queryInfo = ref<any>({
	name: '', // 资料名称
	type: '', // 类型
});
// 法律法规下拉框数据
const pullDownData = ref([
	{ value: '法律', label: '法律' },
	{ value: '法规', label: '法规' },
]);
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
		title: '资料名称',
		key: 'name',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '类型',
		key: 'type',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '描述',
		key: 'description',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '创建日期',
		key: 'createTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '创建人员',
		key: 'uploadUser',
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
							// onClick: () => showModalFun(row, '编辑'),
						},
						{ default: () => '下载' }
					),
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
	list: {
		name: '', // 资料名称
		type: '', // 类型
		description: '', // 描述
	}
});
let popFormName = ref('新增');
// 弹窗开关状态
let popShow = ref<boolean>(false);
// 打开弹窗
const openPop = () => {
	popFormName.value = '新增';
	// 清空表单
	resetForm(popForm.value.list);
	fileList.length = 0;
	popShow.value = true;
};

// 表单校验规则
const rules = {

	list: {
		name: {
			required: true,
			message: '请输入',
			trigger: ['input', 'blur']
		},
		type: {
			required: true,
			message: '请选择',
			trigger: ['input', 'blur']
		},
	}

}
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
		queryInfo.value.name = '';
		queryInfo.value.type = '';
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
		type: queryInfo.value.type,
		name: queryInfo.value.name,
	};
	const paramsData = { ...basicData, ...params };
	let { data }: any = await Api.getList(paramsData);
	tableData.value = [];
	data.records && ((pagination as any).itemCount = data.total);
	data.records &&
		data.records.forEach((element: any, index: number) => {
			element.index = (data.current - 1) * pagination.pageSize + index + 1;
			tableData.value.push(element);
		});
};
// 获取的ID
let showId: any = '';
// 详情和修改
const showModalFun = async (row: any, val?: string) => {
	popForm.value.list = JSON.parse(JSON.stringify(row));
	popShow.value = true;
};
// 上传图片地址
const postUrl: any = `${window.urlConfig.fileUrl}/file/upload`;
let fileList: any = reactive([]);
let isTrue = ref(true);
// 上传图片
const handleFinish = ({ file, event }: any) => {
	message.success('上传成功');
	isTrue.value = true;
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
// 获取表单from
const formRef = ref<HTMLElement>();
// 新增/修改提交
const onSubmit = (e: any) => {
	e.preventDefault()
	const dragDivDom: any = formRef.value;
	dragDivDom.validate(async (errors: any) => {
		if (!errors) {
			let param = {};
			if (popFormName.value == '新增') {
				param = {
					fileUrl: '',
					// fileUrl: fileList,
					...popForm.value.list,
				};
			} else {
				param = {
					fileUrl: '',
					// fileUrl: fileList,
					id: showId,
					...popForm.value.list,
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
