<template>
	<div class="accountManagement">
		<!-- topHead -->
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<n-space>
						<span>企业名称</span>
						<n-input
							v-model:value="queryInfo.company"
							type="text"
							:style="{ width: '220px' }"
							placeholder="请输入车间名称"
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
		<!-- popup_newAdd and popup_form_datails-->
		<!-- popup_newAdd/details -->
		<n-modal
			v-model:show="showModal_newAdd"
			class="custom-card"
			preset="card"
			:style="{ width: '800px', height: '900px', overflowY: 'auto' }"
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
						<n-form-item-gi :span="12" label="物料名称" path="user.name">
							<n-input
								v-model:value="form_details.user.name"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="储存仓库" path="user.location">
							<n-input
								v-model:value="form_details.user.repository"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="储存方式" path="user.latlon">
							<n-select
								v-model:value="form_details.user.way"
								:options="storageMode"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="类别" path="user.manufacturer">
							<n-select
								v-model:value="form_details.user.classify"
								:options="materiaClass"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="危险类别 " path="user.state">
							<n-select
								v-model:value="form_details.user.dangerClassify"
								:options="dangerClass"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="最大储量"
							path="user.administrator"
						>
							<n-input
								v-model:value="form_details.user.maxSize"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="年产量" path="user.administrator">
							<n-input
								v-model:value="form_details.user.yearSize"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="是否重点监管" path="user.state">
							<n-select
								v-model:value="form_details.user.isImportant"
								:options="industryList"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="是否剧毒" path="user.state">
							<n-select
								v-model:value="form_details.user.isVirulent"
								:options="industryList"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="是否易致毒" path="user.state">
							<n-select
								v-model:value="form_details.user.isEasypoison"
								:options="industryList"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							v-if="form_details.name !== '详情'"
							:span="24"
							label="物料图片上传"
							path="user.state"
						>
							<n-upload
								:action="postUrl"
								type="multipart/form-data"
								:with-credentials="true"
								accept="*"
								method="POST"
								:multiple="false"
								headers="{ 'Content-Type':'multipart/form-data' }"
								:show-file-list="false"
								:disabled="disabled"
								:data="fileData"
								@finish="handleFinish"
								@preview="handlePreview"
								@success="hanld"
								@remove="removeList"
								@before-upload="beforeUpload"
							>
								<n-button>上传图片</n-button>
							</n-upload>
						</n-form-item-gi>
						<n-form-item-gi :span="24" label="物料图片" path="user.state">
							<table border="1" class="table">
								<tr class="tHead">
									<td>序号</td>
									<td>图片名称</td>
									<td>缩略图</td>
									<td v-if="form_details.name !== '详情'">操作</td>
								</tr>
								<tr v-if="!fileList.length" class="not">
									<td></td>
									<td colspan="2">暂无图片</td>
									<td></td>
								</tr>
								<tr v-for="(ele, index) in fileList" v-else :key="index">
									<td>{{ index + 1 }}</td>
									<td>{{ ele.file.fileName }}</td>
									<td>
										<img :src="ele.file.url" alt="" />
									</td>
									<td v-if="form_details.name !== '详情'">
										<n-button type="info" @click="downLoadPng(ele.file.url)"
											>下载</n-button
										>
										<n-button
											type="error"
											:style="{ marginLeft: '5px' }"
											@click="delPng(ele.file)"
											>删除</n-button
										>
									</td>
								</tr>
							</table>
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
		<!-- popup_delete-->
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
import { ref, reactive, h, onMounted, watch } from 'vue';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
// api
import api_material from '../../../axios/api/material/index';
// ------------------------------------------------vnode-------------------------------------------------
const uploadImage = ref();
// ------------------------------------------------state-------------------------------------------------
const message = useMessage();
const formMaxLength = 24;
/**
 * state_head
 */
// 查询条件
const queryInfo = reactive({
	company: '',
});

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
	// {
	//     type: 'selection',
	// },
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
		title: '物料名称',
		key: 'name',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '储存仓库',
		key: 'repository',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '类别',
		key: 'classify',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '危险类别',
		key: 'dangerClassify',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '最大储值',
		key: 'maxSize',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '年常量',
		key: 'yearSize',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否剧毒',
		key: 'isVirulent',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 300,
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
		name: '',
		repository: '',
		classify: '',
		dangerClassify: '',
		maxSize: '',
		yearSize: '',
		isVirulent: '',
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
 * form
 */
const disabled = ref(true);
// show_or_hidden_modal
const showModal_newAdd = ref(false);
const showModal_delete = ref(false);
// form_details
const form_details: any = reactive({
	name: '新增',
	user: {
		company: '企业名称',
		name: '物料名称',
		repository: '储存仓库',
		way: '储存方式',
		classify: '类别',
		dangerClassify: '危险类别',
		maxSize: '最大储存量',
		yearSize: '年产量',
		isImportant: '重点监管',
		isVirulent: '剧毒',
		isEasypoison: '易致毒',
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
		name: {
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

/**
 * methods_table
 */
// 查询
const query = () => {
	const { company } = queryInfo;
	getList({ company });
};
// 重置
const reset = () => {
	queryInfo.company = '';
};
// 新增
const newAdd = () => {
	form_details.name = '新增';
	fileList.length = 0;
	Object.keys(form_details.user).forEach((item) => {
		form_details.user[item] = '';
	});
	disabled.value = false;
	showModal_newAdd.value = true;
};
// 导出
const exportList = () => {
	const params = {};
	api_material
		.exportList(params)
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '企业物料管理.xlsx');
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
// 详情
const rowDetails = async (row: any, index: number) => {
	form_details.name = '详情';
	form_details.user = row;
	disabled.value = true;
	showModal_newAdd.value = true;
	fileList.length = 0;
	let resp: any = await api_material.getImage(row.id);
	if (resp.data.fileUrl.length) {
		resp.data.fileUrl.forEach((item: any) => {
			fileList.push({
				event: '',
				file: {
					fileName: item.fileName || item.id,
					url: item.url,
				},
			});
		});
	}
};
// 编辑
const rowEdit = async (row: any, index: number) => {
	form_details.name = '编辑';
	form_details.user = row;
	disabled.value = false;
	showModal_newAdd.value = true;
	fileList.length = 0;
	let resp: any = await api_material.getImage(row.id);
	if (resp.data.fileUrl.length) {
		resp.data.fileUrl.forEach((item: any) => {
			fileList.push({
				event: '',
				file: {
					fileName: item.fileName || item.id,
					url: item.url,
				},
			});
		});
	}
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
	const res: any = await api_material.delete(id);
	if (res.code === 200) {
		getList();
	} else {
		console.log(`res.code====>${res.code}`);
	}
};
// 分页翻页
const handlePageChange = (currentPage: number) => {
	getList({ current: currentPage, company: queryInfo.company });
};
// 展示多少
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	getList({
		current: 1,
		size: pagination.pageSize,
	});
};
// 表格当前选中行
const handleCheck = async (rowKeys: any) => {
	console.log(rowKeys);
};
// 表单确认
const sure = async () => {
	formRef.value?.validate(async (error: any) => {
		if (!error) {
			let res: any;
			let fileUrl: any = [];
			fileList.forEach((item: any) => {
				fileUrl.push({
					exactType: item.file.name?.includes('.')
						? item.file.name.split('.')[1]
						: 'png',
					url: item.file.url,
					fileName: item.file.name?.includes('.')
						? item.file.name.split('.')[0]
						: '',
				});
			});
			const mesg = () => {
				if (res.code === 200) {
					getList();
				} else {
					message.error('操作失败', { duration: 3000 });
					console.error(`${res.code}======>${res.message}`);
				}
			};
			if (form_details.name === '新增') {
				const {
					company,
					name,
					repository,
					way,
					classify,
					dangerClassify,
					maxSize,
					yearSize,
					isImportant,
					isVirulent,
					isEasypoison,
					remark,
				} = form_details.user;
				res = await api_material.newAdd({
					company,
					name,
					repository,
					way,
					classify,
					dangerClassify,
					fileUrl,
					'point.id': '112',
					maxSize: Number(maxSize),
					yearSize: Number(yearSize),
					isImportant,
					isVirulent,
					isEasypoison,
					remark,
				});
				mesg();
			}
			if (form_details.name === '编辑') {
				const {
					id,
					company,
					name,
					repository,
					way,
					classify,
					dangerClassify,
					maxSize,
					yearSize,
					isImportant,
					isVirulent,
					isEasypoison,
					remark,
				} = form_details.user;
				res = await api_material.edit({
					id,
					company,
					name,
					repository,
					way,
					classify,
					dangerClassify,
					fileUrl,
					'point.id': '112',
					maxSize: Number(maxSize),
					yearSize: Number(yearSize),
					isImportant,
					isVirulent,
					isEasypoison,
					remark,
				});
				mesg();
			}

			showModal_newAdd.value = false;
		} else message.error('请将信息填写完整');
	});
};
let postUrl: any = api_material.uploadImg;
let uploadUrl: any = ref('');
let fileList: any = reactive([]);
const handleFinish = ({ event, file }: { event: any; file: any }) => {
	// fileList.length = 0

	const {
		code,
		data: { name, url },
	} = JSON.parse(event.target.response);
	file.url = url;
	file.fileName = file.name.split('.')[0];
	// uploadUrl.value = url
	fileList.push({
		event,
		file,
	});
};
const handlePreview = (e: any) => {
	console.log(e, '999999');
};
const hanld = (e: any) => {
	console.log(e);
};
const removeList = (e: any) => {
	console.log(e, 'eeeeeeeeee');
	fileList.length = 0;
};
const fileData: any = reactive({
	fileName: '',
});
const beforeUpload = (data: any) => {
	if (
		data.file.file?.type !== 'image/png' &&
		data.file.file?.type !== 'image/jpeg'
	) {
		message.error('只能上传png格式的图片文件，请重新上传');
		return false;
	}
	fileData.fileName = data.file.file?.name.includes('.')
		? data.file.file?.name.split('.')[0]
		: '';
	return true;
};
const downLoadPng = (url: any) => {
	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url + '?response-content-type=application/octet-stream';
	// a.target='_blank'
	a.setAttribute('download', 'download.png');
	// a.download = data.url;
	document.body.appendChild(a);
	a.click();
	a.remove();
};
const delPng = (item: any) => {
	fileList.forEach((ele: any, index: number) => {
		if (item.name === ele.file.name) {
			fileList.splice(index, 1);
		}
	});
};
/**--------------------------------------------------接口------------------------------------------------ */
// 获取列表数据
const getList = async (data?: any) => {
	tableLoading.value = true;
	const basicData = { current: 1, size: 10 };
	const params = { ...basicData, ...data };
	const res: any = await api_material.getList(params);
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
// 储存方式
const storageMode: any = reactive([]);
// 类别
const materiaClass: any = reactive([]);
// 危险类别
const dangerClass: any = reactive([]);
// 所属行业
const industryList: any = reactive([]);
onMounted(() => {
	console.log('企业物料管理');
	getList();
	api_material.getListByCode('31').then((res) => {
		res.data.forEach((ele: any) => {
			storageMode.push({
				label: ele.name,
				value: ele.name,
			});
		});
	});
	api_material.getListByCode('22').then((res) => {
		res.data.forEach((ele: any) => {
			materiaClass.push({
				label: ele.name,
				value: ele.name,
			});
		});
	});
	api_material.getListByCode('1').then((res) => {
		res.data.forEach((ele: any) => {
			dangerClass.push({
				label: ele.name,
				value: ele.name,
			});
		});
	});
	api_material.getListByCode('30').then((res) => {
		res.data.forEach((ele: any) => {
			industryList.push({
				label: ele.name,
				value: ele.name,
			});
		});
	});
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
<!-- 这个是专为表格图片写的样式 -->
<style lang="postcss">
.tableDiv {
	width: 120px;
	height: 60px;
	overflow: hidden;
	.tableImage {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
.table {
	width: 100%;
	margin-bottom: 10px;
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
:deep(.n-card__content) {
	padding: 10px 40px;
}
</style>
