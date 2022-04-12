<template>
	<div class="box">
		<div class="mesg">
			<n-space>
				<span>发文类型</span>
				<n-input
					v-model:value="data.type"
					type="text"
					:style="{ width: '600px' }"
					placeholder="类型"
					clearable
					disabled="true"
				/>
			</n-space>
			<n-space>
				<span>发文标题</span>
				<n-input
					v-model:value="data.title"
					type="text"
					:style="{ width: '600px' }"
					placeholder="标题"
					clearable
					disabled="true"
				/>
			</n-space>
			<n-space>
				<span>发文主题</span>
				<n-input
					v-model:value="data.topic"
					type="text"
					:style="{ width: '600px' }"
					placeholder="主题"
					clearable
					disabled="true"
				/>
			</n-space>
			<n-space>
				<span>发文正文</span>
				<n-input
					v-model:value="data.entity"
					type="textarea"
					:style="{ width: '600px', height: '150px' }"
					placeholder="正文"
					clearable
					disabled="true"
				/>
			</n-space>
			<n-message-provider>
				<n-space>
					<span>附件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
					<div class="fujian">
						<n-button type="info" :disabled="isHadData" @click="downloadAll"
							>下载全部附件</n-button
						>
						<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
							<n-data-table
								:columns="columns"
								:style="{ width: '600px', height: '250px', marginTop: '10px' }"
								:data="tableData"
								:pagination="pagination"
								:bordered="true"
								@update:page="handlePageChange"
							/>
						</n-config-provider>
					</div>
				</n-space>
			</n-message-provider>
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive, h, ref, onMounted } from 'vue';
import { dateFormat } from '../../util/verification';
import getMyNewsData from '../../axios/api/myNews/index';
import { zhCN, dateZhCN, NButton, NSpace, useMessage } from 'naive-ui';
const message = useMessage();
const props = defineProps({
	detailData: {
		type: Object,
		default: {},
	},
});
const emit = defineEmits(['downloadTime']);
let data: any = ref({
	type: '',
	title: '',
	topic: '',
	entity: '',
});
let isHadData: any = ref(false);
onMounted(() => {
	data.value = props.detailData;
	tableData.value = props.detailData.fileUrl ? props.detailData.fileUrl : [];
	if (tableData.value.length > 0) {
		isHadData.value = false;
		tableData.value.forEach((ele: any) => {
			ele.name = ele.fileName || 'xxx';
			ele.type = ele.exactType || 'doc';
		});
	} else {
		isHadData.value = true;
	}
});
let tableData: any = ref([
	//   { name: 'xxx', type: 'pdf', length: '4:18' },
	//   { name: 'mmm', type: "pdf", length: '4:48' },
	//   { name: 'uuu', type: 'pdf', length: '7:27' },
	//   { name: 'uuu', type: 'pdf', length: '7:27' }
]);
// 页码数据
const pagination = reactive({
	pageCount: 1,
	page: 1,
	pageSize: 3,
	// pageSizes: [5, 10, 20],
	// showSizePicker: true,
	// suffix: ({ itemCount }: any) => {
	//     return `总共${itemCount}条`
	// }
});
const columns: any = reactive([
	{
		title: '附件名称',
		key: 'name',
		align: 'center',
	},
	{
		title: '附件类型',
		key: 'type',
		align: 'center',
	},
	{
		title: '操作',
		key: 'actions',
		align: 'center',
		width: 200,
		render(row: any) {
			return h(
				NButton,
				{
					strong: true,
					type: 'info',
					size: 'small',
					onClick: () => downloadFun(row),
				},
				{ default: () => '下载附件' }
			);
		},
	},
]);
// 展示多少
// const handlePageSize = (pageSizes: number) => {
//     pagination.pageSize = pageSizes
//     getList()
//     // const params = dealQueryData()
// }
// 页码切换
const handlePageChange = (currentPage: number) => {
	console.log('currentPage =>', currentPage);
	pagination.page = currentPage;
};

const downloadAll = () => {
	// debugger
	message.success('下载成功');
	let speed = 200;
	tableData.value.forEach((ele: any, index: number) => {
		let timer = setTimeout(() => {
			downloadFun(ele, false);
			clearTimeout(timer);
		}, index * speed);
	});
};
let downloadTime: any = ref('');
const downloadFun = async (data: any, status = true) => {
	console.log(props.detailData);

	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = data.url + '?response-content-type=application/octet-stream';
	// a.target='_blank'
	a.setAttribute('download', `${data.name}.${data.type}`);
	// a.download = data.url;
	document.body.appendChild(a);
	a.click();
	a.remove();
	downloadTime.value = dateFormat(new Date().getTime(), 'y-m-d');
	emit('downloadTime', downloadTime.value);
	if (!data.value.readState || data.value.readState !== 'toBeRead') {
		const datas = {
			id: data.value.id,
			sendId: data.value.sendId,
			downloadTime: downloadTime.value,
		};
		let res: any = await getMyNewsData.readSure(datas);
	}
	if (status) {
		message.success('下载成功');
	}
};
</script>

<style lang="postcss" scoped>
.box {
	display: flex;
	flex-direction: column;
	position: relative;
}
.mesg {
	width: 100%;
	display: flex;
	flex-direction: column;
	> div {
		display: flex;
		/* align-items: center; */
		line-height: 50px;
		justify-content: space-between;
		margin-right: 40px;
		margin-top: 20px !important;
	}
}

.fujian {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	line-height: 28px;
}
.n-select {
	width: 70px !important;
}
</style>
