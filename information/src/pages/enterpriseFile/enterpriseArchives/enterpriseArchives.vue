<template>
	<div class="enterpriseArchives">
		<div class="top">
			<blue-title :prop-value="'查询'" />
			<div class="main">
				<div class="left">
					<!--plat-->
					<!-- <n-space >
                        <span>用户平台</span>
                        <n-select
                            :style="{ width: '240px' }"
                            placeholder="选择平台"
                            v-model:value="queryInfo.roleCode"
                            :options="selectOptions"
                        />
                    </n-space> -->
					<!-- name -->
					<n-space>
						<span>企业名称</span>
						<n-input v-model:value="queryInfo.name" type="text" :style="{ width: '240px' }"
							placeholder="请输入名称" :maxlength="formMaxLength" clearable />
					</n-space>
					<!-- industy -->
					<!-- <n-space >
                        <span>所属行业</span>
                        <n-select
                            :style="{ width: '240px' }"
                            placeholder="选择行业"
                            v-model:value="queryInfo.roleCode"
                            :options="industyOptions"
                        />
                    </n-space> -->

					<!-- state -->
					<!-- <n-space >
                        <span>投产状态</span>
                        <n-select
                            :style="{ width: '240px' }"
                            placeholder="选择状态"
                            v-model:value="queryInfo.industy"
                            :options="stateOptions"
                        />
                    </n-space> -->
					<!--code-->
					<!-- <n-space >
                        <span>社会信用代码</span>
                        <n-input
                            type="text"
                            :style="{ width: '240px' }"
                            v-model:value="queryInfo.code"
                            placeholder="请输入代码"
                            :maxlength="formMaxLength"
                            clearable
                        />
                    </n-space> -->
					<!--address-->
					<!-- <n-space >
                        <span>地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <n-input
                            type="text"
                            :style="{ width: '240px' }"
                            v-model:value="queryInfo.address"
                            placeholder="请输入地址"
                            :maxlength="formMaxLength"
                            clearable
                        />
                    </n-space> -->
					<!--time-->
					<n-space>
						<span>成立时间</span>
						<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
							<n-date-picker v-model:value="queryInfo.time" :style="{ width: '240px' }" type="daterange"
								clearable />
						</n-config-provider>
					</n-space>
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
					<n-data-table :remote="true" :bordered="false" :columns="tableHead" :data="tableData"
						:pagination="pagination" :loading="tableLoading" :row-key="(row: any) => (row.code)"
						@update:page="handlePageChange" @update:checked-row-keys="handleCheck"
						@update:pageSize="handlePageSize" />
				</n-config-provider>
			</div>
			<div class="topright">
				<n-space>
					<n-button type="info" @click="exportFile">导出</n-button>
				</n-space>
			</div>
		</div>
		<n-modal v-model:show="showModal_delete" preset="dialog" type="error" :show-icon="false" title="删除"
			:content="delete_content" positive-text="确认" negative-text="取消" @positive-click="submitCallback()"
			@negative-click="cancelCallback"></n-modal>
		<n-modal v-if="detailFlag" v-model:show="detailFlag" class="custom-card" preset="card" :style="{
			width: '66%',
			height: '800px',
			overflow: 'auto',
			backgroundColor: '#eaf2f7',
			borderRadius: '15px',
		}" title="查看详情" size="huge" :bordered="false" :segmented="false">
			<!-- <template #header-extra></template>
            <n-form :model="form_details">
                <n-grid :cols="24" :x-gap="24">
                </n-grid>
            </n-form> -->
			<enterprise :id="contentId" :edit-flag="true"></enterprise>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, h, onMounted } from 'vue';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
// components
import blueTitle from '@components/public/title/index.vue';
import enterprise from '@components/enterpriseInformation/index.vue';
// api
import api_enterprise from '../../../axios/api/essentialInformation/index';
import { isTemplateNode } from '@vue/compiler-core';
import { dateFormat } from '../../../util/verification';
const queryInfo = ref({
	plat: '',
	industy: '',
	state: '',
	code: '',
	address: '',
	// time: [0, Date.now()],
	time: <any>ref(),
	name: '',
	roleCode: '',
	deptId: '',
});
// 详情弹窗状态值
let detailFlag = ref(false);
// 详情id
let contentId = ref('131');
const formMaxLength = ref(24);
const selectOptions = reactive([
	{
		label: '平台1',
		value: '0',
		code: '0',
	},
	{
		label: '平台2',
		value: '1',
		code: '1',
	},
]);
const industyOptions = reactive([
	{
		label: '教师',
		value: '0',
		code: '0',
	},
	{
		label: 'IT',
		value: '1',
		code: '1',
	},
]);
const stateOptions = reactive([
	{
		label: '已投产',
		value: '0',
		code: '0',
	},
	{
		label: '未投产',
		value: '1',
		code: '1',
	},
]);
const tableHead = reactive([
	// {
	//     type: 'selection',
	// },
	{
		title: '序号',
		key: 'index',
		// width: 80,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '企业名称',
		key: 'name',
		align: 'center',
		// width: 120,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '社会信用代码',
		key: 'account',
		// width: 120,
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '所属行业',
		key: 'deptName',
		align: 'center',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '归属平台',
		key: 'job',
		align: 'center',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '企业法人',
		key: 'phone',
		align: 'center',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '地址',
		key: 'role',
		align: 'center',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '成立时间',
		key: 'createTime',
		align: 'center',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '投产状态',
		key: 'touState',
		align: 'center',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否标绘',
		key: 'biao',
		align: 'center',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 200,
		fixed: 'right',
		render(row: object, index: number) {
			return h(
				NSpace,
				{
					justify: 'end',
				},
				[
					// h(
					//     NButton,
					//     {
					//         size: 'small',
					//         type: "warning",
					//         onClick: () => compile(row, index)
					//     },
					//     { default: () => '编辑' }
					// ),
					h(
						NButton,
						{
							size: 'small',
							type: 'info',
							onClick: () => details(row, index),
						},
						{ default: () => '详情' }
					),

					h(
						NButton,
						{
							size: 'small',
							type: 'info',
							onClick: () => downLoad(row, index),
						},
						{ default: () => '下载' }
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
const query = () => {
	console.log('数据查询');

	const params = dealQueryData();
	pagination.page = 1;
	console.log(queryInfo.value);
	console.log(queryInfo.value.name, queryInfo.value.time);
	if (queryInfo.value.time) {
		getCompanyDataList({
			EName: queryInfo.value.name,
			startTime: params.startTime,
			ecreateTime: params.endTime,
		});
	} else {
		getCompanyDataList({
			EName: queryInfo.value.name,
		});
	}
	// getList(params)
	// throttle(query, 3000)()
};

const handlePageChange = (currentPage: number) => {
	pagination.page = currentPage;
	// const params = dealQueryData();
	// getList({ current: currentPage, ...params })
	getCompanyDataList({ current: currentPage, size: pagination.pageSize });
};
const handleCheck = (rowKeys: any) => {
	if (rowKeys.length > 0) {
		delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`;
		form_details.checed = rowKeys;
	} else {
		delete_content.value = `确认删除吗？`;
		form_details.checed = [];
	}
};
const handlePageSize = (pageSizes: number) => {
	pagination.pageSize = pageSizes;
	// const params = dealQueryData();
	getCompanyDataList({ current: pagination.page, size: pageSizes });
};

const form_details = reactive({
	name: '新增',
	user: {
		name: '',
		account: '',
		deptName: '',
		deptId: '',
		job: '',
		role: '',
		phone: '',
		code: '',
	},
	checed: [],
});

const showModal_delete = ref(false);
const delete_content = ref('确认删除吗？');
const reset = () => {
	if (queryInfo.value.time || queryInfo.value.name) {
		queryInfo.value.time = null;
		queryInfo.value.name = '';
		getCompanyDataList();
	}
};
// 导出企业清单表格
const exportFile = () => {
	api_enterprise
		.getCompanyExcel()
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '企业档案清单.xlsx');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
			// var elink = document.createElement('a');
			// elink.download = '企业清单.xlsx';
			// elink.style.display = 'none';

			// var blob = new Blob([res]);
			// elink.href = URL.createObjectURL(blob);

			// document.body.appendChild(elink);
			// elink.click();

			// document.body.removeChild(elink);
		})
		.catch(function (error) {
			alert(error);
		});
};
// const compile = (row: any, index: number) => {};
const details = (row: any, index: number) => {
	console.log('详情按钮', row);
	detailFlag.value = true;
	contentId.value = row.id;
};
const rowDelete = (row: any, index: number) => {
	console.log(row);

	form_details.user.code = row.id;
	delete_content.value = '确认删除吗';
	showModal_delete.value = true;
};
const cancelCallback = () => {
	message.success('取消删除');
};
const message = useMessage();
const submitCallback = () => {
	let res: any;
	let current;

	// 单行删除
	api_enterprise.rowDelete(form_details.user.code).then((res: any) => {
		current = dealPage(2);
		// current = dealPage(2)
		showModal_delete.value = false;
		if (res.code === 200) {
			message.success('删除成功');
			const params = dealQueryData();
			getCompanyDataList();
		} else {
			message.success('删除失败');
		}
	});
};
const dealPage = (type: number): number => {
	let current: any, newPage;
	const lastPage = pagination.pageCount;
	if (type === 1) {
		newPage = Math.ceil(
			(pagination.itemCount - form_details.checed.length) / pagination.pageSize
		);
	} else if (type === 2) {
		newPage = Math.ceil((pagination.itemCount - 1) / pagination.pageSize);
	}
	current = lastPage === newPage ? pagination.page : newPage;
	return current;
};

const downLoad = (row: any, index: number) => {
	api_enterprise
		.getCompanyWord(row.id)
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', row.name + '详情.zip');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
		})
		.catch(function (error) {
			message.error('下载失败');
		});
};
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
const pagination = reactive({
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
const userType = 1;
//获取表格数据
const getCompanyDataList = (params: any = { current: 1 }) => {
	tableLoading.value = true;
	const basic_data = { size: pagination.pageSize, current: 1 };
	let query = {};
	if (queryInfo.value.time) {
		query = {
			EName: queryInfo.value.name,
			startTime: params.startTime,
			ecreateTime: params.endTime,
		}
	} else {
		query = {
			EName: queryInfo.value.name,
		}
	}
	console.log(21121212,query)
	const data = { ...basic_data, ...params, ...query };
	api_enterprise.getCompanyDataList(data).then((res: any) => {
		if (res.code === 200) {
			console.log('清单数据', res);
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
					account: item.trustNum ? item.trustNum : '',
					deptName: item.industry ? item.industry : '',
					job: item.platform ? item.platform : '',
					phone: item.corporate ? item.corporate : '',
					role: item.address ? item.address : '',
					createTime: item.createTime ? item.createTime : '',
					toustate: item.operationStatus ? '是' : '',
					biao: item.point ? '是' : '',
					id: item.id,
				};
				tableData.push(obj);
			});
		}
		tableLoading.value = false;
	});
};
const tableData = reactive([
	{
		key: 0,
		index: 1,
		name: '1111',
		account: '11111111',
		deptName: '1111111111',
		job: '1111111111',
		phone: '111111111',
		role: '111111111111',
		createTime: '1970-1-1',
		touState: '1111111',
		biao: '11111111',
	},
]);
const tableLoading = ref(false);
onMounted(() => {
	getCompanyDataList();
});
</script>

<style lang="postcss" scoped>
.enterpriseArchives {
	width: 100%;

	>div {
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

				>div {
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
		text-align: center;

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
