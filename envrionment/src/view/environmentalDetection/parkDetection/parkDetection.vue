<!-- 大气监测 -->
<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN" class="main">
		<div class="lf">
			<blue-title :prop-value="'监测站点'" />
			<div class="treeBox">
				<n-space>
					<div>
						<n-input
							v-model:value="queryTreeInfo.name"
							type="text"
							:style="{ width: '160px', marginLeft: '10px' }"
							placeholder="请输入资料名称"
							clearable
						/>
					</div>
					<div>
						<n-button type="info" @click="queryTree">查询</n-button>
					</div>
				</n-space>
				<div class="tree">
					<n-tree
						@update:checked-keys="updateCheckedKeys"
						@update:selected-keys="node_focus"
						:data="treeData"
						selectable
						key-field="key"
						default-expand-all
						cascade
						virtual-scroll
						style="height: 680px"
					></n-tree>
				</div>
			</div>
		</div>
		<div class="rg">
			<blue-title :prop-value="'数据列表'" />
			<div class="tableList">
				<n-form label-placement="left" :label-width="100" size="large">
					<n-space>
						<n-form-item label="数据类型">
							<n-select
								v-model:value="queryListInfo.type"
								placeholder="Select"
								:options="selectData"
								class="select"
								clearable
							/>
						</n-form-item>
						<n-form-item label="时间范围">
							<n-date-picker
								v-model:value="queryListInfo.timeRange"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="datetimerange"
								clearable
							/>
						</n-form-item>
						<n-form-item>
							<n-button type="info" @click="queryList">查询</n-button>
							<n-button type="warning">导出</n-button>
							<n-button type="info">折线图</n-button>
						</n-form-item>
					</n-space>
				</n-form>
				<n-data-table
					:remote="true"
					:columns="tableHead"
					:data="tableData"
					:pagination="pagination"
					:loading="tableLoading"
					:row-key="(row: any) => row.code"
					@update:page="handlePageChange"
					@update:pageSize="handlePageSize"
				/>
			</div>
		</div>
	</n-config-provider>
</template>
<script lang="ts" setup>
import blueTitle from '@components/public/title/index.vue';
import { ref, reactive, onMounted } from 'vue';
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import { dateFormat } from '@/util/verification';
import { port } from '@/http/api/parkDetection/parkDetection';

const message = useMessage();
// 树数据
let treeData = ref<any>([
	{
		label: '所有类别',
		key: '1',
		children: [
			{
				label: '功能区',
				key: '11',
				children: [],
			},
			{
				label: '风险等级',
				key: '12',
				children: [],
			},
		],
	},
	{
		label: '2所有类别',
		key: '2',
		children: [
			{
				label: '2功能区',
				key: '21',
				children: [],
			},
			{
				label: '2风险等级',
				key: '22',
				children: [],
			},
		],
	},
]);
// 树查询框
let queryTreeInfo = ref({
	name: '',
});
// 树查询按钮
const queryTree = () => {
	getTree();
};
// 获取左侧树
const getTree = () => {
	port.getTree().then((res: any) => {
		treeData.value = [];
		res.data.forEach((item: any) => {
			treeData.value.push({ label: item, key: item });
		});
	});
};

/**
 * 结点选中时的回调函数
 */
let selectOptins = ref([]);
// 单行列表点击选中
const node_focus = (evt: any) => {
	console.log(evt);
	selectOptins.value = evt;
};
const updateCheckedKeys = (v: any) => {
	selectOptins.value = v;
	console.log(v, 'vvvvvvvv');
};

// 数据类型下拉框
const selectData = ref([
	{ value: '分钟', label: '分钟' },
	{ value: '小时', label: '小时' },
	{ value: '天', label: '天' },
	{ value: '月', label: '月' },
]);
// 列表查询数据
let queryListInfo = reactive({
	type: '',
	timeRange: null,
});
// 表格加载动画flag
const tableLoading = ref(false);
// 表头
let tableHead = ref();
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
// 切换页面方法
const handlePageChange = (currentPage: number) => {
	pagination.page = currentPage;
};
// 页面数据条数方法
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
};
// 列表查询按钮
const queryList = () => {
	getList({ current: 1 });
};
// 获取列表数据
const getList = (params: any = { current: 1 }) => {
	tableLoading.value = true;

	let startTime = queryListInfo.timeRange
		? dateFormat(queryListInfo.timeRange[0], 'y-m-d h:m:s')
		: '';
	console.log(startTime);
	const basicData: any = {
		current: 1,
		pageSize: pagination.pageSize,
	};
	port
		.getList()
		.then((res: any) => {
			tableLoading.value = false;
			// 表头
			tableHead.value = [
				{
					title: '序号',
					key: 'index',
					align: 'center',
					ellipsis: {
						tooltip: true,
					},
				},
				{
					title: '时间',
					key: 'createTime',
					align: 'center',
					ellipsis: {
						tooltip: true,
					},
				},
			];
			res.data.model.forEach((item: any) => {
				item.align = 'center';
				item.ellipsis = { tooltip: true };
				tableHead.value.push(item);
			});
			// 列表数据
			tableData.value = [];
			res.data.page.records.forEach((ele: any, idx: number) => {
				ele.index = (pagination.page - 1) * pagination.pageSize + idx + 1;
				tableData.value.push(ele);
			});
		})
		.catch((error) => {
			message.error(error);
			tableLoading.value = false;
		});
};

onMounted(() => {
	getTree();
	getList();
});
</script>
<style lang="postcss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 350px auto;
	gap: 20px;
	> div {
		border-radius: 10px;
		background-color: #fff;
	}
	.lf {
		.treeBox {
			margin: 10px 0 0 10px;
			.tree {
				margin-top: 10px;
			}
		}
	}
	.rg {
		.tableList {
			padding: 14px 20px;
			.select {
				width: 200px;
			}
			.n-button {
				margin-left: 10px;
			}
		}
	}
}
</style>
