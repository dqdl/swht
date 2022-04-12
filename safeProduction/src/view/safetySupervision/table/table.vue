<template>
	<div>
		<div class="query">
			<div class="left">
				<!-- type -->
				<n-space>
					<span>企业名称</span>
					<n-input
						v-model:value="queryInfo.ename"
						type="text"
						:style="{ width: '145px' }"
						placeholder="请输入企业名称"
						clearable
					/>
				</n-space>
				<n-space>
					<span>法人代表</span>
					<n-input
						v-model:value="queryInfo.corporate"
						type="text"
						:style="{ width: '145px' }"
						placeholder="请输入企业名称"
						clearable
					/>
				</n-space>
				<n-space>
					<n-button type="info" @click="query">查询</n-button>
					<n-button type="warning" @click="reset">重置</n-button>
				</n-space>
			</div>
		</div>
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
			/>
		</n-config-provider>
	</div>
</template>
<script setup lang="ts">
import { h, reactive, onMounted, ref, defineEmits } from 'vue';
import { zhCN, dateZhCN, NButton, NSpace } from 'naive-ui';
import { commonApi } from '@/http/api/common/common';
// 数据列表
let tableLoading = ref(false);
// 页码数据
const pagination = reactive({
	page: 1,
	pageSize: 6,
	showSizePicker: false,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
// 查询条件
const queryInfo: any = reactive({
	ename: '',
	corporate: '',
});
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
		title: '企业名称',
		key: 'ename',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '法人代表',
		key: 'corporate',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '社会信用代码',
		key: 'trustNum',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		key: 'operation',
		align: 'center',
		width: 100,
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
						{ default: () => '选择' }
					),
				]
			);
		},
	},
]);
// 表格数据
let tableData: any = ref([
	{
		num: 1,
		ename: '',
		corporate: '',
		trustNum: '',
		companyId: '',
	},
]);
// 获取企业列表
const getList = async (params: any = { current: 1 }) => {
	tableLoading.value = true;
	let param = {
		current: pagination.page,
		size: pagination.pageSize,
		...queryInfo,
	};
	console.log(queryInfo, param);
	let Param = {
		...param,
		...params,
	};
	let { data }: any = await commonApi.getCommon(Param);
	tableData.value = [];
	data && ((pagination as any).itemCount = data.total);
	data &&
		data.records.forEach((element: any, index: number) => {
			tableData.value.push({
				num: index + 1,
				ename: element.ename,
				corporate: element.corporate,
				trustNum: element.trustNum,
				companyId: element.id,
			});
		});
	tableLoading.value = false;
};
// 点击选择
const emit = defineEmits(['comEmit']);
const showModalFun = (row: any) => {
	emit('comEmit', row);
};
// 页码切换
const handlePageChange = (currentPage: number) => {
	console.log('currentPage =>', currentPage);
	pagination.page = currentPage;
	getList({ current: currentPage });
};
// 查询
const query = () => {
	getList();
};
// 重置
const reset = () => {
	let list = Object.values(queryInfo);
	let flag = list.some((val: any) => {
		return !!val;
	});
	if (flag) {
		queryInfo.ename = '';
		queryInfo.corporate = '';
		getList();
	}
};
onMounted(() => {
	getList();
});
</script>
<style lang="postcss" scoped>
.query {
	height: calc(100% - 53px);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 20px 30px 0;
	.left {
		display: flex;
		> div {
			display: flex;
			align-items: center;
			margin-right: 10px;
		}
	}
}
</style>
