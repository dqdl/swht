<template>
	<div class="news">
		<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
			<n-data-table
				:columns="data.columns"
				:data="data.data"
				:bordered="true"
				:pagination="pagination"
			/>
		</n-config-provider>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { NButton, zhCN, dateZhCN } from 'naive-ui';
import { getMyNewsData } from '../../http/api/myNews/index';
const props = defineProps({
	newsType: {
		type: Number,
		default: 0,
	},
});
const pagination = reactive({
	pageCount: 5,
	page: 1,
	pageSize: 10,
	pageSizes: [10, 20],
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
const datas: any = ref([
	{
		title: '我的通知',
		mesgnum: '99',
		disc: '未读通知数',
		columns: [
			{
				title: '编号',
				key: 'num',
			},
			{
				title: '标题',
				key: 'title',
			},
			{
				title: '内容',
				key: 'entity',
			},
		],
		data: [
			{ num: 1, title: 'Wonderwall', entity: '4:18' },
			{ num: 2, title: "Don't Look Back in Anger", entity: '4:48' },
			{ num: 3, title: 'Champagne Supernova', entity: '7:27' },
		],
	},
	{
		title: '我的任务',
		mesgnum: '94',
		disc: '未受理任务数',
		columns: [
			{
				title: '编号',
				key: 'no',
			},
			{
				title: '任务标题',
				key: 'title',
			},
			{
				title: '内容',
				key: 'content',
			},
		],
		data: [
			{ no: 1, title: 'xx园区巡检任务', content: 'xxxxxxxxxxx' },
			{ no: 2, title: 'xx园区巡检任务', content: 'xxxxxxxxxx' },
			{ no: 3, title: 'Champagne Supernova', content: '7:27' },
			{ no: 4, title: 'xx园区巡检任务', content: 'xxxxxxxxxxx' },
			{ no: 5, title: 'xx园区巡检任务', content: 'xxxxxxxxxx' },
			{ no: 6, title: 'Champagne Supernova', content: '7:27' },
			{ no: 7, title: 'xx园区巡检任务', content: 'xxxxxxxxxx' },
		],
	},
]);

let data: any = ref({});
onMounted(() => {
	data.value = datas.value[props.newsType];
	getList();
});
const getList = (params: any = { current: 1 }) => {
	const basicData = {
		current: pagination.page,
		size: pagination.pageSize,
		type: '',
		title: '',
	};

	const data = { ...basicData, ...params };
	if (props.newsType === 0) {
		getMyNewsData.getMyNews.myToBeReadList(data).then((res: any) => {
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
			datas.value[0].data = res.data.records;
		});
	} else {
	}
};
const changeData = (index: any) => {
	data.value = datas.value[index];
	// getList()
};
watch(
	() => props.newsType,
	() => {
		changeData(props.newsType);
	},
	{
		deep: true,
	}
);
</script>
<style lang="postcss" scoped>
.news {
	width: 710px;
	height: 451px;
	background: rgb(255, 255, 255);
	overflow: hidden;
	padding: 10px;
	.btns {
		width: 30%;
		margin: 10px;
		margin-top: 30px;
		display: flex;
		justify-content: space-between;
		span {
			padding: 5px 10px;
			font-size: 18px;
			background: rgb(96, 161, 235);
			color: #fff;
			border-radius: 5px;
			cursor: pointer;
		}
	}
	.content {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		.left {
			width: 30%;
			.title {
				font-size: 34px;
				font-weight: bold;
			}
			.msgBox {
				margin-top: 60px;
				width: 240px;
				height: 240px;
				border: 1px solid rgb(187, 182, 182);
				background: url('@/assets/images/header/file.png') no-repeat;
				background-size: 100% 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				p:nth-child(1) {
					font-size: 18px;
					font-weight: bold;
				}
				p:nth-child(2) {
					font-size: 28px;
					font-weight: bold;
				}
			}
		}
		.right {
			width: 69%;
			height: 520px;
			border: 1px solid rgb(167, 163, 163);
		}
	}
}
</style>
