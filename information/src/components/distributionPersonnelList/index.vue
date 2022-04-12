<template>
	<div class="boxs">
		<div class="list">
			<table border="1">
				<tr class="tHead">
					<td>序号</td>
					<td>企业名称</td>
					<td style="width: 100px"></td>
				</tr>
				<tr v-for="(ele, index) in tableData" :key="index">
					<td>{{ ele.num }}</td>
					<td>{{ ele.name }}</td>
					<td>
						<img
							:src="ele.receivedTime ? readGreen : readRed"
							alt=""
							@mouseenter="showTime(ele)"
							@mouseleave="closeTime"
						/>
						<img
							:src="ele.downloadTime ? downloadGreen : downloadRed"
							alt=""
							@mouseenter="showTime2(ele)"
							@mouseleave="closeTime"
						/>
						<span v-if="ele.showTime1" class="time1">{{
							ele.receivedTime
						}}</span>
						<span v-if="ele.showTime2" class="time2">{{
							ele.downloadTime
						}}</span>
					</td>
				</tr>
			</table>
			<div class="pages">
				<n-pagination
					v-model:page="pagination.page"
					:page-count="pagination.pageCount"
				/>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive, h, ref, onMounted, watch } from 'vue';
import { zhCN, dateZhCN, NButton, NSpace, useMessage, NImage } from 'naive-ui';
import readRed from '@/assets/images/historyDoc/readRed.png';
import readGreen from '@/assets/images/historyDoc/readGreen.png';
import downloadRed from '@/assets/images/historyDoc/downloadRed.png';
import downloadGreen from '@/assets/images/historyDoc/downloadGreen.png';
import historicalDocData from '../../axios/api/historicalDocData/index';
const props = defineProps({
	detailData: {
		type: Object,
		// eslint-disable-next-line vue/require-valid-default-prop
		default: {},
	},
});
let data: any = ref({
	type: '',
	title: '',
	theme: '',
	content: '',
});
onMounted(() => {
	data.value = props.detailData;
	historicalDocData.getSendList({ id: props.detailData.id }).then((res) => {
		res.data.forEach((ele: any, index: number) => {
			ele.num = index + 1;
			ele.showTime1 = false;
			ele.showTime2 = false;
		});
		tableData = res.data;
		pagination.pageCount = Math.ceil(
			(res.data.length ? res.data.length : 1) / pagination.pageSize
		);
	});
});
let tableData: any = reactive([
	//   { num: '1', name: '福建邵武生物化学1科技有限公司', length: '4:18', receivedTime: '2020-03-04', downloadTime: '2020-03-04' },
	//   { num: '2', name: "福建邵武生物化学2科技有限公司", length: '4:48', receivedTime: '2020-03-04', downloadTime: '2020-03-04' },
	//   { num: '3', name: '福建邵武生物化学4科技有限公司', length: '7:27', receivedTime: '', downloadTime: '2020-03-04' },
	//   { num: '4', name: '福建邵武生物化学3科技有限公司', length: '7:27', receivedTime: '2020-03-04', downloadTime: '' }
]);
// 页码数据
const pagination = reactive({
	pageCount: 3,
	page: 1,
	pageSize: 10,
});
watch(
	() => pagination.page,
	() => {
		changePage();
	}
);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const changePage = () => {};

const receivedTime = ref(null);
const showTime = (item: any) => {
	tableData.value.forEach((ele: any) => {
		ele.showTime1 = false;
		ele.showTime2 = false;
	});
	tableData.value.forEach((ele: any) => {
		if (ele.name === item.name) {
			if (ele.receivedTime) {
				ele.showTime1 = true;
			}
		}
	});
};
const showTime2 = (item: any) => {
	tableData.value.forEach((ele: any) => {
		ele.showTime1 = false;
		ele.showTime2 = false;
	});
	tableData.value.forEach((ele: any) => {
		if (ele.name === item.name) {
			if (ele.downloadTime) {
				ele.showTime2 = true;
			}
		}
	});
};
const closeTime = () => {
	tableData.value.forEach((ele: any) => {
		ele.showTime1 = false;
		ele.showTime2 = false;
	});
};
</script>

<style lang="postcss" scoped>
.boxs {
	display: flex;
	flex-direction: column;
	position: relative;
	height: 728px;
}

.list {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	tr {
		height: 54px;
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
		position: relative;
		img {
			width: 20px;
			height: 20px;
			margin: 0 5px;
		}
		> span {
			position: absolute;
		}
		> .time1 {
			left: 36px;
			top: -18px;
			padding: 3px 5px;
			background: rgba(51, 51, 51, 0.822);
			border-radius: 5px;
			color: rgb(255, 255, 255);
		}
		> .time2 {
			left: 68px;
			top: -18px;
			padding: 3px 5px;
			background: rgba(51, 51, 51, 0.822);
			border-radius: 5px;
			color: rgb(255, 255, 255);
		}
	}
	.pages {
		margin-top: 15px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
