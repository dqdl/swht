/* * @Author: 吴文宇 * @Date: 2022-03-09 11:19:40 * @Last Modified by: 吴文宇 *
@Last Modified time: 2022-03-09 11:19:40 */
<template>
	<div class="enterpriseArchives">
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<!-- name -->
					<n-space>
						<span>企业名称</span>
						<n-input
							v-model:value="queryInfo.name"
							type="text"
							:style="{ width: '240px' }"
							placeholder="请输入名称"
							:maxlength="formMaxLength"
							clearable
						/>
					</n-space>
					<!-- riskName -->
					<n-space>
						<span>风险点名称</span>
						<n-input
							v-model:value="queryInfo.riskName"
							type="text"
							:style="{ width: '240px' }"
							placeholder="请输入风险点名称"
							:maxlength="formMaxLength"
							clearable
						/>
					</n-space>
					<!-- type -->
					<n-space>
						<span>伤害类型</span>
						<n-select
							v-model:value="queryInfo.injuryType"
							:style="{ width: '240px' }"
							placeholder="选择状态"
							:options="stateOptions[0]"
						/>
					</n-space>
					<!-- type -->
					<n-space>
						<span>风险类别</span>
						<n-select
							v-model:value="queryInfo.riskType"
							:style="{ width: '240px' }"
							placeholder="选择状态"
							:options="stateOptions[1]"
						/>
					</n-space>
					<!-- type -->
					<n-space>
						<span>风险等级</span>
						<n-select
							v-model:value="queryInfo.riskLevel"
							:style="{ width: '240px' }"
							placeholder="选择状态"
							:options="stateOptions[2]"
						/>
					</n-space>
					<!--time-->
					<!-- <n-space>
						<span>成立时间</span>
						<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
							<n-date-picker
								v-model:value="queryInfo.time"
								:style="{ width: '240px' }"
								type="daterange"
								clearable
							/>
						</n-config-provider>
					</n-space> -->
					<!-- button-->

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
					<!-- <n-button type="info" @click="exportFile">导出</n-button> -->
				</n-space>
			</div>
		</div>
		<n-modal
			v-model:show="showModal_delete"
			preset="dialog"
			type="error"
			:show-icon="false"
			title="删除"
			:content="delete_content"
			positive-text="确认"
			negative-text="取消"
			@positive-click="submitCallback()"
			@negative-click="cancelCallback"
		></n-modal>
		<n-modal
			v-if="detailFlag"
			v-model:show="detailFlag"
			class="custom-card"
			preset="card"
			:style="{
				width: '66%',
				height: '800px',
				overflow: 'auto',
				backgroundColor: '#eaf2f7',
				borderRadius: '15px',
			}"
			title="查看详情"
			size="huge"
			:bordered="false"
			:segmented="false"
		>
			<!-- <template #header-extra></template>
            <n-form :model="form_details">
                <n-grid :cols="24" :x-gap="24">
                </n-grid>
            </n-form> -->
			<!-- <enterprise :id="contentId" :edit-flag="true"></enterprise> -->
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import blueTitle from '@components/public/title/index.vue';
import { Ref, ref, reactive, h, onMounted, PropType, watch } from 'vue';

import { zhCN, dateZhCN, NButton, NSpace, useMessage, NImage } from 'naive-ui';

import { dateFormat } from '../../../util/verification';
import noImg from '@/assets/images/riskControl/noImg.webp';
// api
import api_moreRisk from '@/http/api/riskControl/moreRisk';
// ------------------------------------------------state-------------------------------------------------
// 表格加载动画flag
const tableLoading = ref(false);
// 删除弹窗flag
const showModal_delete = ref(false);
// 详情弹窗flag
let detailFlag = ref(false);
// ------------------------------------------------data-------------------------------------------------
// 弹窗显示内容
const delete_content = ref('确认删除吗？');
// title数据
const queryInfo: any = ref({
	plat: '',
	riskName: '',
	injuryType: '',
	riskType: '',
	riskLevel: '',
	address: '',
	// time: [0, Date.now()],
	time: <any>ref(),
	name: '',
	roleCode: '',
	deptId: '',
});
// 下拉选项
const stateOptions = ref([
	[
		{
			label: '爆炸',
			value: '0',
			code: '0',
		},
		{
			label: '腐蚀',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '危险化学品',
			value: '0',
			code: '0',
		},
		{
			label: '危险爆炸物',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '低风险',
			value: '0',
			code: '0',
		},
		{
			label: '中风险',
			value: '1',
			code: '1',
		},
		{
			label: '高风险',
			value: '2',
			code: '2',
		},
	],
]);
// 最大长度限制
const formMaxLength = ref(24);
// 表头
const tableHead = reactive([
	// {
	//     type: 'selection',
	// },
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
		key: 'name',
		// titleColSpan: 2,
		align: 'center',
		// width: 120,
		// rowSpan: (rowData, rowIndex) => (rowIndex === 0 ? rowIndex : 1),
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '风险等级',
		key: 'riskLevel',
		// width: 120,
		align: 'center',
		render(row: any) {
			return h(
				NButton,
				{
					strong: true,
					secondary: true,
					circle: true,
					size: 'medium',
					type: row.btnType,
					style: 'width: 100px',
				},
				{ default: () => row.riskLevel }
			);
		},
	},
	{
		title: '风险类别',
		key: 'riskType',
		align: 'center',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '伤害类型',
		key: 'injuryType',
		align: 'center',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '风险负责人',
		key: 'person',
		align: 'center',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '风险负责人联系方式',
		key: 'phone',
		align: 'center',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '风险点照片',
		key: 'smallImage',
		align: 'center',
		render(row: any, index: number) {
			return h(NImage, { width: '50', height: '50', src: row.img }, [
				// h("img", { class: "tableImage", src: row.img}),
				// h("img", { class: "tableImage", src: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" }),
			]);
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 160,
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
							size: 'medium',
							type: 'info',
							onClick: () => exportFile(row, index),
						},
						{ default: () => '导出风险告知卡' }
					),
				]
			);
		},
	},
]);
// 表格数据
const tableData = reactive([
	{
		key: 0,
		index: 1,
		name: 'aaaaaaa',
		riskLevel: '11111111',
		btnType: 'warning',
		riskType: '2222222222',
		injuryType: '3333333333',
		person: '张三',
		phone: '13511111111',
		img: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
	},
]);
// 页脚
const pagination = reactive({
	itemCount: 1,
	pageCount: 5, //总共显示几个页码
	page: 1, //当前显示页码
	pageSize: 10, //每页显示数据条数
	pageSizes: [10, 20],
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
// 详情数据
const form_details = reactive({
	name: '新增',
	user: {
		name: '',
		accournt: '',
		deptName: '',
		deptId: '',
		job: '',
		role: '',
		phone: '',
		code: '',
	},
	checed: [],
});
// ------------------------------------------------methods-------------------------------------------------
// 消息提示方法注册
const message = useMessage();
// 处理查询参数
const dealQueryData = () => {
	let startTime, endTime;
	if (queryInfo.value.time === undefined || queryInfo.value.time === null) {
		startTime = dateFormat(0, 'Y-m-d');
		endTime = dateFormat(Date.now(), 'Y-m-d');
	} else {
		startTime = dateFormat(queryInfo.value.time[0], 'Y-m-d');
		endTime = dateFormat(queryInfo.value.time[1], 'Y-m-d');
	}
	// const { name, deptName, roleCode, deptId } = queryInfo
	const params = {
		startTime,
		endTime,
	};
	return params;
};
//获取表格数据
const getCompanyDataList = (params: any = { current: 1 }) => {
	tableLoading.value = true;
	const basic_data = { size: pagination.pageSize, current: 1 };
	const data = { ...basic_data, ...params };
	api_moreRisk.getFarmData(data).then((res: any) => {
		if (res.code === 200) {
			console.log(res);
			tableData.length = 0;
			pagination.pageCount = Math.ceil(res.data.total / pagination.pageSize);
			pagination.page = data.current;
			pagination.itemCount = res.data.total;
			res.data.records.forEach((item: any, index: number) => {
				// const { name, account, deptName,job, phone,role, createTime, toustate,biao } = item

				const obj: any = {
					key: index,
					index: (data.current - 1) * pagination.pageSize + index + 1,
					name: item.ename,
					riskLevel:
						item.riskLevel == '488'
							? '重大风险'
							: item.riskLevel == '487'
							? '较大风险'
							: item.riskLevel == '486'
							? '一般风险'
							: item.riskLevel == '485'
							? '低风险'
							: '暂无风险等级',
					btnType:
						item.riskLevel == '488'
							? 'error'
							: item.riskLevel == '487'
							? 'warning'
							: item.riskLevel == '486'
							? 'success'
							: 'info',
					riskType: arrayLookup(
						stateOptions.value[1],
						'code',
						item.riskType,
						'label'
					),
					injuryType: arrayLookup(
						stateOptions.value[0],
						'code',
						item.damageType,
						'label'
					),
					person: item.riskManager,
					phone: item.riskManagerContact,
					img: item.fileUrl.length ? item.fileUrl[0].url : noImg,
					id: item.id,
				};
				tableData.push(obj);
			});
		}
		tableLoading.value = false;
	});
};
// 获取下拉选项
const getSelectOption = () => {
	let arr = [34, 35, 36];
	arr.forEach((item: any, index: any) => {
		api_moreRisk.getSelectOption(item).then((res: any) => {
			if (res.code == 200) {
				stateOptions.value[index] = [];
				res.data.forEach((e: any, i: any) => {
					stateOptions.value[index].push({
						label: e.name,
						value: e.value,
						code: e.value,
					});
				});
			}
		});
	});
};
// 查询方法
const query = () => {
	console.log('数据查询', queryInfo.value);
	pagination.page = 1;
	// 查询flag
	let queryFlag = false;
	for (let i in queryInfo.value) {
		if (queryInfo.value[i]) {
			queryFlag = true;
			console.log('查询数据+++++++++++');
			break;
		}
	}
	console.log(queryFlag);
	if (queryFlag) {
		getCompanyDataList(queryInfo.value);
	}
	// getList(params)
	// throttle(query, 3000)()
};
// 重置方法
const reset = () => {
	console.log('重置方法');
	let queryFlag = false;
	for (let i in queryInfo.value) {
		if (queryInfo.value[i]) {
			queryFlag = true;
			queryInfo.value[i] = '';
		}
	}
	if (queryFlag) {
		getCompanyDataList();
	}
};
// 切换页面方法
const handlePageChange = (currentPage: number) => {
	pagination.page = currentPage;
	const params = dealQueryData();
	// getList({ current: currentPage, ...params })
	getCompanyDataList({ current: currentPage, size: pagination.pageSize });
};
// 页面数据条数方法
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	const params = dealQueryData();
	getCompanyDataList({ current: pagination.page, size: pageSizes });
};
// 选中行数方法
const handleCheck = (rowKeys: any) => {
	if (rowKeys.length > 0) {
		delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`;
		form_details.checed = rowKeys;
	} else {
		delete_content.value = `确认删除吗？`;
		form_details.checed = [];
	}
};
// 根据code获取value
let arrayLookup = (data: any, code: any, value: any, label: any) => {
	var targetValue = '';
	for (var i = 0; i < data.length; i++) {
		if (data[i][code] == value) {
			targetValue = data[i][label];
			break;
		}
	}
	return targetValue;
};
// 导出方法
const exportFile = (row?: any, index?: any) => {
	console.log(row);
	api_moreRisk
		.getCompanyWord(row.id || '')
		.then((res: any) => {
			console.log(res);
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '风险点位告知卡.zip');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
			message.success('导出成功');
		})
		.catch(function (error) {
			message.error('导出失败');
		});
};
// 删除弹窗确认方法
const submitCallback = () => {
	let res: any;
	let current;

	// 单行删除
	// api_enterprise.rowDelete(form_details.user.code).then((res: any) => {
	// 	current = dealPage(2);
	// 	// current = dealPage(2)
	// 	showModal_delete.value = false;
	// 	if (res.code === 200) {
	// 		message.success('删除成功');
	// 		const params = dealQueryData();
	// 		getCompanyDataList();
	// 	} else {
	// 		message.success('删除失败');
	// 	}
	// });
};
// 删除弹窗取消方法、
const cancelCallback = () => {
	message.success('取消删除');
};
// 详情方法
const details = (row?: any, index?: any) => {
	console.log('详情方法', row, index);
};
// 删除方法
const rowDelete = (row?: any, index?: any) => {
	console.log('详情方法', row, index);
};
onMounted(() => {
	getCompanyDataList();
	getSelectOption();
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
		/* overflow-x: auto; */

		.main {
			padding: 20px 20px 0 20px;
			.left {
				display: flex;
				flex-wrap: wrap;
				align-items: center;

				> div {
					width: 23%;
					/* border: 1px solid #f00; */
					display: flex;
					align-items: center;
					flex-shrink: 0;
					margin-bottom: 20px !important;
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
