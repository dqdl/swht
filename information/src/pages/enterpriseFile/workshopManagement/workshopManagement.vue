<template>
	<div class="accountManagement">
		<!-- topHead -->
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<n-space>
						<span>车间名称</span>
						<n-input
							v-model:value="queryInfo.workshopName"
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
								@keydown.enter.prevent
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="车间名称"
							path="user.workshopName"
						>
							<n-input
								v-model:value="form_details.user.workshopName"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="车间编号" path="user.workshopId">
							<n-input
								v-model:value="form_details.user.workshopId"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="层数" path="user.latlon">
							<n-input
								v-model:value="form_details.user.level"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
								type="number"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="面积（㎡） "
							path="user.manufacturer"
						>
							<n-input
								v-model:value="form_details.user.area"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
								type="number"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="建筑结构 " path="user.state">
							<n-select
								v-model:value="form_details.user.architectureStructure"
								:options="buildingStructures"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="火灾危险等级"
							path="user.administrator"
						>
							<n-select
								v-model:value="form_details.user.fireAccidentLevel"
								:options="dangerLevels"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="耐火等级"
							path="user.administrator"
						>
							<n-select
								v-model:value="form_details.user.fireToleranceLevel"
								:options="refractoryLevels"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="防火间距（米）" path="user.state">
							<n-input
								v-model:value="form_details.user.fireProtectionDistance"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
								type="number"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="负责人" path="user.state">
							<n-input
								v-model:value="form_details.user.manager"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="电话" path="phone">
							<n-input
								v-model:value="form_details.user.managerContact"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="form_details.name !== '详情' ? 13 : 12"
							label="车间定位"
							path="user.state"
						>
							<n-input
								v-model:value="form_details.user.location"
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
						<n-form-item-gi
							v-if="form_details.name !== '详情'"
							:span="24"
							label="车间图片上传"
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
						<n-form-item-gi :span="24" label="车间图片" path="user.state">
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
									<td>
										{{
											ele.file.url.split('/')[
												ele.file.url.split('/').length - 1
											]
										}}
									</td>
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
								v-model:value="form_details.user.remarks"
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
		<n-modal
			v-model:show="showMap"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 700px; height: 600px"
			title="车间定位"
		>
			<template #header-extra></template>
			<mapBox @getPoint="getPoint" @cancelGet="showMap = false"></mapBox>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
// vue
import { ref, reactive, h, onMounted } from 'vue';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
import mapBox from '@components/mapBox/index.vue';
// api
import api_car from '../../../axios/api/car/index';
import { LocationSharp } from '@vicons/ionicons5';
// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage();
const formMaxLength = 24;
/**
 * state_head
 */
// queryInfo
const queryInfo = reactive({
	workshopName: '',
});
const disabled = ref(true);
const showModal_newAdd = ref(false);
const showModal_delete = ref(false);
const form_details: any = reactive({
	name: '新增',
	user: {
		company: '企业名称',
		workshopName: '车间名称',
		workshopId: '车间编号',
		level: '层数',
		area: '面积',
		architectureStructure: '建筑结构',
		fireAccidentLevel: '火灾危险等级',
		fireToleranceLevel: '耐火等级',
		fireProtectionDistance: '防火间距',
		manager: '负责人',
		managerContact: '电话',
		location: '车间定位',
		remarks: '',
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
		workshopName: {
			required: true,
			message: '请输入车间名称',
			trigger: ['input', 'blur'],
		},
		workshopId: {
			required: true,
			message: '请输入车间编号',
			trigger: ['input', 'blur'],
		},
	},
});
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
	api_car
		.exportList(params)
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '车间管理.xlsx');
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
					// fileName: item.file.name?.includes('.')?item.file.name.split('.')[0]:''
				});
			});
			if (!fileUrl.length) {
				fileUrl.push({
					exactType: 'png',
					url: 'xxx',
				});
			}
			if (form_details.name === '新增') {
				const {
					company,
					workshopName,
					workshopId,
					level,
					area,
					architectureStructure,
					fireAccidentLevel,
					fireToleranceLevel,
					fireProtectionDistance,
					manager,
					managerContact,
					remarks,
					location,
				} = form_details.user;
				const data: any = {
					companyId: '131',
					ename: company,
					fileUrl,
					point: {
						id: '112',
						longitude: location?.includes(',') ? location.split(',')[0] : '',
						latitude: location?.includes(',') ? location.split(',')[1] : '',
					},
					level,
					area,
					architectureStructure,
					fireAccidentLevel,
					fireToleranceLevel,
					fireProtectionDistance,
					manager,
					managerContact,
					remarks,
					workshopId,
					workshopName,
				};
				for (let i in data) {
					if (!data[i]) {
						delete data[i];
					}
				}
				res = await api_car.newAdd({
					companyId: '131',
					params: data,
				});
			} else if (form_details.name === '编辑') {
				const {
					id,
					company,
					workshopName,
					workshopId,
					level,
					area,
					architectureStructure,
					fireAccidentLevel,
					fireToleranceLevel,
					fireProtectionDistance,
					manager,
					managerContact,
					remarks,
					location,
				} = form_details.user;
				let data: any = {
					id,
					companyId: '131',
					ename: company,
					fileUrl,
					point: {
						id: '112',
						longitude: location?.includes(',') ? location.split(',')[0] : '',
						latitude: location?.includes(',') ? location.split(',')[1] : '',
					},
					level,
					area,
					architectureStructure,
					fireAccidentLevel,
					fireToleranceLevel,
					fireProtectionDistance,
					manager,
					managerContact,
					remarks,
					workshopId,
					workshopName,
				};
				for (let i in data) {
					if (!data[i]) {
						delete data[i];
					}
				}
				res = await api_car.edit(data);
			}
			getList();

			showModal_newAdd.value = false;
			fileList.length = 0;
		} else message.error('请将信息填写完整');
	});
};
// 建筑结构
const buildingStructures = reactive([
	{
		label: '砌体',
		value: '砌体',
	},
	{
		label: '钢结构',
		value: '钢结构',
	},
	{
		label: '其他',
		value: '其他',
	},
]);
// 火灾危险等级
const dangerLevels = reactive([
	{
		label: '1级',
		value: '1级',
	},
	{
		label: '2级',
		value: '2级',
	},
	{
		label: '3级',
		value: '3级',
	},
]);
// 耐火等级
const refractoryLevels = reactive([
	{
		label: '1级',
		value: '1级',
	},
	{
		label: '2级',
		value: '2级',
	},
	{
		label: '3级',
		value: '3级',
	},
]);
// 展示地图组件
const showMap: any = ref(false);
const locationFun = () => {
	showMap.value = true;
};
const getPoint = (point: any) => {
	form_details.user.location = point;
	showMap.value = false;
};
let postUrl: any = api_car.uploadImg;
let uploadUrl: any = ref('');
let fileList: any = reactive([]);
const fileData: any = reactive({
	fileName: '',
});
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
		key: 'ename',
		// width: 120,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '车间名称',
		key: 'workshopName',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '车间编号',
		key: 'workshopId',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '负责人',
		key: 'manager',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	// {
	//     title: '车间照片',
	//     key: 'phone',
	//     // width: 160,
	//     ellipsis: {
	//         tooltip: true
	//     }
	// },
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
		ename: '',
		workshopName: '',
		workshopId: '',
		manager: '',
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

// 详情
const rowDetails = async (row: any, index: number) => {
	form_details.name = '详情';
	form_details.user = row;
	if (row.point && row.point.longitude && row.point.latitude) {
		form_details.user.location = row.point.longitude + ',' + row.point.latitude;
	}
	disabled.value = true;
	showModal_newAdd.value = true;
	fileList.length = 0;
	if (row.fileUrl && row.fileUrl.length) {
		row.fileUrl.forEach((item: any) => {
			fileList.push({
				event: '',
				file: {
					name: item.id,
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
	if (row.point && row.point.longitude && row.point.latitude) {
		form_details.user.location = row.point.longitude + ',' + row.point.latitude;
	}
	fileList.length = 0;
	if (row.fileUrl && row.fileUrl.length) {
		row.fileUrl.forEach((item: any) => {
			fileList.push({
				event: '',
				file: {
					name: item.id,
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
	form_details.user.workshopId = row.workshopId;
};
// 确认删除
const submitDelete = async () => {
	const id = form_details.user.workshopId;
	const res: any = await api_car.delete(id);
	if (res.code === 200) {
		getList();
	} else {
		console.log(`res.code====>${res.code}`);
	}
};
/**
 * methods_table
 */
// 查询
const query = () => {
	getList({ workshopName: queryInfo.workshopName });
};
// 重置
const reset = () => {
	queryInfo.workshopName = '';
	getList();
};
// 分页翻页
const handlePageChange = (currentPage: number) => {
	console.log(currentPage);
};
// 展示多少页
const handlePageSize = (pageSizes: number) => {
	console.log(pageSizes);
};
// 表格当前选中行
const handleCheck = async (rowKeys: any) => {
	console.log(rowKeys);
};
/**-----------------------------------------------------接口--------------------------------------------- */
// 获取列表数据
const getList = async (data?: any) => {
	tableLoading.value = true;
	const basicData = { current: 1, size: 10 };
	const params = { ...basicData, ...data };
	const res: any = await api_car.getList(params);
	console.log(res);
	if (res.code === 200) {
		// page
		pagination.itemCount = res.data.total;
		pagination.page = params.current;
		pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
		// table
		tableData.length = 0;
		res.data.records.forEach((item: any, i: number) => {
			item.company = item.ename;
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
	console.log('车间管理');
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
