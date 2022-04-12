<template>
	<div class="accountManagement">
		<!-- topHead -->
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<n-space>
						<span>设施名称</span>
						<n-input
							v-model:value="queryInfo.requireName"
							type="text"
							:style="{ width: '220px' }"
							placeholder="请输入设施名称"
							:maxlength="formMaxLength"
							clearable
						/>
					</n-space>
					<n-space>
						<span>类别</span>
						<!-- <n-select
                            :style="{ width: '220px' }"
                            v-model:value="queryInfo.industry"
                            :options="bigClassQuery"
                        /> -->
						<n-cascader
							v-model:value="queryInfo.industry"
							:style="{ width: '220px' }"
							placeholder="类型"
							:options="bigClassQuery"
							check-strategy="all"
							:show-path="true"
							remote
							:on-load="handleLoad"
						/>
					</n-space>
					<n-space>
						<span>状态</span>
						<n-select
							v-model:value="queryInfo.status"
							:style="{ width: '220px' }"
							:options="platform"
						/>
					</n-space>
					<n-space>
						<span>检测时间</span>
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
						<n-form-item-gi :span="24" label="企业名称" path="user.comanyName">
							<n-input
								v-model:value="form_details.user.comanyName"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="安全设施名称"
							path="user.requireName"
						>
							<n-input
								v-model:value="form_details.user.requireName"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="大类" path="user.location">
							<n-select
								v-model:value="form_details.user.bigVariy"
								:options="bigClass"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="小类" path="user.latlon">
							<n-select
								v-model:value="form_details.user.smallVariy"
								:options="smallClass"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="检测时间"
							path="user.manufacturer"
						>
							<n-date-picker
								v-model:value="form_details.user.checkTime"
								:style="{ width: '100%' }"
								:disabled="disabled"
								type="date"
								clearable
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="到期时间"
							path="user.manufacturer"
						>
							<n-date-picker
								v-model:value="form_details.user.arriveTime"
								:style="{ width: '100%' }"
								:disabled="disabled"
								type="date"
								clearable
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="数量" path="user.state">
							<n-input
								v-model:value="form_details.user.number"
								clearable
								:disabled="disabled"
								type="number"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="状态" path="user.administrator">
							<n-select
								v-model:value="form_details.user.status"
								:options="platform"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="12"
							label="生产厂家"
							path="user.administrator"
						>
							<n-input
								v-model:value="form_details.user.produceFactory"
								clearable
								:maxlength="formMaxLength"
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="型号" path="user.state">
							<n-input
								v-model:value="form_details.user.requireNumber"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="负责人" path="user.state">
							<n-input
								v-model:value="form_details.user.dutyMan"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="电话" path="user.state">
							<n-input
								v-model:value="form_details.user.phone"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi :span="12" label="安装位置" path="user.state">
							<n-input
								v-model:value="form_details.user.loadLoaction"
								clearable
								:disabled="disabled"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							:span="form_details.name !== '详情' ? 13 : 12"
							label="定位"
							path="user.state"
						>
							<n-input
								v-model:value="form_details.user.address"
								clearable
								:disabled="true"
								placeholder="请点击右侧按钮获取定位"
							/>
							<n-icon
								v-if="form_details.name !== '详情'"
								:component="LocationSharp"
								size="30"
								:style="{ cursor: 'pointer' }"
								@click="locationFun"
							/>
						</n-form-item-gi>
						<n-form-item-gi
							v-if="form_details.name !== '详情'"
							:span="24"
							label="安全设施图片上传"
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
						<n-form-item-gi :span="24" label="安全设施图片" path="user.state">
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
			title="定位"
		>
			<template #header-extra></template>
			<mapBox @getPoint="getPoint" @cancelGet="showMap = false"></mapBox>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
// vue
import { ref, reactive, h, onMounted, watch } from 'vue';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
import mapBox from '@components/mapBox/index.vue';
// api
import api_facility from '../../../axios/api/facility/index';
import { dateFormat } from '../../../util/verification';
import { LocationSharp } from '@vicons/ionicons5';
// ------------------------------------------------vnode-------------------------------------------------
const uploadImage = ref();
// ------------------------------------------------state-------------------------------------------------
// 消息组件
const message = useMessage();
const formMaxLength = 24;
/**
 * state_head
 */
// queryInfo
const queryInfo: any = reactive({
	time: null,
	industry: '',
	status: '',
	requireName: '',
	bigVariy: '',
	smallVariy: '',
});
// 类别
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
// 状态
const platform: any = reactive([]);
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
		key: 'comanyName',
		// width: 120,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '安全设施名称',
		key: 'requireName',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '设施型号',
		key: 'requireNumber',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '大类',
		key: 'bigVariy',
		width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '小类',
		key: 'smallVariy',
		width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '检测时间',
		key: 'checkTime',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '到期时间',
		key: 'arriveTime',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '数量',
		key: 'number',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '状态',
		key: 'status',
		width: 60,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 300,
		fixed: 'center',
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
		comanyName: '',
		requireName: '',
		requireNumber: '',
		bigVariy: '',
		smallVariy: '',
		checkTime: '',
		arriveTime: 0,
		number: '',
		status: '',
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
// form_details
const form_details: any = reactive({
	name: '新增',
	user: {
		comanyName: '企业名称',
		requireName: '安全设施名称',
		bigVariy: '大类',
		smallVariy: '小类',
		arriveTime: 0,
		checkTime: 0,
		number: '数量',
		status: '状态',
		produceFactory: '生产厂家',
		requireNumber: '型号',
		dutyMan: '负责人',
		phone: '电话',
		loadLoaction: '安装位置',
		address: '定位',
		remark: '备注',
		id: '',
	},
});
const formRef: any = ref(null);
const rules: any = reactive({
	user: {
		comanyName: {
			required: true,
			message: '请输入企业名称',
			trigger: ['input', 'blur'],
		},
		requireName: {
			required: true,
			message: '请输入车间名称',
			trigger: ['input', 'blur'],
		},
	},
});
/**
 * methods_table
 */
// 查询
const query = () => {
	console.log(queryInfo);
	queryInfo.bigVariy = '';
	queryInfo.smallVariy = '';
	let checkTimeStart: string, checkTimeEnd: string, checkTime: string;
	bigClassQuery.forEach((ele: any) => {
		if (queryInfo.industry === ele.value) {
			queryInfo.bigVariy = queryInfo.industry;
		}
	});
	if (!queryInfo.bigVariy) {
		queryInfo.smallVariy = queryInfo.industry;
	}
	if (queryInfo.time != null) {
		checkTimeStart = dateFormat(queryInfo.time[0], 'y-d-m');
		checkTimeEnd = dateFormat(queryInfo.time[1], 'y-d-m');
		checkTime = dateFormat(queryInfo.time[0], 'y-d-m');
	} else {
		checkTimeStart = '';
		checkTimeEnd = '';
		checkTime = '';
	}
	const { requireName, status, bigVariy, smallVariy } = queryInfo;
	const params = {
		requireName,
		status,
		checkTimeStart,
		checkTimeEnd,
		bigVariy,
		smallVariy,
		// checkTime
	};
	getList({ ...params });
};
// 重置
const reset = () => {
	queryInfo.time = null;
	queryInfo.industry = '';
	queryInfo.status = '';
	queryInfo.requireName = '';
	queryInfo.bigVariy = '';
	queryInfo.smallVariy = '';
	getList();
};
// show_or_hidden_modal
const showModal_delete = ref(false);
// 详情
const rowDetails = async (row: any, index: number) => {
	form_details.name = '详情';
	row.arriveTime = row.arriveTime ? new Date(row.arriveTime).valueOf() : null;
	row.checkTime = row.checkTime ? new Date(row.checkTime).valueOf() : null;
	form_details.user = row;
	disabled.value = true;
	showModal_newAdd.value = true;

	fileList.length = 0;
	let resp: any = await api_facility.getImage(row.id);
	if (resp.data.fileUrl && resp.data.fileUrl.length) {
		resp.data.fileUrl.forEach((item: any) => {
			fileList.push({
				event: '',
				file: {
					fileName: item.fileName,
					url: item.url,
				},
			});
		});
	}
	if (
		resp.data.point &&
		resp.data.point.longitude &&
		resp.data.point.latitude
	) {
		form_details.user.address =
			resp.data.point.longitude + ',' + resp.data.point.latitude;
	}
	console.log(row);
};
// 编辑
const rowEdit = async (row: any, index: number) => {
	form_details.name = '编辑';
	let arriveTime = row.arriveTime ? new Date(row.arriveTime).valueOf() : null;
	let checkTime = row.checkTime ? new Date(row.checkTime).valueOf() : null;
	form_details.user = { ...row, arriveTime, checkTime };
	disabled.value = false;
	showModal_newAdd.value = true;
	fileList.length = 0;
	let resp: any = await api_facility.getImage(row.id);
	if (resp.data.fileUrl && resp.data.fileUrl.length) {
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
	if (
		resp.data.point &&
		resp.data.point.longitude &&
		resp.data.point.latitude
	) {
		form_details.user.address =
			resp.data.point.longitude + ',' + resp.data.point.latitude;
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
	const res: any = await api_facility.delete(id);
	if (res.code === 200) {
		getList();
	} else {
		console.log(`res.code====>${res.code}`);
	}
};
// 新增
const newAdd = () => {
	form_details.name = '新增';
	fileList.length = 0;
	Object.keys(form_details.user).forEach((item) => {
		if (item === 'arriveTime' || item === 'checkTime') {
			form_details.user[item] = null;
		} else form_details.user[item] = '';
	});
	disabled.value = false;
	showModal_newAdd.value = true;
};
// 导出
const exportList = () => {
	const params = {};
	api_facility
		.exportList(params)
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '安全设施管理.xlsx');
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
	console.log(queryInfo);
	getList({ current: currentPage });
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
					comanyName,
					requireName,
					bigVariy,
					smallVariy,
					arriveTime,
					checkTime,
					number,
					status,
					produceFactory,
					requireNumber,
					dutyMan,
					phone,
					loadLoaction,
					address,
					remark,
				} = form_details.user;
				res = await api_facility.newAdd({
					comanyName,
					requireName,
					bigVariy,
					smallVariy,
					fileUrl,
					arriveTime,
					checkTime,
					number,
					status,
					produceFactory,
					requireNumber,
					dutyMan,
					phone,
					loadLoaction,
					point: {
						id: '112',
						longitude: address.split(',')[0],
						latitude: address.split(',')[1],
					},
					remark,
				});
				mesg();
			}
			if (form_details.name === '编辑') {
				const {
					id,
					comanyName,
					requireName,
					bigVariy,
					smallVariy,
					arriveTime,
					checkTime,
					number,
					status,
					produceFactory,
					requireNumber,
					dutyMan,
					phone,
					loadLoaction,
					address,
					remark,
				} = form_details.user;
				res = await api_facility.edit({
					id,
					comanyName,
					requireName,
					bigVariy,
					smallVariy,
					arriveTime,
					checkTime,
					number,
					status,
					produceFactory,
					requireNumber,
					dutyMan,
					phone,
					loadLoaction,
					fileUrl,
					point: {
						id: '112',
						longitude: address.split(',')[0],
						latitude: address.split(',')[1],
					},
					remark,
				});
				mesg();
			}

			showModal_newAdd.value = false;
			fileList.length = 0;
		} else message.error('请将信息填写完整');
	});
};
// 展示地图组件
const showMap: any = ref(false);

const locationFun = () => {
	showMap.value = true;
};
const getPoint = (point: any) => {
	form_details.user.address = point;
	showMap.value = false;
};
// 大类查询树
const bigClassQuery: any = reactive([]);
let postUrl: any = api_facility.uploadImg;
let uploadUrl: any = ref('');
let fileList: any = reactive([]);
const fileData: any = reactive({
	fileName: '',
});
const handleFinish = ({ event, file }: { event: any; file: any }) => {
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
/**-----------------------------------------------------------接口-------------------------------------------------- */
// 获取列表数据
const getList = async (data?: any) => {
	tableLoading.value = true;
	const basicData = { current: 1, size: 10 };
	const params = { ...basicData, ...data };
	const res: any = await api_facility.getList(params);
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
			item.address = item.point
				? item.point.longitude + ',' + item.point.latitude
				: '';
			// item.arriveTime = (new Date(item.arriveTime)).valueOf()
			tableData.push(item);
		});
		tableLoading.value = false;
	} else {
		message.error('操作失败', { duration: 3000 });
		console.error(`${res.code}======>${res.message}`);
	}
};
// 大类
const bigClass: any = reactive([]);
// 大类
const smallClass: any = reactive([]);
const handleLoad = (option: any) => {
	return new Promise<void>((resolve) => {
		window.setTimeout(() => {
			option.children = [];
			api_facility.getBigClassTree().then((res) => {
				res.data.forEach((ele: any) => {
					if (ele.parentName && ele.parentName === option.value) {
						option.children.push({
							label: ele.name,
							value: ele.name,
						});
					}
				});
			});
			// option.children = []
			resolve();
		}, 200);
	});
};
onMounted(() => {
	console.log('安全设施管理');
	getList();
	api_facility.getListByCode('33').then((res) => {
		res.data.forEach((ele: any) => {
			platform.push({
				label: ele.name,
				value: ele.name,
			});
		});
	});
	// 大类小类组合
	api_facility.getBigClassTree().then((res) => {
		res.data.forEach((ele: any) => {
			if (!ele.parentCode) {
				bigClassQuery.push({
					label: ele.name,
					value: ele.name,
					depth: 1,
					isLeaf: false,
				});
				bigClass.push({
					label: ele.name,
					value: ele.name,
				});
			}
		});
	});
});
watch(
	() => form_details.user.bigVariy,
	() => {
		smallClass.length = 0;
		api_facility.getBigClassTree().then((res) => {
			res.data.forEach((ele: any) => {
				if (ele.parentName && ele.parentName === form_details.user.bigVariy) {
					smallClass.push({
						label: ele.name,
						value: ele.name,
					});
				}
			});
		});
	}
);
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
					/* width: 20%; */
					/* border: 1px solid #f00; */
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-right: 70px;
					margin-bottom: 20px !important;
				}
				> div:last-child {
					margin-bottom: 0px;
					margin-right: 0px;
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
