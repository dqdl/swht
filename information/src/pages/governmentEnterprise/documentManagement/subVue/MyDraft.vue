<template>
	<n-message-provider>
		<div v-if="!showDraft" class="draft">
			<div class="top">
				<blue-title :prop-value="'查询'" />
				<div class="heads">
					<div>
						<p>主题:</p>
						<n-input
							v-model:value="valueSearch"
							type="text"
							placeholder="请输入主题"
						/>
					</div>
					<div>
						<p>时间:</p>
						<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
							<n-date-picker
								v-model:value="range"
								type="daterange"
								:clearable="true"
								@update:formatted-value="handleDataDate"
							/>
						</n-config-provider>
					</div>
					<div>
						<n-button type="info" @click="checkDatas">查询</n-button>
						<n-button type="warning" @click="reset">重置</n-button>
					</div>
				</div>
			</div>

			<main class="main">
				<blue-title :prop-value="'数据列表'" />
				<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
					<n-data-table
						:columns="columns"
						:data="data"
						:pagination="pagination"
						:bordered="false"
						@update:checked-row-keys="handleCheck"
						@update:page="handlePageChange"
						@update:pageSize="handlePageSize"
					/>
				</n-config-provider>
			</main>
			<!-- 弹出模态框 修改-->
			<n-modal
				v-model:show="showModalPut"
				class="custom-card"
				preset="card"
				:style="bodyStyle"
				:title="form_details.name"
				size="huge"
				:bordered="false"
				:segmented="segmented"
			>
				<template #header-extra></template>
				<n-form :model="form_details" :rules="rules">
					<n-form-item label="类型" path="user.name">
						<n-input
							v-model:value="form_details.user.name"
							clearable
							placeholder="选择类型"
							:disabled="isDetail"
						/>
					</n-form-item>
					<n-form-item label="标题" path="user.account">
						<n-input
							v-model:value="form_details.user.account"
							clearable
							placeholder="输入标题"
							:disabled="isDetail"
						/>
					</n-form-item>
					<n-form-item label="主题" path="user.position">
						<n-input
							v-model:value="form_details.user.position"
							clearable
							placeholder="输入主题"
							:disabled="isDetail"
						/>
					</n-form-item>
					<n-form-item label="保存草稿时间" path="user.tel">
						<n-input
							v-model:value="form_details.user.tel"
							clearable
							placeholder="请输入保存草稿时间"
							:disabled="isDetail"
						/>
					</n-form-item>
					<n-form-item label="保存草稿用户" path="user.user">
						<n-input
							v-model:value="form_details.user.user"
							clearable
							placeholder="请输入保存草稿用户"
							:disabled="isDetail"
						/>
					</n-form-item>
				</n-form>
				<template #footer>
					<n-space>
						<n-button type="info" @click="getNewAddForm">确认</n-button>
						<n-button type="info" @click="showModalPut = false">取消</n-button>
					</n-space>
				</template>
			</n-modal>
			<!-- // 确认删除的弹窗 -->
			<n-modal
				v-model:show="showModalConfirm"
				:mask-closable="false"
				preset="dialog"
				title="确认"
				content="你确认"
				positive-text="确认"
				negative-text="算了"
				@positive-click="onPositiveClick"
				@negative-click="onNegativeClick"
			/>
		</div>
		<div v-if="showDraft" class="detailDraft">
			<div class="container">
				<div class="editBtn">
					<n-button type="info" @click="openDisabled">编辑</n-button>
				</div>
				<n-form
					ref="formRef"
					:model="model"
					label-placement="left"
					label-width="auto"
					require-mark-placement="right-hanging"
					:disabled="updateDisabled"
				>
					<n-form-item label="发文类型:" path="inputValue">
						<n-select
							v-model:value="model.inputValue"
							placeholder="请输入发文类型"
							:options="postType"
							@update:value="hendld($event)"
						/>
					</n-form-item>
					<n-form-item label="发文标题:" path="textareaValue">
						<n-input
							v-model:value="model.textareaValue"
							placeholder="请输入发文标题"
						/>
					</n-form-item>
					<n-form-item label="发文主题:" path="multipleSelectValue">
						<n-input
							v-model:value="model.multipleSelectValue"
							placeholder="请输入发文主题"
						/>
					</n-form-item>
					<n-form-item label="发文正文:" path="switchValue">
						<n-input
							v-model:value="model.switchValue"
							type="textarea"
							placeholder="请输入发文正文"
						/>
					</n-form-item>
					<n-form-item label="上传附件:" path="checkboxGroupValue">
						<n-upload
							:action="postUrl"
							type="multipart/form-data"
							:with-credentials="true"
							accept="*"
							method="POST"
							:multiple="false"
							headers="{ 'Content-Type':'multipart/form-data' }"
							:data="fileData"
							@finish="handleFinish"
							@preview="handlePreview"
							@success="hanld"
							@before-upload="beforeUpload"
						>
							<n-button>上传附件</n-button>
						</n-upload>
					</n-form-item>
					<n-form-item label="发文对象" :show-feedback="false">
						<n-select
							placeholder="请输入发文类型"
							:options="reportObj"
							@update:value="henld($event)"
						/>
					</n-form-item>
				</n-form>
				<!-- footer部分 -->
				<div class="footer">
					<n-button type="info" @click="confirmSubmit">确认</n-button>
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
					:virtual-scroll="true"
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
						:columns="columns2"
						:max-height="250"
						:data="dataList.slice(0, Math.floor(dataList.length / 2))"
						:row-key="(row: any) => row.key"
						@update:checked-row-keys="handleCheck1"
					/>
					<!-- v-model:checked-row-keys="checkedRowKeys" -->
					<n-data-table
						ref="table"
						v-model:default-checked-row-keys="checkedRowKeys"
						:columns="columns2"
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
					<n-button type="error" @click="() => (showModal = false)"
						>取消</n-button
					>
				</template>
			</n-card>
		</n-modal>
	</n-message-provider>
</template>
<script lang="ts" setup>
import { Ref, ref, h, onMounted, watch, computed, reactive } from 'vue';
import { NSpace, NButton, useMessage, zhCN, dateZhCN } from 'naive-ui';
import APi, {
	postFile,
} from '../../../../axios/api/GovernmentEnterpriseInteraction/index';
import router from '../../../../router/index';
import store from '../../../../store/index';
import blueTitle from '@components/public/title/index.vue';

const message = useMessage();
let range: any = ref(null);

// 是否展示详情框
let showDraft: Ref<boolean> = ref(false);
let postUrl: any = postFile;

// 表单禁用元素
let updateDisabled: Ref<boolean> = ref(true);

// 是否展示model
let showModal: any = ref(false);

// 列表展示数据
let dataList: any = reactive([]);

// 所有数据
let alldataS: any = ref(0);
/**
 * 展示列表标题数据
 */
let modelValue: Ref<string> = ref('');

// let data:any = createData()

let departmentOptions = ref<any[]>([
	// {
	//     label: '邵武经开区',
	//     value: "邵武经开区",
	//     key: -1,
	//     children: []
	// }
]);

// 部门信息
let parType: any = ref('');

// 树的类别
let treeType: any = ref('');

function deep(item: any) {
	return (
		item &&
		item.map((items: any, index: any) => {
			return {
				label: items.namess,
				value: items.namess,
				parentname: items.parentname ? items.parentname : '',
				key: items.id,
				children: deep(items.children),
			};
		})
	);
}

// 处理发文对象
function henld(value: any) {
	console.log(value, 'valuevalue');
	// backUPTitle.value = value
	switch (value) {
		case '按行业选择对象':
			console.log(value, 'sdsd');
			showModal.value = true;
			modelValue.value = value;
			switch (parType.value) {
				case 0: // 管委会发文
					console.log(1); // klkl
					departmentOptions.value.length = 0;
					departmentOptions.value[0] = {
						label: '邵武经开区',
						value: '邵武经开区',
						key: -1,
						parentname: '',
						children: [],
					};
					methodsGetTreeInfo.communGetIndusTree().then(({ data }: any) => {
						departmentOptions.value[0].children = deep(data);
					});
					break;
				case 2: // 政企通知
					console.log(3); // klklkll
					console.log(8); // jkjkj
					departmentOptions.value.length = 0;
					departmentOptions.value[0] = {
						label: '邵武经开区',
						value: '邵武经开区',
						key: -1,
						parentname: '',
						children: [],
					};
					methodsGetTreeInfo.announcementCompany().then(({ data }: any) => {
						console.log(data, '');
						departmentOptions.value[0].children = deep(data);
					});
					break;
			}
			break;
		case '按功能区选择对象':
			console.log(value, 'sdsd');
			showModal.value = true;
			modelValue.value = value;
			switch (parType.value) {
				case 0: // 管委会发文
					departmentOptions.value.length = 0;
					departmentOptions.value[0] = {
						label: '邵武经开区',
						value: '邵武经开区',
						key: -1,
						parentname: '',
						children: [],
					};
					methodsGetTreeInfo.communGetFunctionalTree().then(({ data }: any) => {
						departmentOptions.value[0].children = deep(data);
					});
					break;
				case 2: // 政企通知
					departmentOptions.value.length = 0;
					departmentOptions.value[0] = {
						label: '邵武经开区',
						value: '邵武经开区',
						key: -1,
						parentname: '',
						children: [],
					};
					methodsGetTreeInfo.announcementCompanyDus().then(({ data }: any) => {
						console.log(data, '');
						departmentOptions.value[0].children = deep(data);
					});
					break;
			}
			break;
		case '点击选择发文对象':
			showModal.value = true;
			modelValue.value = value;
			// console.log(departmentOptions.value, 'kkokkk');
			// departmentOptions.value[0] = {
			//     label: '邵武经开区',
			//     value: "邵武经开区",
			//     key: -1,
			//     parentname: '',
			//     children: []
			// }
			// methodsGetTreeInfo.enterReportTree().then(({ data }: any) => {
			//     console.log(data, '');
			//     departmentOptions.value[0].children = deep(data)
			// })
			break;
		default:
			break;
	}
}

/**
 * 处理preview
 */
function handlePreview(e: any) {
	console.log(e, '999999');
}

function hanld(e: any) {
	console.log(e);
}

// 被选中的列的key 数组
let checkedRowKeys: any = ref([]);

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

/**
 * 确认选择
 */
function confirmSelect() {
	showModal.value = false;
}
/**
 * 清除所有信息 重置
 */
function clearAllInfo() {
	dataList.length = 0;
	// henld(backUPTitle.value)
}

/**
 * 遍历树
 */
// 找到所有的根节点
function mapLImit(item: any) {
	return (
		item &&
		item.map((items: any, index: number) => {
			if (
				(items.parentname !== '' || items.parentname !== null) &&
				items.children.length === 0 &&
				items.children
			) {
				return items;
			} else {
				if (items.children && items.children.length > 0) {
					return mapLImit(items.children);
				}
			}
		})
	);
}

/**
 * 数组扁平化
 */
function flatten(arr: any) {
	return arr.reduce((result: any, item: any) => {
		return result.concat(Array.isArray(item) ? flatten(item) : item);
	}, []);
}

const node_Resolve = (velu: any) => {
	console.log(velu, 's');
	console.log(departmentOptions.value, '0');
	dataList.length = 0;
	flatten(mapLImit(departmentOptions.value)).forEach(
		(item: any, index: number) => {
			velu.forEach((itm: any) => {
				if (itm === item?.key && item?.key !== null) {
					dataList.push({
						age: item.parentname,
						address: item.label,
						id: item.key,
					});
				}
			});
		}
	);
	alldataS.value = dataList.length;
};

const node_Selected = (value: any) => {
	console.log(value, 'oooo');
};

// 改变当前页
const handlePageChange = (currentPage: number) => {
	// pageDivide.current = currentPage;
	pagination.page = currentPage;
	getDatatsInfo();
};

// 改变页面展示多少条
const handlePageSize = (pageSizes: number) => {
	// pageDivide.current = 1;
	pagination.page = 1;
	// pageDivide.size = pageSizes;
	getDatatsInfo();
};
// 编辑表单
const openDisabled = (): void => {
	updateDisabled.value = false;
};

/**
 * @description 列表树详情信息获取
 * @description 包括管委会发文和政企通知
 *
 */

const methodsGetTreeInfo = {
	// 管委会发文
	// getfunctionalTree
	async communGetFunctionalTree() {
		return await APi.getFunctionalTree();
	},
	// 工业区的树
	async communGetIndusTree() {
		return await APi.getIndustryTree();
	},
	// 企业上报发文树
	async enterReportTree() {
		return await APi.enterpisePostTreeInfo();
	},

	// 政企通知树
	// 1 功能

	async announcementCompany() {
		return await APi.reportAnnounceTree();
	},
	// 2 工业
	async announcementCompanyDus() {
		return await APi.industryEnterportTree();
	},
};

// 分页列表查询信息
let params: any = ref({
	current: 1, //
	size: 10, //
	status: 0,
	timeEnd: '',
	timeStart: '',
	title: '',
	topic: '',
	type: '',
});

let model = reactive({
	inputValue: '', // 类型
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
 * 发文类型
 */
let postCirType: Ref<any> = ref();

const hendld = (value: any) => {
	postCirType.value = value;
};

const postType: any = reactive([
	{
		label: '管委会发文',
		value: 0,
	},
	{
		label: '企业上报',
		value: 1,
	},
	{
		label: '政企通知',
		value: 2,
	},
]);

let fileList: any = reactive([]);

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

// 树列表选项
let reportObj: any = ref([]);

let enterRepost: any = reactive([
	{
		label: '点击选择发文对象',
		value: '点击选择发文对象',
	},
]);

// 是否展示模态框
let showModalPut: any = ref(false);

// 是否查看详情
let isDetail: any = ref(false);

let bodyStyle = {
	width: '1000px',
	height: '800px',
};

let segmented = {
	content: 'soft',
	footer: 'soft',
};

/**
 * 处理时间的回调
 */
function handleDataDate(v: any) {
	console.log(v, '8887777');
	params.value.timeStart = v[0];
	params.value.timeEnd = v[1];
}

// 确认删除的信息弹窗
let showModalConfirm: any = ref(false);

async function deleteItemsById(id: any) {
	return await APi.deleItemOns(id);
}
/**
 * 重置
 */
function reset() {
	valueSearch.value = '';
	range.value = null;
	getDatatsInfo();
}

// 确认删除的弹窗
const onPositiveClick = () => {
	console.log('confirm');
	deleteItemsById(itemId.value).then(({ code }: any) => {
		if (code === 200) {
			message.success('删除成功!');
			getDatatsInfo();
		} else {
			message.error('删除失败!');
		}
	});
};

// 取消删除的弹窗
const onNegativeClick = () => {
	// 弹窗消失
	showModalConfirm.value = false;
};

/**
 * 查询列表信息数据
 */
function checkDatas() {
	params.value.topic = valueSearch;
	// 查询部分接口信息数据
	getDatatsInfo();
}

const form_details = reactive({
	name: '新增',
	user: {
		name: '',
		account: '',
		department: '',
		position: '',
		role: '',
		tel: '', // 时间
		user: '', // 用户,
		type: '',
	},
});

let data: any = reactive([]);

// 获取草稿列表信息
function getDatatsInfo() {
	APi.getDRaftInfo(params.value).then(
		({ code, data: { records, total, size, current } }: any) => {
			data.length = 0;
			pagination.pageCount = data.pages;
			(pagination as any).itemCount = total;
			records &&
				records.forEach((item: any, index: number) => {
					data.push({
						no: index + 1,
						title:
							item.type === 0
								? '管委会发文'
								: item.type === 1
								? '企业上报'
								: item.type === 2
								? '政企通知'
								: '',
						tagTitle: item.title,
						mainTitle: item.entity,
						draft: item.draftTime,
						draftUser: item.createuserName,
						type: item.type,
						id:item.id,
						functionIndustry: item.functionIndustry, // 工业区还是功能区
					});
				});
		}
	);
}
const handleCheck = () => {};
onMounted(() => {
	getDatatsInfo();
});

/**
 * 确认提交的按钮
 */

function getNewAddForm() {
	console.log('确认提交', 'llllllllll');
}
const rules = {
	user: {
		name: {
			required: true,
			message: '请输入姓名',
			trigger: ['input', 'blur'],
		},
		account: {
			required: true,
			message: '请输入账号',
			trigger: ['input', 'blur'],
		},
	},
};

// 搜索的主题值绑定
const valueSearch: any = ref('');

const searchHead: any = reactive([
	{
		text: '主题',
		id: '1',
	},
	{
		text: '时间',
		id: '2',
	},
]);

// pagination
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

const columns2 = reactive([
	{
		title: '园区/行业',
		key: 'age',
	},
	{
		title: '企业名称',
		key: 'address',
	},
]);

const columns = reactive([
	{
		title: '序号',
		key: 'no',
	},
	{
		title: '类型',
		key: 'title',
	},
	{
		title: '标题',
		key: 'tagTitle',
	},
	{
		title: '主题',
		key: 'mainTitle',
	},
	{
		title: '保存草稿时间',
		key: 'draft',
	},
	{
		title: '保存草稿用户',
		key: 'draftUser',
	},
	{
		title: '操作',
		key: 'actions',
		render(row: any, index: number) {
			return h(NSpace, {}, [
				h(
					NButton,
					{
						size: 'small',
						type: 'info',
						onClick: () => rowDetails(row, index),
					},
					{ default: () => '详情' }
				),
				h(
					NButton,
					{
						size: 'small',
						type: 'warning',
						onClick: () => rowEdit(row, index),
					},
					{ default: () => '删除' }
				),
			]);
		},
	},
]);

let itemId: any = ref('');

/**
 * 删除
 */
const rowEdit = (par1: any, par2: any) => {
	showModalConfirm.value = true;
	isDetail.value = false;
	form_details.name = '删除';
	form_details.user.name = par1.title; // 类型
	form_details.user.account = par1.tagTitle; // 标题
	form_details.user.position = par1.mainTitle; // 主题
	form_details.user.tel = par1.draft; // 保存草稿时间
	form_details.user.user = par1.draftUser; // 保存草稿用户
	itemId.value = par1.id;
};
async function getDraftDatas(data: any) {
	return await APi.draftCheckById(data);
}
/**
 * 详情
 */
/**
 *
 * 获取缓存的数据信息
 */

/**
 * @param type 部门类型
 * @param typeCahe  功能区类型
 */

// 树节点默认选中的节点
let defaultCheckedKeys: any = ref([]);

function treeReport(item: any) {
	return (
		item &&
		item.map((item: any, indey: number) => {
			return {
				label: item.deptName,
				value: item.deptName,
				key: item.id,
				parentname: item.parentName,
				children: treeReport(item.children),
			};
		})
	);
}

// 管委会发文树
function communityFUnc(item: any) {
	return (
		item &&
		item.map((item: any, indey: number) => {
			if (item.exist) {
				defaultCheckedKeys.value.push(item.id);
			}
			return {
				label: item.namess,
				value: item.namess,
				key: item.id,
				children: communityFUnc(item.children),
			};
		})
	);
}

const rowDetails = (par1: any, par2: any) => {
	console.log(par1, '988888');
	showModalConfirm.value = false;
	form_details.name = '详情';
	form_details.user.name = par1.title; // 类型
	form_details.user.account = par1.tagTitle; // 标题
	form_details.user.position = par1.mainTitle; // 主题
	form_details.user.tel = par1.draft;
	form_details.user.user = par1.draftUser;
	watch(
		() => par1.type,
		(prev, next) => {
			if (prev === 0 || prev === 2) {
				reportObj.value = [
					{
						label: '按功能区选择对象',
						value: '按功能区选择对象',
					},
					{
						label: '按行业选择对象',
						value: '按行业选择对象',
					},
				];
			} else if (prev === 1) {
				reportObj.value = [
					{
						label: '点击选择发文对象',
						value: '点击选择发文对象',
					},
				];
			}
		},
		{
			immediate: true,
			deep: true,
		}
	);
	getDraftDatas({
		functionIndustry: par1.functionIndustry, // 判断是园区选中还是工业区选中
		id: par1.id,
		type: par1.type,
	}).then(({ code, data }: any) => {
		if (code === 200) {
			const {
				createuserId,
				fileUrl,
				functionIndustry,
				id,
				platformCompanyVoList,
				title,
				topic,
				type,
				entity,
				listDept,
			} = data;
			parType.value = type;
			treeType.value = functionIndustry;
			switch (par1.type) {
				case 0: //管委会发文
					showDraft.value = true;
					// console.log(data, 'sss');
					model.inputValue = '管委会类型';
					model.textareaValue = title;
					model.multipleSelectValue = topic;
					model.switchValue = entity; // 正文
					console.log(platformCompanyVoList, functionIndustry);
					defaultCheckedKeys.value.length = 0; // 清空默认选中
					departmentOptions.value.length = 0;
					departmentOptions.value[0] = {
						label: '邵武经开区',
						value: '邵武经开区',
						parentname: '',
						key: -1,
						children: [],
					};
					// debugger
					break;
				case 1: // 企业上报
					console.log(data);
					showDraft.value = true;
					// console.log(data, 'sss');
					model.inputValue = '企业上报';
					model.textareaValue = title;
					model.multipleSelectValue = topic;
					model.switchValue = entity; // 正文
					departmentOptions.value.length = 0;
					defaultCheckedKeys.value.length = 0; // 清空默认选中
					/**
					 * 企业上报
					 */
					console.log(listDept, functionIndustry);
					// departmentOptions[0].children.length = 0 ;
					departmentOptions.value = treeReport(listDept);
					// console.log(departmentOptions, 'kkkkk');
					// console.log(defaultCheckedKeys.value, 'defaultCheckedKeysdefaultCheckedKeys');

					break;
				case 2: // 政企通知
					showDraft.value = true;
					// console.log(data, 'sss');
					model.inputValue = '政企通知';
					model.textareaValue = title;
					model.multipleSelectValue = topic;
					model.switchValue = entity; // 正文
					departmentOptions.value.length = 0;
					// console.log(data);
					// getCacheTree(functionIndustry, type)
					// console.log(platformCompanyVoList, functionIndustry);
					break;
				default:
					break;
			}
		}
	});
};

/**
 * 确认提交btn
 */

function confirmSubmit() {
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
	APi.confirmPost({
		companyId: '', //
		companySendId: dataList.map((item: any) => item.id), // 行业  功能区选中id
		createuserId: '',
		createuserName: '',
		downloadStatus: '',
		draftTime: '',
		// 发文正文
		entity: model.switchValue,
		fileUrl: fileUrl,
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
		title: model.textareaValue,
		topic: model.multipleSelectValue,
		// 发文类型
		type:
			model.inputValue === '管委会类型'
				? '0'
				: model.inputValue === '企业上报'
				? '1'
				: model.inputValue === '政企通知'
				? '2'
				: '',
		userId: [],
	}).then(({ code, data }: any) => {
		if (code === 200) {
			showDraft.value = false;
			message.success('修改成功!');
		} else {
			message.success('修改失败!');
		}
	});
}
</script>
<style lang="postcss" scoped>
@import '../subScss/MyDraft.scss';
</style>
