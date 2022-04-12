<template>
	<div class="committeeNews">
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="query">
				<div class="left">
					<!-- type -->
					<n-space>
						<span>发文标题</span>
						<n-input
							v-model:value="queryInfo.title"
							type="text"
							:style="{ width: '160px' }"
							placeholder="请输入发文标题"
							clearable
						/>
					</n-space>
					<n-space>
						<span>发文人</span>
						<n-input
							v-model:value="queryInfo.name"
							placeholder="请输入发文人姓名"
							:style="{ width: '160px' }"
						/>
					</n-space>
					<!-- time -->
					<n-space>
						<span>发文时间</span>
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
		<div class="list">
			<blue-title :prop-value="'数据列表'" />
			<div class="tableList">
				<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
					<n-data-table
						ref="table"
						:remote="true"
						:bordered="false"
						:columns="tableHead"
						:data="tableData"
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
				<div class="btns">
					<n-space>
						<n-button type="info" @click="showDetail = true"
							>发文内容表单</n-button
						>
						<n-button type="info" @click="showDetail = false"
							>派发企业清单</n-button
						>
					</n-space>
				</div>
				<newsDetailBox
					v-if="showDetail"
					:detail-data="detailData"
				></newsDetailBox>
				<distributionPersonnelList
					v-else
					:detail-data="detailData"
				></distributionPersonnelList>
			</n-card>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, watch, reactive, h, ref } from 'vue';
import { NIcon, zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import newsDetailBox from '@/components/newsDetailBox/index.vue';
import distributionPersonnelList from '@/components/distributionPersonnelList/index.vue';
import blueTitle from '@components/public/title/index.vue';
import { dateFormat } from '../../../../util/verification';
import historicalDocData from '../../../../axios/api/historicalDocData/index';

// 发文人列表
const options: any = reactive([]);

// 查询条件
const queryInfo: any = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
	time: null,
	title: '',
	name: '',
});
// 重置按钮是否可用
let isCanUse: any = ref(true);
// 表头
const tableHead = reactive([
	{
		title: '序号',
		key: 'num',
		width: 80,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '发文类型',
		key: 'type',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '发文标题',
		key: 'title',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '发文主题',
		key: 'topic',
		align: 'center',
		width: 180,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '发文人',
		key: 'person',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '发文时间',
		key: 'sendTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '派发企业数量',
		key: 'sendNumber',
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
]);

let tableData: any = ref([
	// { num: 1, type: '管委会发文', content: '', title: 'Wonderwall', theme: '主题', person: '张三', sendTime: '2022-2-16', sendNumber: 11, readRange: '50%', downloadRange: '50%', status: false},
	// { num: 2, type: '管委会发文', content: '', title: "Don't Look Back in Anger", theme: '主题', person: '张三', sendTime: '2022-2-16', sendNumber: 11, readRange: '50%', downloadRange: '50%', status: false},
	// { num: 3, type: '管委会发文', content: '', title: 'Champagne Supernova', theme: '主题', person: '张三', sendTime: '2022-2-16', sendNumber: 11, readRange: '50%', downloadRange: '50%', status: true},
	// { num: 4, type: '管委会发文', content: '', title: 'Champagne Supernova', theme: '主题', person: '张三', sendTime: '2022-2-16', sendNumber: 11, readRange: '50%', downloadRange: '50%', status: true}
]);

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
const tableLoading = ref(false);
// 是否展示模态框
let showModal: any = ref(false);
// 当前点击的详情数据
let detailData: any = ref({});
let showDetail: any = ref(true);
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
	getList({ current: currentPage });
};

// 展示多少页
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	// const params = dealQueryData()
};
// 展示模态框
const showModalFun = (row: any) => {
	detailData.value = row;
	historicalDocData
		.getImage({
			functionIndustry: row.functionIndustry,
			id: row.id,
			type: 2,
		})
		.then((res: any) => {
			detailData.value.fileUrl = res.data.fileUrl;
			showModal.value = true;
			showDetail.value = true;
		});
};
watch(
	() => queryInfo,
	() => {
		if (queryInfo.name || queryInfo.title || queryInfo.time) {
			isCanUse.value = false;
		} else {
			isCanUse.value = true;
		}
	},
	{
		deep: true,
	}
);
// 获取列表
const getList = (params: any = { current: 1 }) => {
	tableLoading.value = true;
	const basicData: any = {
		current: 1,
		size: pagination.pageSize,
		type: 2,
		createuserName: queryInfo.name,
		title: queryInfo.title,
		// sendTime: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
		timeStart: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
		timeEnd: queryInfo.time ? dateFormat(queryInfo.time[0], 'y-m-d') : '',
	};
	for (let i in basicData) {
		if (!basicData[i]) {
			delete basicData[i];
		}
	}

	const data = { ...basicData, ...params };
	historicalDocData.getHistoricalList(data).then((res) => {
		pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
		(pagination as any).itemCount = res.data.total;
		res.data.records.forEach((e: any, index: number) => {
			e.num = index + 1;
			e.type = '政企通知';
		});
		tableData.value = res.data.records;
		tableLoading.value = false;
	});
};
onMounted(() => {
	getList();

	// 发文人列表
	// historicalDocData.getSendList({type: 0}).then((resp: any) => {
	//     resp.data.forEach((ele:any) => {
	//         options.push({
	//             label: ele.name,
	//             value: ele.name
	//         })
	//     });
	// })
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
	queryInfo.name = '';
	queryInfo.title = '';
	queryInfo.time = null;
	getList();
};
</script>

<style lang="postcss" scoped>
@import './docStyles.postcss';
</style>
