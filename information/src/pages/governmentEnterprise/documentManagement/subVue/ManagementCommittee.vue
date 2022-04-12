<template>
	<n-message-provider>
		<div class="container">
			<!-- :rules="rules" -->
			<n-form
				ref="formRef"
				:model="model"
				label-placement="left"
				label-width="auto"
				require-mark-placement="right-hanging"
				:rules="rules"
			>
				<n-form-item label="发文类型:" path="inputValue">
					<!-- <n-select
                        v-model:value="model.inputValue"
                        placeholder="请输入发文类型"
                        :options="postType"
                        @update:value="hendld($event)"
					/>-->
					<n-input v-model:value="model.inputValue" placeholder="请输入发文标题" disabled />
				</n-form-item>
				<n-form-item label="发文标题:" path="textareaValue">
					<n-input v-model:value="model.textareaValue" placeholder="请输入发文标题" />
				</n-form-item>
				<n-form-item label="发文主题:" path="multipleSelectValue">
					<n-input v-model:value="model.multipleSelectValue" placeholder="请输入发文主题" />
				</n-form-item>
				<n-form-item label="发文正文:" path="switchValue">
					<n-input v-model:value="model.switchValue" type="textarea" placeholder="请输入发文正文" />
				</n-form-item>
				<n-form-item label="上传附件:" path="checkboxGroupValue">
					<n-upload
						:action="postUrl"
						type="multipart/form-data"
						:with-credentials="true"
						accept="*"
						method="POST"
						:multiple="false"
						max="2"
						headers="{ 'Content-Type':'multipart/form-data' }"
						:data="fileData"
						@finish="handleFinish"
						@preview="handlePreview"
						@success="hanld"
						@remove="removeList"
						@before-upload="beforeUpload"
					>
						<n-button>上传附件</n-button>
					</n-upload>
				</n-form-item>
				<n-form-item label="发文对象" path="onlineselect" :show-feedback="false">
					<span class="online_select">
						当前已选择
						<p>{{ selectValueEdid }}</p>条
					</span>
					<n-select placeholder="请输入发文类型" :options="reportObj" @update:value="henld($event)" />
				</n-form-item>
			</n-form>
			<!-- footer部分 -->
			<div class="footer">
				<div
					v-for="(item, index) of submitBUtton"
					:key="index"
					:style="{
						'margin-right': 20 + 'px',
					}"
				>
					<n-button :type="item.type" @click="footerClick(item.name)">
						{{
							item.name
						}}
					</n-button>
				</div>
			</div>
		</div>
		<!-- // 模态框展示 -->
		<n-modal v-model:show="showModal">
			<n-card
				style="width: 1000px; height: 820px"
				:title="modelValue"
				:bordered="false"
				size="huge"
				role="dialog"
				aria-modal="true"
			>
				<template #header-extra></template>
				<n-tree
					:style="{
						width: '100%',
						height: 320 + 'px',
					}"
					block-line
					cascade
					virtual-scroll="true"
					checkable
					:data="departmentOptions"
					:default-expand-all="true"
					:default-checked-keys="defaultCheckedKeys"
					@update:checked-keys="node_Resolve"
					@update:selected-keys="node_Selected"
				/>
				<!-- :default-checked-keys="defaultCheckedKeys" -->
				<!--树  // 默认选中的key -->
				<!-- :default-selected-keys="defaultCheckedKeys" -->
				<span>当前已选择 {{ alldataS }} 数据</span>
				<div
					class="table"
					:style="{
						display: 'flex',
						width: '100%',
						overflow: 'none',
					}"
				>
					<n-data-table
						ref="table"
						v-model:default-checked-row-keys="checkedRowKeys"
						:columns="columns"
						:max-height="250"
						:data="dataList.slice(0, Math.floor(dataList.length / 2))"
						:row-key="(row: any) => row.key"
						@update:checked-row-keys="handleCheck1"
					/>
					<!-- v-model:checked-row-keys="checkedRowKeys" -->
					<n-data-table
						ref="table"
						v-model:default-checked-row-keys="checkedRowKeys"
						:columns="columns"
						:max-height="250"
						:data="dataList.slice(dataList.length / 2)"
						:row-key="(row: any) => row.key"
						@update:checked-row-keys="handleCheck2"
					/>
					<!-- 默认绑定的key值 -->
					<!-- v-model:default-checked-row-keys="checkedRowKeys" -->
				</div>
				<template #footer>
					<n-button type="info" @click="confirmSelect">确认选择</n-button>
					<n-button type="warning" @click="clearAllInfo">重置</n-button>
					<n-button type="error" @click="() => (showModal = false)">取消</n-button>
				</template>
			</n-card>
		</n-modal>
	</n-message-provider>
</template>
<script lang="ts" setup>
import { Ref, ref, reactive, onMounted } from 'vue';
import { TreeOption, useMessage } from 'naive-ui';
import API, {
	postFile,
} from '../../../../axios/api/GovernmentEnterpriseInteraction/index';
import router from '../../../../router/index';

/**
 * store 状态变量
 */

const message = useMessage();

// console.log(router,'routerrouterrouterrouterrouter');

let selectValueEdid: any = ref(0);

const rules = {
	textareaValue: {
		required: true,
		max: 20,
		message: '最长长度为 20',
		trigger: ['input', 'blur'],
	},
	multipleSelectValue: {
		required: true,
		max: 30,
		message: '最长长度为 30',
		trigger: ['input', 'blur'],
	},
	switchValue: {
		required: true,
		message: '发文正文必填',
		trigger: ['input', 'blur'],
	},
	onlineselect: {
		required: true,
		message: '请选择发文对象',
		trigger: ['input', 'blur'],
	},
};

let postUrl: any = postFile;

let model = ref({
	inputValue: '管委会发文', // 类型
	textareaValue: '', // 标题
	selectValue: null,
	multipleSelectValue: null, // 主题
	datetimeValue: null,
	nestedValue: {
		path1: null,
		path2: null,
	},
	switchValue: null, // 正文
	checkboxGroupValue: null, // 上传附件
	radioGroupValue: null,
	radioButtonGroupValue: null,
	inputNumberValue: null,
	timePickerValue: null,
	sliderValue: 0,
	transferValue: null,
	value: null,
});

/**
 * 文件上传附件的类型
 */
let uploadUrl: Ref<string> = ref('');
const fileData: any = reactive({
	fileName: '',
});
const beforeUpload = (data: any) => {
	// if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
	//     message.error('只能上传png格式的图片文件，请重新上传')
	//     return false
	// }
	fileData.fileName = data.file.file?.name.includes('.')
		? data.file.file?.name.split('.')[0]
		: '';

	return true;
};
// 处理文件上传成功的回调
function handleFinish({ event, file }: { event: any; file: any }) {
	const {
		code,
		data: { name, url },
	} = JSON.parse(event.target.response);
	file.url = url;
	file.fileName = file.name.split('.')[0];
	// uploadUrl.value = url
	fileList.push({
		event,
		file,
	});
	uploadUrl.value = url;
}

const node_Resolve = (velu: any) => {
	console.log(velu, 's');
	checkedRowKeys.value.length = 0; // table绑定的key数组
	velu?.forEach((item: any, index: number) => {
		if (item.split(',')[2] !== '') {
			checkedRowKeys.value.push(item);
		}
	});
	filterFuncToTables(velu);
	console.log(checkedRowKeys.value);
	// console.log(dataList, '99');
};

const node_Selected = (value: any) => {
	console.log(value, 'oooo');
};

// 功能区树
async function getFunctional() {
	return await API.getFunctionalTree();
}

// 工业区树
async function getIndustry() {
	return await API.getIndustryTree();
}

function hanld(e: any) {
	console.log(e);
}

/**
 * 处理preview
 */
function handlePreview(e: any) {
	console.log(e, '999999');
}

// 根据类型获取树
let backUPTitle: Ref<string> = ref('');
/**
 * 清除所有信息 重置
 */
function clearAllInfo() {
	dataList.length = 0;
	henld(backUPTitle.value);
}

/**
 * 当前已选择的数据条数
 */

//model 处理

// 树节点默认选中的节点
let defaultCheckedKeys: any = reactive([]);

const handleCheck1 = (v: any) => {
	// 找到列表中未选中的key值
	defaultCheckedKeys =
		checkedRowKeys.value &&
		checkedRowKeys.value.filter((val: any, index: number) => {
			return v.indexOf(val) > -1;
		});
	console.log(defaultCheckedKeys, 'sss');
};
const handleCheck2 = (v: any) => {
	defaultCheckedKeys =
		checkedRowKeys.value &&
		checkedRowKeys.value.filter((val: any, index: number) => {
			return v.indexOf(val) > -1;
		});
	console.log(defaultCheckedKeys, 'ttt');
};

let functionalIds: any = ref([]);

/**
 * 确认选择功能
 */

function confirmSelect() {
	showModal.value = false;
	// console.log(dataList, '9999');
	functionalIds.value =
		dataList &&
		dataList.map((item: any, index: number) => {
			if (item.key.split(',')[1] !== '') {
				return item.key.split(',')[1]; // 拿到id值形成ids数组
			}
		});
	selectValueEdid.value = functionalIds.value.length;
}

/**
 * 确认派发的接口
 */
async function ppost(
	data: any = {
		companyId: '', //
		companySendId: functionalIds.value, // 行业  功能区选中id
		createuserId: '',
		createuserName: '',
		downloadStatus: '',
		draftTime: '',
		// 发文正文
		entity: model.value.switchValue,
		fileUrl: [
			{
				url: uploadUrl.value,
			},
		],
		functionIndustry: 0,
		id: '',
		industry: '',
		isDelete: 0,
		organName: '',
		recive: '',
		sendNumber: 0,
		sendObject: '',
		sendTime: '',
		status: 1, // 0 草稿 1 发文 2 收文
		// 发文标题
		title: model.value.textareaValue,
		topic: model.value.multipleSelectValue,
		// 发文类型
		type: '0',
		userId: [],
	}
) {
	let fileUrl: any = [];
	fileList.forEach((item: any) => {
		fileUrl.push({
			exactType: item.file.name?.includes('.')
				? item.file.name.split('.')[1]
				: 'png',
			url: item.file.url,
			fileName: item.file.name?.includes('.')
				? item.file.name.split('.')[0]
				: '',
		});
	});
	data.fileUrl = fileUrl;
	return await API.confirmPost({ ...data });
}

let fileList: any = reactive([]);

/**
 * 发文类型
 */
let postCirType: Ref<any> = ref();

const hendld = (value: any) => {
	postCirType.value = value;
};

// 功能区选择还是工业区选择
let typeFunctionandIndustry: any = ref('');

function footerClick(value: any) {
	switch (value) {
		case '确认派发':
			if (
				model.value.inputValue === '' ||
				model.value.multipleSelectValue === '' ||
				model.value.textareaValue === '' ||
				model.value.switchValue === '' ||
				selectValueEdid.value <= 0
			) {
				(selectValueEdid.value == 0) && message.info('请选择发文对象!');
				(selectValueEdid.value !== 0) &&message.info('信息不完善!');
				return;
			}
			ppost().then(({ code, data }: any) => {
				code === 200 && message.info('发文成功!');
				if (code !== 200) {
					message.info('发文失败!');
				}
			});
			break;
		case '保存草稿':
			ppost({
				companyId: '', //
				companySendId: functionalIds.value, // 行业  功能区选中id
				createuserId: '',
				createuserName: '',
				downloadStatus: '',
				draftTime: '',
				// 发文正文
				entity: model.value.switchValue,
				fileUrl: [
					{
						url: uploadUrl.value,
					},
				],
				functionIndustry: typeFunctionandIndustry.value,
				id: '',
				industry: '',
				isDelete: 0,
				organName: '',
				recive: '',
				sendNumber: 0,
				sendObject: '',
				sendTime: '',
				status: 0, // 0 草稿 1 发文 2 收文
				// 发文标题
				title: model.value.textareaValue,
				topic: model.value.multipleSelectValue,
				// 发文类型
				type: '0',
				userId: [],
			}).then(({ code, data }: any) => {
				if (code === 200) {
					message.success('保存草稿成功!');
					return new Promise((resolve: any) => {
						setTimeout(() => {
							resolve();
						}, 2000);
					}).then(() => {
						router.push({ path: '/MyDraft' }); // 进入草稿界面
					});
				} else {
					message.error('保存草稿失败!');
				}
			});
			break;
		case '取消发文':
			model.value.switchValue = null;
			model.value.textareaValue = '';
			model.value.multipleSelectValue = null;
			postCirType.value = null;
			uploadUrl.value = '';
			functionalIds.value = [];
			fileList = [];
			break;
		default:
			break;
	}
}

/**
 * remove list 回调
 */
function removeList(e: any) {
	console.log(e, 'eeeeeeeeee');
}

let dataList: any = reactive([]);

let alldataS: any = ref(0);

const columns = [
	{
		type: 'selection',
		options: [
			'all',
			// onSelect:(row:any)=>{
			//     return row
			// }
		],
	},
	{
		title: '操作',
		key: 'name',
	},
	{
		title: '园区/行业',
		key: 'age',
	},
	{
		title: '企业名称',
		key: 'address',
	},
];

// let data:any = createData()

let departmentOptions = reactive([
	{
		label: '邵武经开区',
		value: '邵武经开区',
		key: -1,
		children: [],
	},
]);

const postType: any = reactive([
	{
		label: '管委会发文',
		value: 0,
	},
	// {
	//     label: "企业上报",
	//     value: 1
	// },
	// {
	//     label: "政企通知",
	//     value: 2
	// }
]);

// 遍历递归
function tersvice(_: any) {
	return (
		_.children &&
		_.children.map((item: any, index: number) => {
			return {
				label: item.namess,
				value: item.namess,
				// key: item.id,
				key: `${item.namess},${item.id},${item.parentname}`,
				parent: item?.parentname,
				children: tersvice(item),
			};
		})
	);
}

let showModal: any = ref(false);

let modelValue: Ref<string> = ref('');

// 被选中的列的key 数组
let checkedRowKeys: any = ref([]);

// 处理发文对象
function henld(value: any) {
	backUPTitle.value = value;
	switch (value) {
		case '按行业选择对象':
			console.log(value, 'sdsd');
			showModal.value = true;
			modelValue.value = value;
			dataList.length = 0;
			checkedRowKeys.value.length = 0;
			// 工业区
			typeFunctionandIndustry.value = 1;
			getIndustry().then(({ code, data }: any) => {
				departmentOptions[0].children.length = 0;
				departmentOptions[0].children =
					data &&
					data.map((_: any, index: number) => {
						return {
							label: _.namess,
							value: _.namess,
							// key: _.id,
							key: `${_.namess},${_.id}`,
							parent: _?.parentname,
							children: tersvice(_),
						};
					});
				// console.log(departmentOptions, 'ppppppp');
			});
			break;
		case '按功能区选择对象':
			console.log(value, 'sdsd');
			showModal.value = true;
			modelValue.value = value;
			dataList.length = 0;
			checkedRowKeys.value.length = 0;
			// 功能区
			typeFunctionandIndustry.value = 0;
			getFunctional().then(({ code, data }: any) => {
				departmentOptions[0].children.length = 0;
				console.log(data);
				departmentOptions[0].children = data?.map((item: any, idnex: any) => {
					return {
						label: item.namess,
						value: item.namess,
						key: `${item.namess},${item.id},${item?.parentname}`,
						parent: item?.parentname,
						children: tersvice(item),
					};
				});
				// console.log(departmentOptions, 'ppppppp');
				// console.log(checkedRowKeys.value,'l');
			});
			break;
		default:
			break;
	}
}

// 过滤筛选出来的数据到table中
function filterFuncToTables(arr: any) {
	let res: any = [];
	dataList.length = 0;
	arr &&
		arr?.forEach((_: any, indey: number) => {
			console.log(_, 'keysysys');
			if (_.split(',')[2] && _.split(',')[2] !== '') {
				dataList.unshift({
					key: _,
					name: _?.split(',')[1], // id
					age: _?.split(',')[2], // 父级
					address: _?.split(',')[0], // 自己
				});
			}
		});
	alldataS.value = dataList.length;
	return res;
}

const reportObj: any = reactive([
	{
		label: '按功能区选择对象',
		value: '按功能区选择对象',
	},
	{
		label: '按行业选择对象',
		value: '按行业选择对象',
	},
]);

const submitBUtton: any = reactive([
	{
		name: '确认派发',
		type: 'info',
	},
	{
		name: '保存草稿',
		type: 'primary',
	},
	{
		name: '取消发文',
		type: 'warning',
	},
]);
</script>
<style lang="postcss" scoped>
@import "../subScss/ManagementCommittee.scss";
</style>
