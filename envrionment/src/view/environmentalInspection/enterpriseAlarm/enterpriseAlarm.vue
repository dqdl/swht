<!-- 企业雨污排水口告警 -->
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
						<n-form-item label="监测站点" path="belong">
							<n-select
								:value="queryInfo.belong"
								placeholder="请输入监测站点"
								:options="stateOptions[0]"
								class="select"
							/>
						</n-form-item>
						<n-form-item label="告警类型" path="warningType">
							<n-select
								:value="queryInfo.warningType"
								placeholder="请选择告警类型"
								:options="stateOptions[1]"
								class="select"
							/>
						</n-form-item>
						<n-form-item label="告警时间">
							<n-date-picker
								:value="queryInfo.timeRange"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="datetimerange"
								clearable
							/>
						</n-form-item>
						<n-form-item>
							<n-button type="info" @click="query">查询</n-button>
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
						@update:page="handlePageChange"
						@update:pageSize="handlePageSize"
					/>
				</div>
			</div>
		</div>
	</n-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue';
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
import { port } from '../../../http/api/enterpriseAlarm';
import { LocationSharp } from '@vicons/ionicons5';
import { dateFormat } from '../../../util/verification';

const message = useMessage();
let lg = reactive({
	zhCN: zhCN,
	dateZhCN: dateZhCN,
});

// ---------------------------------- 查询数据、重置查询信息 start -----------------------------
// 查询方法
const query = () => {
	pagination.page = 1;
	// 查询flag
	// console.log('queryInfo',queryInfo)
	let queryFlag = false;
	for (let i in queryInfo) {
		// console.log('iiiiiiiiiiiiiiii',i)
		if (i) {
			queryFlag = true;
			break;
		}
	}
	if (queryFlag) {
		getList(queryInfo);
	}
};
// 查询条件
let queryInfo: {
	belong: string;
	timeRange: any;
	warningType: string;
	start: string;
	end: string;
} = reactive({
	warningType: '',
	timeRange: null,
	belong: '', // 站点
	start: '',
	end: '',
});
// 重置表单方法
const resetForm = (obj: any) => {
	Object.keys(obj).forEach((key: string) => {
		obj[key] = '';
	});
	queryInfo.timeRange = null;
};
// 重置查询表单
const resetQueryForm = () => {
	resetForm(queryInfo);
	getList();
};
// ---------------------------------- 获取列表数据 start -----------------------------
// 获取数据列表
const getList = (obj: any = { current: 1 }) => {
	tableLoading.value = true;
	// console.log('queryInfo',queryInfo)
	let startTime = queryInfo.timeRange
		? dateFormat(queryInfo.timeRange[0], 'y-m-d h:m:s')
		: '';
	let endTime = queryInfo.timeRange
		? dateFormat(queryInfo.timeRange[1], 'y-m-d h:m:s')
		: '';
	// console.log('start',startTime)
	// console.log('end',endTime)
	const basic_data = {
		size: pagination.pageSize,
		current: 1,
		belong: queryInfo.belong,
		warningType: queryInfo.warningType,
		start: startTime,
		end: endTime,
		choice: '水',
	};
	const data = { ...basic_data };
	// console.log('data 水',basic_data)
	port
		.getList(data)
		.then((res: any) => {
			if (res.code === 200) {
				// console.log(res,'res 水')
				tableData.length = 0;
				pagination.itemCount = res.data.total;
				pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
				pagination.page = data.current;
				res.data.records.forEach((e: any, index: number) => {
					// console.log('222222value',industryArr)
					const obj: any = {
						num: (data.current - 1) * pagination.pageSize + index + 1,
						belong: e.belong,
						warningType: e.warningType,
						createTime: e.createTime,
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
		width: 70,
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '监测站点',
		key: 'belong',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '告警类型',
		key: 'warningType',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '告警时间',
		key: 'createTime',
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '告警内容',
		key: 'content',
		align: 'center',
		ellipsis: {
			tooltip: true,
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

// ---------------------------------- 下拉列表 start -----------------------------
/**
 * 获取下拉框数据列表
 */
const getPullDownData = () => {
	// belong=30
	port.dictionaries({ typeCode: 38 }).then((res: any) => {
		// console.log('dictionaries res',res)
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
	// warningType=39
	port.dictionaries({ typeCode: 39 }).then((res: any) => {
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
};
// 下拉选项
const stateOptions = ref([
	[
		{
			label: '',
			value: '0',
			code: '0',
		},
		{
			label: '',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '',
			value: '0',
			code: '0',
		},
		{
			label: '',
			value: '1',
			code: '1',
		},
	],
]);
let selectData = ref([]);

// ---------------------------------- 表格 start -----------------------------
// 表格数据
let tableData = reactive([
	{
		num: 1, // 序号
		belong: '', // 监测站点
		warningType: '', // 告警类型
		createTime: '', // 告警时间
		content: '', // 告警内容
	},
]);
// 表格加载动画flag
const tableLoading = ref(false);

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
					width: 400px;
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
.n-card > .n-card__footer {
	margin: auto;
}
.n-form-item .n-form-item-blank {
	width: 370px;
}
</style>
