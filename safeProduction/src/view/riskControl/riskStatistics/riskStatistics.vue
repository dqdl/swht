/* * @Author: 吴文宇 * @Date: 2022-03-09 11:19:40 * @Last Modified by: 吴文宇 *
@Last Modified time: 2022-03-09 11:19:40 */
<template>
	<div class="enterpriseArchives">
		<div class="top">
			<blue-title :prop-value="'企业风险涉及情况'" />
			<div class="main">
				<div class="left">
					<div
						v-for="(item, index) in companyRisk"
						:key="index"
						class="infoBox"
						:style="`background:url(${item.img});`"
					>
						<div class="box" :style="`color:${item.color};`">
							<span>{{ item.title }}</span>
							<span>{{ item.num }} 个</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="list">
			<blue-title :prop-value="'风险点统计情况'" />
			<barCahrt
				v-if="barFlag"
				:id-name="educateBar.idName"
				:width="educateBar.width"
				:height="educateBar.height"
				:x-data="educateBar.xData"
				:data="educateBar.data"
				:style="educateBar.style"
				class="educateBar"
			>
			</barCahrt>
			<barCahrt1
				v-else
				:id-name="educateBar1.idName"
				:width="educateBar1.width"
				:height="educateBar1.height"
				:x-data="educateBar1.xData"
				:data="educateBar1.data"
				:style="educateBar1.style"
				class="educateBar1"
			>
			</barCahrt1>
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
					<n-button type="info" @click="levelFn">风险等级</n-button>
					<n-button type="info" @click="typeFn(0)">风险分类</n-button>
					<n-button type="info" @click="typeFn(1)">易发事故</n-button>
				</n-space>
			</div>
		</div>
		<!-- 删除确认弹窗 -->
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
import barCahrt from '@/components/echarts-bar/src/barChart.vue';
import barCahrt1 from '@/components/echarts-bars/src/barsChart.vue';
import { dateFormat } from '../../../util/verification';
// 引用图片
import red from '@/assets/images/riskControl/error.png';
import orange from '@/assets/images/riskControl/warning.png';
import yellow from '@/assets/images/riskControl/yellow.png';
import blue from '@/assets/images/riskControl/blue.png';
import noImg from '@/assets/images/riskControl/noImg.webp';
// api
import api_riskIdentification from '@/http/api/riskControl/riskIdentification';
// ------------------------------------------------state-------------------------------------------------
// 表格加载动画flag
const tableLoading = ref(false);
// 删除弹窗flag
const showModal_delete = ref(false);
// 详情弹窗flag
let detailFlag = ref(false);
// 图表flag
let barFlag = ref(true);
// ------------------------------------------------data-------------------------------------------------
// 弹窗显示内容
const delete_content = ref('确认删除吗？');
// 企业风险数据
let companyRisk = ref([
	{
		title: '重大风险点涉及企业数',
		num: 0,
		img: red,
		color: '#ff4924',
	},
	{
		title: '较大风险点涉及企业数',
		num: 0,
		img: orange,
		color: '#ff9924',
	},
	{
		title: '一般风险点涉及企业数',
		num: 0,
		img: yellow,
		color: '#ffc400',
	},
	{
		title: '低风险点涉及企业数',
		num: 0,
		img: blue,
		color: '#32a8ff',
	},
]);
// 详情数据
const form_details = ref({
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
// 最大长度限制
const formMaxLength = ref(24);
// 图表数据
let educateBar: any = ref({
	idName: 'educateBar',
	width: 875,
	height: 278,
	xData: ['重大风险', '较大风险', '一般风险', '低风险'],
	data: [
		{
			name: '学习教育',
			barWidth: 40,
			// data: [10, 20, 15, 17],
			data: [
				{
					value: 39,
					itemStyle: {
						color: '#ff4924',
					},
				},
				{
					value: 15,
					itemStyle: {
						color: '#ff9924',
					},
				},
				{
					value: 5,
					itemStyle: {
						color: '#ffc400',
					},
				},
				{
					value: 10,
					itemStyle: {
						color: '#32a8ff',
					},
				},
			],
			type: 'bar',
			itemStyle: {
				color: '#ded20c',
			},
		},
	],
	style: {
		fontColor: '#fff',
		fontSize: 16,
		top: '20%',
		bottom: '20%',
		left: '7%',
		right: '2%',
		xTextVertical: false, // x轴是否文字纵向
		barBackground: true,
		barBackgroundColor: 'rgba(110, 193, 244, 0.1)',
		yTitle: '企业数（个）',
		animate: 800,
	},
});
let educateBar1: any = ref({
	idName: 'educateBar',
	width: 1500,
	height: 278,
	xData: [],
	data: [
		{
			name: '重大风险',
			barWidth: 10,
			data: [],
			type: 'bar',
			itemStyle: {
				color: '#ff4924',
			},
		},
		{
			name: '较大风险',
			barWidth: 10,
			data: [],
			type: 'bar',
			itemStyle: {
				color: '#ff9924',
			},
		},
		{
			name: '一般风险',
			barWidth: 10,
			data: [],
			type: 'bar',
			itemStyle: {
				color: '#ffc400',
			},
		},
		{
			name: '低风险',
			barWidth: 10,
			data: [],
			type: 'bar',
			itemStyle: {
				color: '#32a8ff',
			},
		},
	],
	style: {
		fontColor: '#fff',
		fontSize: 14,
		top: '20%',
		bottom: '20%',
		left: '5%',
		right: '5%',
		xTextVertical: false, // x轴是否文字纵向
		barBackground: true,
		barBackgroundColor: 'rgba(110, 193, 244, 0.1)',
		yTitle: '风险点数',
		animate: 800,
		provideNumber: 2,
	},
});
// 风险等级表头
const tableHead = ref([
	// {
	//     type: 'selection',
	// },
	{
		title: '序号',
		key: 'index',
		width: 80,
		align: 'center',
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
		title: '企业名称',
		key: 'name',
		// width: 120,
		align: 'center',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '风险点名称',
		key: 'pointName',
		align: 'center',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
]);
// 风险等级
const riskLevel = reactive({
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
});
// 表格数据
const tableData = reactive([
	{
		key: 0,
		index: 1,
		riskLevel: '1111111',
		name: '111111111',
		riskName: '111111111',
	},
]);
// 页脚
const pagination = ref({
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
// ------------------------------------------------methods-------------------------------------------------
// 风险等级点击
const levelFn = () => {
	console.log('点击风险等级');
	tableHead.value[1] = riskLevel;
	if (tableHead.value.length == 5) {
		tableHead.value.pop();
	}
	barFlag.value = true;
};
// 风险分类点击
const typeFn = (index: number) => {
	console.log('点击风险分类');
	if (index == 0) {
		tableHead.value[1] = {
			title: '风险分类',
			key: 'riskType',
			align: 'center',
			width: 120,
			ellipsis: {
				tooltip: true,
			},
		};
		getRiskTypeData('风险');
		educateBar1.value.style.yTitle = '风险分类';
	} else {
		tableHead.value[1] = {
			title: '事故类型',
			key: 'damageType',
			align: 'center',
			width: 120,
			ellipsis: {
				tooltip: true,
			},
		};
		getRiskTypeData('事故');
		educateBar1.value.style.yTitle = '易发事故';
	}
	if (tableHead.value.length == 4) {
		tableHead.value.push(riskLevel);
	}
	barFlag.value = false;
};
// 消息提示方法注册
const message = useMessage();
//获取表格数据
const getCompanyDataList = (params: any = { current: 1 }) => {
	tableLoading.value = true;
	const basic_data = { size: pagination.value.pageSize, current: 1 };
	const data = { ...basic_data, ...params };
	api_riskIdentification.getFarmData(data).then((res: any) => {
		console.log('列表数据', res);
		if (res.code === 200) {
			tableData.length = 0;
			pagination.value.pageCount = Math.ceil(
				res.data.total / pagination.value.pageSize
			);
			pagination.value.page = data.current;
			pagination.value.itemCount = res.data.total;
			res.data.records.forEach((item: any, index: number) => {
				// const { name, account, deptName,job, phone,role, createTime, toustate,biao } = item

				const obj: any = {
					key: index,
					index: (data.current - 1) * pagination.value.pageSize + index + 1,
					name: item.ename,
					pointName: item.pointName,
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
					riskType: item.riskType,
					damageType: item.damageType,
					person: item.riskManager,
					phone: item.riskManagerContact,
					img: item.fileUrl.length ? item.fileUrl[0].url : noImg,
				};
				tableData.push(obj);
			});
		}
		tableLoading.value = false;
	});
};
// 获取风险等级数据
const getRiskLevelData = () => {
	api_riskIdentification.getRiskLevel().then((res: any) => {
		console.log('风险等级数据', res);
		if (res.code == 200) {
			// res.data
			educateBar.value.data[0].data[0].value = companyRisk.value[0].num =
				res.data.huge - 0;
			educateBar.value.data[0].data[1].value = companyRisk.value[1].num =
				res.data.high - 0;
			educateBar.value.data[0].data[2].value = companyRisk.value[2].num =
				res.data.mid - 0;
			educateBar.value.data[0].data[3].value = companyRisk.value[3].num =
				res.data.low - 0;
		}
	});
};
// 获取风险分类、易发事故数据
const getRiskTypeData = (choice: string) => {
	api_riskIdentification.getRiskType(choice).then((res: any) => {
		console.log('风险分类、易发事故数据', res);
		if (res.code == 200) {
			const newVal = Object.assign({}, educateBar1.value);
			newVal.xData = [];
			newVal.data.forEach((item: any) => {
				item.data = [];
			});
			res.data.forEach((item: any, index: number) => {
				newVal.xData.push(item.accidentAndType);
				newVal.data[0].data.push(item.huge);
				newVal.data[1].data.push(item.high);
				newVal.data[2].data.push(item.mid);
				newVal.data[3].data.push(item.low);
			});
			educateBar1.value = newVal;
			console.log('传入的值', educateBar1.value);
		}
	});
};
// 切换页面方法
const handlePageChange = (currentPage: number) => {
	pagination.value.page = currentPage;
	// getList({ current: currentPage, ...params })
	getCompanyDataList({ current: currentPage, size: pagination.value.pageSize });
};
// 页面数据条数方法
const handlePageSize = (pageSizes: number) => {
	pagination.value.pageSize = pageSizes;
	getCompanyDataList({ current: pagination.value.page, size: pageSizes });
};
// 选中行数方法
const handleCheck = (rowKeys: any) => {
	if (rowKeys.length > 0) {
		delete_content.value = `你选中了${rowKeys.length}条数据，确认删除吗？`;
		form_details.value.checed = rowKeys;
	} else {
		delete_content.value = `确认删除吗？`;
		form_details.value.checed = [];
	}
};
// 导出方法
const exportFile = (row?: any, index?: any) => {
	// api_enterprise
	// 	.getCompanyExcel()
	// 	.then((res: any) => {
	// 		const link = document.createElement('a');
	// 		const blob = new Blob([res]);
	// 		link.style.display = 'none';
	// 		link.href = URL.createObjectURL(blob);
	// 		link.setAttribute('download', '企业档案清单.xlsx');
	// 		document.body.appendChild(link);
	// 		link.click();
	// 		document.body.removeChild(link);
	// 		window.URL.revokeObjectURL(link.href);
	// 	})
	// 	.catch(function (error) {
	// 		alert(error);
	// 	});
	console.log('导出方法', row, index);
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
	getRiskLevelData();
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
				justify-content: space-between;
				align-items: center;
				padding-bottom: 30px;
				width: 100%;
				> .infoBox {
					width: 321px;
					height: 110px;
					.box {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-top: 20px;
						margin-left: 120px;
						width: 180px;
						height: 70px;
						font-size: 18px;
					}
				}
			}
		}
	}
	.list {
		position: relative;
		margin-top: 20px;
		width: 100%;
		.educateBar {
			margin: 0 auto;
			width: 875px;
		}
		.educateBar1 {
			margin: 0 auto;
			width: 1500px;
		}
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
