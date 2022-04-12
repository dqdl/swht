<template>
	<div class="myNews">
		<div class="left">
			<n-menu :options="menuOptions" />
		</div>
		<div class="right">
			<div class="top">
				<blue-title :prop-value="'查询'" />
				<div class="main">
					<div class="left">
						<!-- type -->
						<n-space>
							<span>类型</span>
							<n-select
								v-model:value="queryInfo.type"
								placeholder="请选择"
								:style="{ width: '160px !important' }"
								:options="options"
							/>
						</n-space>
						<n-space>
							<span>标题</span>
							<n-input
								v-model:value="queryInfo.title"
								type="text"
								:style="{ width: '140px' }"
								placeholder="请输入标题"
								clearable
							/>
						</n-space>
						<!-- time -->
						<n-space>
							<span>派发时间</span>
							<n-config-provider
								:locale="queryInfo.zhCN"
								:date-locale="queryInfo.dateZhCN"
							>
								<n-date-picker
									v-model:value="queryInfo.time"
									:style="{ width: '240px' }"
									type="daterange"
									clearable
								/>
							</n-config-provider>
						</n-space>
					</div>
					<div class="right">
						<n-space>
							<n-button type="info" @click="query">查询</n-button>
							<n-button type="warning" :disabled="isCanUse" @click="reset"
								>重置</n-button
							>
						</n-space>
					</div>
				</div>
			</div>
			<!-- table -->
			<div class="list">
				<blue-title :prop-value="'数据列表'" />
				<div v-if="currentType === 'toBeRead'" class="tableList">
					<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
						<n-data-table
							ref="table"
							:remote="true"
							:bordered="false"
							:columns="tableHeads.toBeRead"
							:data="tableDatas"
							:pagination="pagination"
							:loading="tableLoading"
							:row-key="(row: any) => row.id"
							@update:page="handlePageChange"
							@update:checked-row-keys="handleCheck"
							@update:pageSize="handlePageSize"
						/>
					</n-config-provider>
				</div>
				<div v-else class="tableList">
					<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
						<n-data-table
							ref="table"
							:remote="true"
							:bordered="false"
							:columns="tableHeads.read"
							:data="tableDatas"
							:pagination="pagination"
							:loading="tableLoading"
							:row-key="(row: any) => row.id"
							@update:page="handlePageChange"
							@update:checked-row-keys="handleCheck"
							@update:pageSize="handlePageSize"
						/>
					</n-config-provider>
				</div>
			</div>
			<n-modal v-model:show="showModal">
				<n-card
					style="width: 800px"
					title="发文详情"
					:bordered="false"
					size="huge"
					role="dialog"
					aria-modal="true"
					header-style="height: 60px;background:#eee;"
				>
					<div class="close" @click="showModal = false">×</div>
					<newsDetailBox
						:detail-data="detailData"
						@downloadTime="getDownloadTime"
					></newsDetailBox>
					<div v-if="currentType === 'toBeRead'" class="btns">
						<n-space>
							<n-button type="info" @click="sureRead">我已阅知</n-button>
							<!-- <a href="#" download="http://10.51.100.70:9000/sw-park/2022/02/21/1934d2c9-6181-44d9-b722-d61a769df587.pdf">下载</a> -->
						</n-space>
					</div>
				</n-card>
			</n-modal>
		</div>
	</div>
</template>

<script lang="ts" setup>
// vue
import { ref, reactive, watch, h, onMounted, computed } from 'vue';
// naive_ui
import { NIcon, zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';

import blueTitle from '@components/public/title/index.vue';
import newsDetailBox from '@/components/newsDetailBox/index.vue';
import { RouterLink } from 'vue-router';
import {
	LaptopOutline as WorkIcon,
	LogOutOutline as HomeIcon,
} from '@vicons/ionicons5';
import getMyNewsData from '../../../axios/api/myNews/index';
import { dateFormat } from '../../../util/verification';
function renderIcon(icon: any) {
	return () => h(NIcon, null, { default: () => h(icon) });
}
const menuOptions = [
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {},
					onClick: () => (currentType.value = 'toBeRead'),
				},
				{ default: () => '我的待阅' }
			),
		key: 'go-back-home',
		icon: renderIcon(HomeIcon),
	},
	{
		label: () =>
			h(
				RouterLink,
				{
					to: {},
					onClick: () => (currentType.value = 'read'),
				},
				{ default: () => '我的已阅' }
			),
		key: 'go-to-work',
		icon: renderIcon(WorkIcon),
	},
];

const tableLoading = ref(false);
// 查询条件
const queryInfo: any = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
	type: '',
	time: null,
	title: '',
});
// 发文类型
const options: any = reactive([
	{
		label: '管委会发文',
		value: '管委会发文',
	},
	{
		label: '企业上报',
		value: '企业上报',
	},
	{
		label: '政企通知',
		value: '政企通知',
	},
]);
// 当前展示（待阅、已阅）
let currentType = ref('toBeRead');
// 表头配置
const tableHeads = reactive({
	toBeRead: [
		{
			title: '序号',
			key: 'num',
			width: 80,
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
			title: '标题',
			key: 'title',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '主题',
			key: 'topic',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '单位/部门',
			key: 'deptName',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '姓名',
			key: 'name',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '派发时间',
			key: 'sendTime',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '操作',
			key: 'operation',
			align: 'center',
			width: 200,
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
								onClick: () => showModalFun(row),
							},
							{ default: () => '详情' }
						),
					]
				);
			},
		},
	],
	read: [
		{
			title: '序号',
			key: 'num',
			width: 80,
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
			title: '标题',
			key: 'title',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '主题',
			key: 'topic',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '单位/部门',
			key: 'deptName',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '姓名',
			key: 'name',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '派发时间',
			key: 'sendTime',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '阅知时间',
			key: 'receivedTime',
			align: 'center',
			ellipsis: {
				tooltip: true,
			},
		},
		{
			title: '操作',
			key: 'operation',
			align: 'center',
			width: 200,
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
								onClick: () => showModalFun(row),
							},
							{ default: () => '详情' }
						),
					]
				);
			},
		},
	],
});
// 当前点击的详情数据
let detailData: any = ref({});
// 表格总数据
let tableDatas: any = ref([
	// { num: 1, type: '管委会发文', content: '', title: 'Wonderwall', topic: '主题', deptName: '管委会', name: '张三', sendTime: '2022-2-16', receivedTime: '2022-2-16', status: false},
	// { num: 2, type: '管委会发文', content: '', title: "Don't Look Back in Anger", topic: '主题', deptName: '管委会', name: '张三', sendTime: '2022-2-16', receivedTime: '2022-2-16', status: false},
	// { num: 3, type: '管委会发文', content: '', title: 'Champagne Supernova', topic: '主题', deptName: '管委会', name: '张三', sendTime: '2022-2-16', receivedTime: '2022-2-16', status: true},
	// { num: 4, type: '管委会发文', content: '', title: 'Champagne Supernova', topic: '主题', deptName: '管委会', name: '张三', sendTime: '2022-2-16', receivedTime: '2022-2-16', status: true}
]);
// 是否展示模态框
let showModal: any = ref(false);
onMounted(() => {
	getList();
});

// 页码数据
const pagination = reactive({
	pageCount: 1,
	page: 1,
	pageSize: 10,
	pageSizes: [10, 20],
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});

// 重置按钮是否可用
let isCanUse: any = ref(true);
// 更新数据
const getList = (params: any = { current: 1 }) => {
	tableLoading.value = true;
	const basicData: any = {
		current: 1,
		size: pagination.pageSize,
		type: querytype.value,
		title: queryInfo.title,
		sendTime: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
	};
	for (let i in basicData) {
		if (!basicData[i]) {
			delete basicData[i];
		}
	}
	if (querytype.value === 0) {
		basicData.type = 0;
	}
	const data = { ...basicData, ...params };
	if (currentType.value === 'toBeRead') {
		getMyNewsData.myToBeReadList(data).then((res: any) => {
			pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
			(pagination as any).itemCount = res.data.total;
			res.data.records.forEach((e: any, index: number) => {
				e.num = index + 1;
				if (e.type == 0) {
					e.type = '管委会发文';
				} else if (e.type == 1) {
					e.type = '企业上报';
				} else {
					e.type = '政企通知';
				}
				//     e.fileUrl = [
				//     {
				//         name: 'test',
				//         type: 'doc',
				//         url: 'http://10.51.100.70:9000/sw-park/2022/02/21/6be04481-7ffb-4c27-80c5-d152b8bcebf8.doc'
				//     },
				//     {
				//         name: 'test2',
				//         type: 'xls',
				//         url: 'http://10.51.100.70:9000/sw-park/2022/02/21/3d94ebb1-32c0-41b4-9f25-19c692356734.xls'
				//     }
				// ]
			});
			tableDatas.value = res.data.records;
			tableLoading.value = false;
		});
	} else {
		getMyNewsData.myReadList(data).then((res: any) => {
			pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
			(pagination as any).itemCount = res.data.total;
			res.data.records.forEach((e: any, index: number) => {
				e.num = index + 1;
				if (e.type == 0) {
					e.type = '管委会发文';
				} else if (e.type == 1) {
					e.type = '企业上报';
				} else {
					e.type = '政企通知';
				}
			});
			tableDatas.value = res.data.records;
			tableLoading.value = false;
		});
	}
};
watch(
	() => currentType.value,
	() => {
		reset();
		getList();
	}
);
watch(
	() => queryInfo,
	() => {
		if (queryInfo.type || queryInfo.title || queryInfo.time) {
			isCanUse.value = false;
		} else {
			isCanUse.value = true;
		}
	},
	{
		deep: true,
	}
);
// 选中列
let index: any = ref([]);
const handleCheck = (row: any) => {
	// 处理
	console.log(row, 'wwewe');
	index.value = row; // 下标
};
// 页码切换
const handlePageChange = (currentPage: number) => {
	console.log('currentPage =>', currentPage);
	pagination.page = currentPage;
};

// 展示多少
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	getList();
	// const params = dealQueryData()
};
// 展示模态框
const showModalFun = (row: any) => {
	let type = null;
	if (row.type === '管委会发文') {
		type = 0;
	} else if (row.type === '企业上报') {
		type = 1;
	} else if (row.type === '政企通知') {
		type = 2;
	}
	let data = {
		id: row.sendId,
		type: type,
	};
	getMyNewsData.getImage(data).then((res: any) => {
		showModal.value = true;
		detailData.value = res.data;
		detailData.value.readState = currentType.value;
		detailData.value.sendId = row.sendId;
		detailData.value.id = row.id;
	});
};
let querytype = computed(() => {
	let type = null;
	if (queryInfo.type === '管委会发文') {
		type = 0;
	} else if (queryInfo.type === '企业上报') {
		type = 1;
	} else if (queryInfo.type === '政企通知') {
		type = 2;
	}
	return type;
});
let timer: any = ref(null);
// 查询方法
const query = () => {
	if (timer.value) {
		return;
	} else {
		timer.value = setTimeout(() => {
			getList();
			if (timer.value) {
				clearTimeout(timer.value);
				timer.value = null;
			}
		}, 200);
	}
};

// 重置方法
const reset = () => {
	queryInfo.type = '';
	queryInfo.title = '';
	queryInfo.time = null;
	getList();
};
let downloadTime: any = ref('');
const getDownloadTime = (time: any) => {
	downloadTime.value = time;
};

// 我已阅知
const sureRead = async () => {
	let receivedTime = dateFormat(new Date().getTime(), 'y-m-d');
	// alert(downloadTime.value)
	// alert(receivedTime)
	const data: any = {
		id: detailData.value.id,
		sendId: detailData.value.sendId,
		receivedTime,
		downloadTime: downloadTime.value,
	};
	for (let i in data) {
		if (!data[i]) {
			delete data[i];
		}
	}
	let res: any = await getMyNewsData.readSure(data);
	showModal.value = false;
	getList();
	// getMyNewsData.readSure({id: detailData.value.id, sendId: detailData.value.sendId}).then((res: any) => {
	//     showModal.value = false
	//     getList()
	// })
};
</script>

<style lang="postcss" scoped>
.myNews {
	width: 100%;
	height: 100%;
	display: flex;
	font-size: 14px;
	justify-content: space-between;
	> .left {
		width: 15%;
		font-size: 24px;
		color: #000;
		font-weight: bold;
		line-height: 50px;
		background: #fff;
		border-radius: 10px;
		padding-top: 20px;
		p {
			cursor: pointer;
			border-radius: 5px;
			text-indent: 2em;
		}
	}
	> .right {
		width: 83%;
		height: 100%;
		/* background: #fff; */
		border-radius: 10px;
		/* padding: 0 20px; */
		.top {
			height: 223px;
			background: #fff;
			border-radius: 10px;
			.main {
				height: calc(100% - 53px);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				/* align-items: center; */
				padding: 40px 20px;
				.left {
					display: flex;
					> div {
						display: flex;
						align-items: center;
						margin-right: 40px;
					}
				}
				.right {
					margin-left: 40px;
				}
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
}
.active {
	color: blue;
}
.close {
	font-size: 28px;
	border-radius: 50%;
	border: 1px solid #999;
	color: #999;
	width: 30px;
	height: 30px;
	text-align: center;
	line-height: 26px;
	position: absolute;
	top: 15px;
	right: 15px;
	z-index: 10;
	cursor: pointer;
}
.btns {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
