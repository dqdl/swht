<template>
	<div class="contentList">
		<div class="listContent">
			<n-space>
				<n-button
					v-if="editFlag"
					type="warning"
					style="margin-top: 8px"
					@click="query(false)"
					>编辑</n-button
				>
				<n-button
					v-if="!editFlag"
					type="info"
					style="margin-top: 8px"
					@click="query1(true)"
					>保存</n-button
				>
				<n-button
					v-if="!editFlag"
					type="info"
					style="margin-top: 8px"
					@click="showModalCancel = true"
					>取消</n-button
				>
				<!-- <n-button type="warning" @click="reset">重置</n-button> -->
			</n-space>
		</div>
		<div class="basicContent">
			<blue-title :prop-value="'基础信息'" />
			<n-form
				ref="formRef"
				inline
				:label-width="80"
				:model="formContent"
				:rules="rules"
				:size="size"
				style="flex-wrap: wrap"
			>
				<n-form-item
					label="企业名称"
					path="user.name"
					:show-feedback="!editFlag"
				>
					<n-input
						v-model:value="formContent.ename"
						:disabled="editFlag"
						placeholder="请输入企业名称"
					/>
				</n-form-item>
				<n-form-item label="所属平台" path="platform">
					<n-select
						v-model:value="formContent.platform"
						clearable
						placeholder="请选择所属平台"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="企业地址" path="address">
					<n-input
						v-model:value="formContent.address"
						placeholder="请输入企业地址"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="成立时间" path="createTime">
					<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
						<n-date-picker
							v-model:value="formContent.createTime"
							:disabled="editFlag"
							type="date"
							clearable
						/>
					</n-config-provider>
				</n-form-item>
				<n-form-item label="行业类别" path="industry">
					<n-select
						v-model:value="formContent.industry"
						clearable
						placeholder="请选择行业类别"
						:options="selectOptions[0]"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="主要产品" path="mainProducts">
					<n-select
						v-model:value="formContent.mainProducts"
						clearable
						placeholder="请选择主要产品"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="风险等级" path="riskLevel">
					<n-select
						v-model:value="formContent.riskLevel"
						clearable
						placeholder="请选择风险等级"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="法人代表" path="corporate">
					<n-input
						v-model:value="formContent.corporate"
						placeholder="请输入法人代表"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="社会信用代码" path="trustNum">
					<n-input
						v-model:value="formContent.trustNum"
						placeholder="请输入社会信用代码"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="企业联系人" path="contactNum">
					<n-input
						v-model:value="formContent.contactNum"
						placeholder="请输入企业联系人"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="联系人电话" path="contactNum">
					<n-input
						v-model:value="formContent.contactNum"
						placeholder="请输入联系人电话"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item>
					<!-- <n-button @click="handleValidateClick" attr-type="button">验证</n-button> -->
				</n-form-item>
			</n-form>
		</div>
		<div class="enterpriseDetails">
			<blue-title :prop-value="'企业详情'" />
			<n-form
				ref="formRef"
				inline
				:label-width="80"
				:model="formContent"
				:rules="rules"
				:size="size"
				style="flex-wrap: wrap"
			>
				<n-form-item label="经济类型" path="economyType">
					<n-select
						v-model:value="formContent.economyType"
						clearable
						placeholder="请选择经济类型"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="投产日期" path="operationTime">
					<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
						<n-date-picker
							v-model:value="formContent.operationTime"
							:disabled="editFlag"
							type="date"
							clearable
						/>
					</n-config-provider>
				</n-form-item>
				<n-form-item label="企业面积" path="earea">
					<n-input
						v-model:value="formContent.earea"
						:disabled="editFlag"
						placeholder="请输入企业面积"
					/>
				</n-form-item>
				<n-form-item label="坐标" path="point">
					<n-button
						type="info"
						style="margin-right: 8px"
						:disabled="editFlag"
						@click="pointClick"
						>点位信息</n-button
					>
					<n-input
						v-model:value="formContent.point.plotting"
						:disabled="true"
						placeholder="点击左侧按钮获取点位信息"
					/>
				</n-form-item>
				<n-form-item label="监管分类" path="monitorType">
					<n-select
						v-model:value="formContent.monitorType"
						clearable
						placeholder="请选择监管分类"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="用户类型" path="userType">
					<n-select
						v-model:value="formContent.userType"
						clearable
						placeholder="请选择用户类型"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="污水量" path="sewageAmount">
					<n-input
						v-model:value="formContent.sewageAmount"
						:disabled="editFlag"
						placeholder="请输入污水量"
					/>
				</n-form-item>
				<n-form-item label="环保负责人" path="environmentManager">
					<n-input
						v-model:value="formContent.environmentManager"
						:disabled="editFlag"
						placeholder="请输入环保负责人"
					/>
				</n-form-item>
				<n-form-item
					label="环保负责人联系方式"
					path="environmentManagerContact"
				>
					<n-input
						v-model:value="formContent.environmentManagerContact"
						:disabled="editFlag"
						placeholder="请输入环保负责人联系方式"
					/>
				</n-form-item>
				<n-form-item label="是否关停" path="shutDown">
					<n-select
						v-model:value="formContent.shutDown"
						clearable
						placeholder="请选择是否关停"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="企业投产状态" path="operationStatus">
					<n-select
						v-model:value="formContent.operationStatus"
						clearable
						placeholder="请选择企业投产状态"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="企业执照类别" path="businessLicenseType">
					<n-select
						v-model:value="formContent.businessLicenseType"
						clearable
						placeholder="请选择企业执照类别"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="是否重大危险源" path="isDangerSource">
					<n-select
						v-model:value="formContent.isDangerSource"
						clearable
						placeholder="请选择是否重大危险源"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="重大危险等级" path="dangerSourceLevel">
					<n-select
						v-model:value="formContent.dangerSourceLevel"
						clearable
						placeholder="请选择重大危险等级"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="是否涉及重点监管化学品" path="isDangerousChemical">
					<n-select
						v-model:value="formContent.isDangerousChemical"
						clearable
						placeholder="请选择是否涉及重点监管化学品"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="重点监管化学品" path="dangerousChemical">
					<n-select
						v-model:value="formContent.dangerousChemical"
						clearable
						placeholder="请选择重点监管化学品"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="是否涉及剧毒产品生产或使用" path="poisonUse">
					<n-select
						v-model:value="formContent.poisonUse"
						clearable
						placeholder="请选择是否涉及剧毒产品生产或使用"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="是否涉及高危工艺" path="isHighRiskCraft">
					<n-select
						v-model:value="formContent.isHighRiskCraft"
						clearable
						placeholder="请选择是否涉及高危工艺"
						:options="selectOptions"
						:disabled="editFlag"
					/>
				</n-form-item>
				<n-form-item label="安全责任人" path="securityManager">
					<n-input
						v-model:value="formContent.securityManager"
						:disabled="editFlag"
						placeholder="请输入安全责任人"
					/>
				</n-form-item>
				<n-form-item label="安全责任人联系方式" path="securityManagerContact">
					<n-input
						v-model:value="formContent.securityManagerContact"
						:disabled="editFlag"
						placeholder="请输入安全责任人联系方式"
					/>
				</n-form-item>
				<n-form-item label="企业从业人员数量" path="employeeNum">
					<n-input
						v-model:value="formContent.employeeNum"
						:disabled="editFlag"
						placeholder="请输入企业从业人员数量"
					/>
				</n-form-item>
				<n-form-item label="特种作业人员数量" path="specialOperationPersonnel">
					<n-input
						v-model:value="formContent.specialOperationPersonnel"
						:disabled="editFlag"
						placeholder="请输入特种作业人员数量"
					/>
				</n-form-item>
				<n-form-item label="专职应急管理人员数量" path="manufacturePersonnel">
					<n-input
						v-model:value="formContent.manufacturePersonnel"
						:disabled="editFlag"
						placeholder="请输入专职应急管理人员数量"
					/>
				</n-form-item>
				<n-form-item
					label="兼职安全生产管理人员数量"
					path="partTimeManufacturePersonnel"
				>
					<n-input
						v-model:value="formContent.partTimeManufacturePersonnel"
						:disabled="editFlag"
						placeholder="请输入兼职安全生产管理人员数量"
					/>
				</n-form-item>
				<n-form-item label="注册安全工程师人数" path="securityEngineer">
					<n-input
						v-model:value="formContent.securityEngineer"
						:disabled="editFlag"
						placeholder="请输入注册安全工程师人数"
					/>
				</n-form-item>
				<n-form-item label="经营范围" path="businessScope">
					<n-input
						v-model:value="formContent.businessScope"
						:disabled="editFlag"
						placeholder="请输入经营范围"
					/>
				</n-form-item>
				<n-form-item label="企业概况" path="esurvey">
					<n-input
						v-model:value="formContent.esurvey"
						:disabled="editFlag"
						placeholder="请输入企业概况"
					/>
				</n-form-item>
				<n-form-item label="企业注册资金" path="registerFund">
					<n-input
						v-model:value="formContent.registerFund"
						:disabled="editFlag"
						placeholder="请输入企业注册资金"
					/>
				</n-form-item>
				<n-form-item label="企业标绘区域" path="chargePerson">
					<n-button
						:disabled="editFlag"
						type="info"
						style="margin-right: 8px"
						@click="getArea"
						>标绘区域</n-button
					>
					<n-input
						v-model:value="formContent.point.plotting"
						:disabled="true"
						placeholder="点击按钮获取标绘区域"
					/>
				</n-form-item>
			</n-form>
			<!-- <div class="iframeBox" @click="getLocation">
                <iframe v-if="mapFlag" src="../src/components/map/index.html" frameborder="0" style="width: 600px;height: 400px;"></iframe>
            </div> -->
		</div>
		<div class="list">
			<blue-title :prop-value="'企业证件'" />
			<div class="tableList">
				<!-- <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                    <n-data-table
                        :remote="true"
                        :bordered="false"
                        :columns="tableHead"
                        :data="tableData"
                        :loading="tableLoading"
                        :row-key="(row: any) => (row.code)"
                    />
                </n-config-provider> -->
				<table border="1" class="table">
					<tr class="tHead">
						<td>序号</td>
						<td>归属企业</td>
						<td>名称</td>
						<td>缩略图</td>
						<td>上传时间</td>
						<td>上传用户</td>
						<td>操作</td>
					</tr>
					<tr v-if="!tableData.length" class="not">
						<td></td>
						<td colspan="5" style="color: #ccc">暂无数据</td>
						<td></td>
					</tr>
					<tr v-for="(ele, index) in tableData" v-else :key="index">
						<td>{{ index + 1 }}</td>
						<td>{{ ele.company }}</td>
						<td>{{ ele.name }}</td>
						<td>
							<n-image :src="ele.img" alt=""></n-image>
						</td>
						<td>{{ ele.time }}</td>
						<td>{{ ele.user }}</td>
						<td>
							<n-button
								:disabled="editFlag"
								type="info"
								@click="downLoadPng(ele.img)"
								>下载</n-button
							>
							<n-button
								:disabled="editFlag"
								type="error"
								:style="{ marginLeft: '5px' }"
								@click="rowDelete(ele, '证件', index)"
								>删除</n-button
							>
						</td>
					</tr>
				</table>
			</div>
			<div class="topright">
				<n-space>
					<n-button
						:disabled="editFlag"
						type="primary"
						style="width: 150px"
						@click="upload('证件')"
						>上传证件</n-button
					>
				</n-space>
			</div>
		</div>
		<div class="list">
			<blue-title :prop-value="'企业文件'" />
			<div class="tableList">
				<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
					<!-- <n-data-table
                        :remote="true"
                        :bordered="false"
                        :columns="fileTableHead"
                        :data="fileTableData"
                        :pagination="pagination1"
                        :loading="tableLoading"
                        @update:page="handlePageChange1"
                        :row-key="(row: any) => (row.code)"
                        @update:checked-row-keys="handleCheck1"
                        @update:pageSize="handlePageSize1"
                    /> -->
					<!-- <n-data-table
                        :remote="true"
                        :bordered="false"
                        :columns="fileTableHead"
                        :data="fileTableData"
                        :loading="tableLoading"
                        :row-key="(row: any) => (row.code)"
                    /> -->
				</n-config-provider>
				<table border="1" class="table">
					<tr class="tHead">
						<td>序号</td>
						<td>归属企业</td>
						<td>名称</td>
						<td>上传时间</td>
						<td>上传用户</td>
						<td>操作</td>
					</tr>
					<tr v-if="!fileTableData.length" class="not">
						<td></td>
						<td colspan="4" style="color: #ccc">暂无数据</td>
						<td></td>
					</tr>
					<tr v-for="(ele, index) in fileTableData" v-else :key="index">
						<td>{{ index + 1 }}</td>
						<td>{{ ele.company }}</td>
						<td>{{ ele.name }}</td>
						<td>{{ ele.time }}</td>
						<td>{{ ele.user }}</td>
						<td>
							<n-button
								:disabled="editFlag"
								type="info"
								@click="downLoadPng(ele.img)"
								>下载</n-button
							>
							<n-button
								:disabled="editFlag"
								type="error"
								:style="{ marginLeft: '5px' }"
								@click="rowDelete(ele, '文件', index)"
								>删除</n-button
							>
						</td>
					</tr>
				</table>
			</div>
			<div class="topright">
				<n-space>
					<n-button
						:disabled="editFlag"
						type="primary"
						style="width: 150px"
						@click="upload('文件')"
						>上传文件</n-button
					>
				</n-space>
			</div>
		</div>
		<div class="list">
			<blue-title :prop-value="'企业图片'" />
			<div class="tableList">
				<!-- <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
                    <n-data-table
                        :remote="true"
                        :bordered="false"
                        :columns="imgTableHead"
                        :data="imgTableData"
                        :loading="tableLoading"
                        :row-key="(row: any) => (row.code)"
                    />
                </n-config-provider> -->
				<table border="1" class="table">
					<tr class="tHead">
						<td>序号</td>
						<td>归属企业</td>
						<td>名称</td>
						<td>缩略图</td>
						<td>上传时间</td>
						<td>上传用户</td>
						<td>操作</td>
					</tr>
					<tr v-if="!imgTableData.length" class="not">
						<td></td>
						<td colspan="5" style="color: #ccc">暂无数据</td>
						<td></td>
					</tr>
					<tr v-for="(ele, index) in imgTableData" v-else :key="index">
						<td>{{ index + 1 }}</td>
						<td>{{ ele.company }}</td>
						<td>{{ ele.name }}</td>
						<td>
							<n-image :src="ele.img" alt=""></n-image>
						</td>
						<td>{{ ele.time }}</td>
						<td>{{ ele.user }}</td>
						<td>
							<n-button
								:disabled="editFlag"
								type="info"
								@click="downLoadPng(ele.img)"
								>下载</n-button
							>
							<n-button
								:disabled="editFlag"
								type="error"
								:style="{ marginLeft: '5px' }"
								@click="rowDelete(ele, '图片', index)"
								>删除</n-button
							>
						</td>
					</tr>
				</table>
			</div>
			<div class="topright">
				<n-space>
					<n-button
						:disabled="editFlag"
						type="primary"
						style="width: 150px"
						@click="upload('图片')"
						>上传图片</n-button
					>
				</n-space>
			</div>
		</div>
		<n-modal
			v-model:show="showModalCancel"
			preset="dialog"
			type="error"
			:show-icon="false"
			title="取消"
			content="是否放弃更改"
			positive-text="确认"
			negative-text="取消"
			@positive-click="onPositiveClick"
			@negative-click="onNegativeClick"
		></n-modal>
		<n-modal
			v-model:show="deleteFlag"
			preset="dialog"
			type="error"
			:show-icon="false"
			title="删除"
			content="确认删除"
			positive-text="确认"
			negative-text="取消"
			@positive-click="onDeleteClick"
			@negative-click="onDeleteCancelClick"
		></n-modal>
		<n-modal
			v-model:show="showModal_newAdd"
			class="custom-card"
			preset="card"
			:style="{ width: '800px' }"
			:title="'上传' + form_details.name"
			size="huge"
			:bordered="false"
			:segmented="false"
		>
			<template #header-extra></template>
			<n-form :model="form_details">
				<n-grid :cols="24" :x-gap="24">
					<n-form-item-gi
						:span="24"
						label="归属企业名称"
						path="user.facilityName"
					>
						<n-input
							v-model:value="form_details.user.company"
							clearable
							:maxlength="formMaxLength"
							:disabled="disabled"
						/>
					</n-form-item-gi>
					<n-form-item-gi
						:span="24"
						:label="form_details.name + '名称'"
						path="user.number"
					>
						<n-input
							v-model:value="form_details.user.name"
							clearable
							:maxlength="formMaxLength"
							:disabled="disabled"
						/>
					</n-form-item-gi>
					<n-form-item-gi
						:span="24"
						:label="form_details.name + '上传'"
						path="user.state"
					>
						<n-upload
							:action="postUrl"
							type="multipart/form-data"
							:with-credentials="true"
							accept="*"
							method="POST"
							multiple="true"
							headers="{ 'Content-Type':'multipart/form-data' }"
							max="3"
							:show-file-list="false"
							:disabled="disabled"
							@finish="handleFinish"
							@preview="handlePreview"
							@success="hanld"
							@remove="removeList"
							@before-upload="beforeUpload"
						>
							<n-button>选择{{ form_details.name }}</n-button>
						</n-upload>
					</n-form-item-gi>
					<n-form-item-gi
						:span="24"
						:label="form_details.name + '信息'"
						path="user.state"
					>
						<table border="1" class="table">
							<tr class="tHead">
								<td>序号</td>
								<td>名称</td>
								<td v-if="form_details.name != '文件'">缩略图</td>
								<td>操作</td>
							</tr>
							<tr v-if="!fileList.length" class="not">
								<td></td>
								<td colspan="2">暂无{{ form_details.name }}</td>
								<td></td>
							</tr>
							<tr v-for="(ele, index) in fileList" v-else :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ ele.file.name }}</td>
								<td v-if="form_details.name != '文件'">
									<img :src="ele.file.url" alt="" />
								</td>
								<td>
									<n-button type="info" @click="downLoadPng(ele.file.url)"
										>下载</n-button
									>
									<n-button
										type="error"
										:style="{ marginLeft: '5px' }"
										@click="delPng(ele.file)"
										>删除</n-button
									>
								</td>
							</tr>
						</table>
					</n-form-item-gi>
				</n-grid>
			</n-form>
			<template #footer>
				<n-space>
					<n-button type="info" @click="sure(form_details.name)">确认</n-button>
					<n-button type="info" @click="cancel">取消</n-button>
				</n-space>
			</template>
		</n-modal>
		<n-modal
			v-model:show="mapFlag"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 700px; height: 600px"
			title="点位信息"
		>
			<template #header-extra></template>
			<mapBox @getPoint="getPoint" @cancelGet="mapFlag = false"></mapBox>
		</n-modal>
		<n-modal
			v-model:show="mapFlag1"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 700px; height: 600px"
			title="区域信息"
		>
			<template #header-extra></template>
			<iframe
				src="/src/components/mapArea/index.html"
				frameborder="0"
				style="width: 620px; height: 500px"
			></iframe>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
import { Ref, ref, reactive, h, onMounted, PropType, watch } from 'vue';
import blueTitle from '@components/public/title/index.vue';
import mapBox from '@components/mapBox/index.vue';
import moment from 'moment';
// naive_ui
import { zhCN, dateZhCN, NButton, NSpace, useMessage, NImage } from 'naive-ui';
// api
import information_api from '../../axios/api/essentialInformation/index';
import api_material from '../../axios/api/material/index';
import api_user from '../../axios/api/personal/index';

// ------------------------------------------------state-------------------------------------------------
// 取消模态框状态值
let showModalCancel = ref(false);
// 确认模态框状态值
let showModalConfirm = ref(false);
// 地图点位状态
let mapFlag = ref(false);
// 地图区域状态
let mapFlag1 = ref(false);
// 删除弹窗状态值
let deleteFlag = ref(false);
// 编辑flag
let editFlag: any = ref(true);
// 表格数据加载中
const tableLoading = ref(false);
// show_or_hidden_modal
const showModal_newAdd = ref(false);
// 下拉flag
const disabled = ref(false);
// ------------------------------------------------data-------------------------------------------------
// 传入数据
const props: any = defineProps({
	id: {
		type: String,
		default: () => {
			return '';
		},
	},
	editFlag: Boolean as PropType<true>,
});
// 传入表单编辑flag
// editFlag.value = props.editFlag
// 公司id
let companyId = ref('');
// 地图点位信息
let pointInfo = ref('');
// 地图标绘区域
let areaPoint = ref('');
// 表单图片地址
const imageUrl = ref();
// 绑定表单大小
let size = ref('medium');
// 表单最大限制
const formMaxLength = 24;
// 文件上传接口调用
let postUrl: any = api_material.uploadImg;
// 表单规则
let rules = ref({
	user: {
		name: {
			required: !editFlag.value,
			message: '请输入企业名称',
			trigger: ['input', 'blur'],
		},
		// age: {
		//     required: !editFlag.value,
		//     message: '请输入年龄',
		//     trigger: ['input', 'blur']
		// }
	},
	// phone: {
	//     required: !editFlag.value,
	//     message: '请输入电话号码',
	//     trigger: ['input', 'blur']
	// }
});
// 企业证件table_head
const tableHead = reactive([
	// {
	//     type: 'selection',
	// },
	{
		title: '序号',
		key: 'index',
		width: 60,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '归属企业',
		key: 'company',
		// width: 120,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '企业证件名称',
		key: 'name',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '缩略图',
		key: 'smallImage',
		render(row: any, index: number) {
			return h(NImage, { width: '100', src: row.img }, [
				// h("img", { class: "tableImage", src: row.img}),
				// h("img", { class: "tableImage", src: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" }),
			]);
		},
	},
	{
		title: '上传时间',
		key: 'time',
		// width: 200,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '上传用户',
		key: 'user',
		// width: 160,
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'operation',
		width: 135,
		fixed: 'right',
		render(row: any, index: number) {
			return h(
				NSpace,
				{
					justify: 'end',
				},
				[
					h(
						NButton,
						{
							size: 'small',
							type: 'warning',
							// class: 'n-button--disabled',
							onClick: () => downLoadPng(row.img),
						},
						{ default: () => '下载' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'error',
							// class: 'n-button--disabled',
							onClick: () => rowDelete(row, '证件', index),
						},
						{ default: () => '删除' }
					),
				]
			);
		},
	},
]);
// 企业证件table_data
const tableData: any = ref([]);
// 企业文件table_data
const fileTableData: any = ref([]);
// 企业图片table_data
const imgTableData: any = ref([
	// {
	//     key: 0,
	//     index: 1,
	//     company: 'adfasdf',
	//     name: 'asdfasdf',
	//     img: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
	//     time: 'asdfasdf',
	//     user: 'asdfasdf',
	//     role: 'asdfasdf',
	//     createTime: 'asdfasdf',
	// },
]);
// pagination
const pagination = reactive({
	itemCount: 0, //数据总条数
	pageCount: 5, //总共显示几个页码
	page: 1, //当前显示页码
	pageSize: 5, //每页显示数据条数
	pageSizes: [5, 10], //每页显示几条
	showSizePicker: true,
	suffix: ({ itemCount }: any) => {
		return `总共${itemCount}条`;
	},
});
// 表单数据
let formContent: any = ref({
	id: '131',
	trustNum: null,
	platform: '0',
	corporate: null,
	industry: '竹制品行业',
	address: null,
	contactPerson: null,
	contactNum: null,
	dangerousChemical: '无',
	highRiskCraft: null,
	dangerSourceLevel: null,
	riskLevel: '稍有危险，可以接受',
	riskDistribution: null,
	createTime: null,
	startTime: null,
	mainProducts: '布制品',
	operationTime: null,
	economyType: null,
	monitorType: null,
	userType: null,
	displacement: null,
	environmentManager: null,
	environmentManagerContact: null,
	shutDown: null,
	operationStatus: null,
	businessLicenseType: null,
	isDangerSource: '否',
	isDangerousChemical: '否',
	poisonUse: null,
	isHighRiskCraft: '否',
	securityManager: null,
	securityManagerContact: null,
	employeeNum: null,
	specialOperationPersonnel: null,
	manufacturePersonnel: null,
	emergencyPersonnel: null,
	partTimeManufacturePersonnel: null,
	securityEngineer: null,
	businessScope: null,
	securityStandardLevel: '三级(已过期)',
	isDelete: '0',
	status: null,
	emissionType: null,
	tripleSameTime: '是',
	registerFund: null,
	sewageAmount: null,
	companyId: '131',
	fileUrl: [
		// {
		// 	id: 'd54ed409a0ce4a349d94cf380f157c1f',
		// 	url: 'http://10.51.100.70:9000/sw-park/2022/01/27/75c9429e-db88-4f5f-9777-de870e182af9.jpg',
		// 	type: 'ENTERPRISE_FILE',
		// 	ywid: '131',
		// 	createTime: null,
		// 	startTime: null,
		// 	exactType: 'picture',
		// 	fileName: null,
		// },
		// {
		// 	id: 'd0bd6077a0bc4538b7cae1d92f345f02',
		// 	url: 'http://10.51.100.70:9000/sw-park/2022/02/10/1396bec1-97fd-4d44-a2c8-7c0f3f5ae8ab.jpg',
		// 	type: 'ENTERPRISE_FILE',
		// 	ywid: '131',
		// 	createTime: null,
		// 	startTime: null,
		// 	exactType: 'certificate',
		// 	fileName: null,
		// },
		// {
		// 	id: '31016fa9e1ed4f93b764545d7802d04f',
		// 	url: 'http://10.51.100.70:9000/sw-park/2022/02/10/cab561c3-e0a2-4ead-a1fc-a1978906998f.docx',
		// 	type: 'ENTERPRISE_FILE',
		// 	ywid: '131',
		// 	createTime: null,
		// 	startTime: null,
		// 	exactType: 'profile',
		// 	fileName: null,
		// },
	],
	point: {
		id: '6ff06a1dfa6b41928238408e7a499ee6',
		ywId: '1960a49c16904d99b23e3702bb72417d',
		longitude: '6',
		latitude: '5',
		startTime: null,
		createTime: null,
		plotting: 'POINT(0 0)',
	},
	esurvey: null,
	earea: null,
	ecreateTime: '1970-01-01',
	ename: '福建省邵武中森实业（集团）有限公司',
	vector: null,
});
// 下拉选项
const selectOptions = ref([
	[
		{
			label: '超级管理员',
			value: '0',
			code: '0',
		},
		{
			label: '普通人员',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '超级管理员',
			value: '0',
			code: '0',
		},
		{
			label: '普通人员',
			value: '1',
			code: '1',
		},
	],
	[
		{
			label: '超级管理员',
			value: '0',
			code: '0',
		},
		{
			label: '普通人员',
			value: '1',
			code: '1',
		},
	],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
]);
// form_details
const form_details = reactive({
	name: '文件上传',
	user: {
		company: formContent.value.ename,
		name: '',
		repository: '储存仓库',
		storageMethod: '储存方式',
		classify: '类别',
		dangerClassify: '危险类别',
		maxSize: '最大储存量',
		yearSize: '年产量',
		isImportant: '重点监管',
		isVirulent: '剧毒',
		isEasypoison: '易致毒',
		remark: '备注',
		id: '',
	},
});
// 用户信息
const personalDatas: any = ref({
	name: 'aaa',
	account: '',
	password: '',
	phone: '',
	deptName: '',
	roleCode: '',
});

// ------------------------------------------------methods-------------------------------------------------
// 企业id查询
if (props.id == '') {
	companyId.value = personalDatas.value.companyId;
} else {
	// eslint-disable-next-line vue/no-setup-props-destructure
	companyId.value = props.id;
}
// 调用消息通知
const message = useMessage();
// 获取去下拉框选项
const getSelectData = () => {
	let arr = [6, 33, 9, 5, 11, 8, 12];
	selectOptions.value = [];
	arr.forEach((item: any, index: any) => {
		information_api.getSelectOption(item).then((res: any) => {
			var arr1: any = [];
			if (res.code == 200) {
				res.data.forEach((ele: any, i: any) => {
					let obj = {
						label: ele.name,
						value: String(i),
						code: String(i),
					};
					arr1.push(obj);
				});
			}
			selectOptions.value.push(arr1);
		});
	});
	console.log('下拉框选项', selectOptions.value);
};
// getSelectData()
// 获取点位信息
const getPoint = (point: any) => {
	// form_details.user.location = point
	// showMap.value = false
	formContent.value.point.plotting = point;
	mapFlag.value = false;
};
// 获取区域信息
const getArea = (point: any) => {
	// form_details.user.location = point
	// showMap.value = false
	// formContent.value.vector = point
	mapFlag1.value = true;
	console.log('打开标绘区域');
};
// 点位点击
let pointClick = () => {
	mapFlag.value = !mapFlag.value;
	console.log(window.point);
};
// 文件上传
let fileList: any = ref([]);
// 文件上传完成
const handleFinish = ({ event, file }: { event: any; file: any }) => {
	// fileList.length = 0

	const {
		code,
		data: { name, url },
	} = JSON.parse(event.target.response);
	file.url = url;
	// uploadUrl.value = url
	let time = moment().format('YYYY-MM-DD');
	fileList.value.push({
		event,
		file,
		time: time,
		name: form_details.user.name,
	});
	console.log(fileList.value);
};
const handlePreview = (e: any) => {
	console.log(e, '999999');
};
const hanld = (e: any) => {
	console.log(e);
};
// 清空上传文件临时保存
const removeList = (e: any) => {
	console.log(e, 'eeeeeeeeee');
	fileList.value.length = 0;
};
// 文件上传前校验
const beforeUpload = (data: any) => {
	if (data.file.file?.type !== 'image/png') {
		message.error('只能上传png格式的图片文件，请重新上传');
		return false;
	}
	return true;
};
// 下载
const downLoadPng = (url: any) => {
	if (url) {
		message.success('下载成功');
	} else {
		message.error('下载失败');
		return;
	}
	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url + '?response-content-type=application/octet-stream';
	// a.target='_blank'
	let index = url.lastIndexOf('.');
	var subBack = url.substring(index + 1, url.length);
	a.setAttribute('download', 'download.' + subBack);
	// a.download = data.url;
	document.body.appendChild(a);
	a.click();
	a.remove();
};
// 上传文件临时列表删除
const delPng = (item: any) => {
	fileList.value.forEach((ele: any, index: number) => {
		if (item.name === ele.file.name) {
			fileList.value.splice(index, 1);
		}
	});
};
// 获取用户信息
let getUserInfo = () => {
	api_user.getUserData().then((res) => {
		personalDatas.value = res.data;
		console.log('用户信息', personalDatas.value);
	});
};
// 文件上传确认方法
const sure = (type: any) => {
	console.log(type);
	let fileType: string;
	if (type == '图片') {
		fileType = 'picture';
	} else if (type == '文件') {
		fileType = 'profile';
	} else {
		fileType = 'certificate';
	}
	if (formContent.value.fileUrl == null) {
		formContent.value.fileUrl = [];
	}
	fileList.value.forEach((item: any) => {
		let obj: any = {
			url: item.file.url,
			exactType: fileType,
			userUpload: personalDatas.value.name,
			createTime: item.time,
			fileName: item.name,
		};
		formContent.value.fileUrl.push(obj);
	});
	// update()
	updatePageFile();
	message.success('文件上传成功');
	showModal_newAdd.value = false;
	fileList.value = [];
	form_details.user.name = '';
};
// 更新文件页面缓存
let updatePageFile = () => {
	let fileUrl = formContent.value.fileUrl,
		imgCount = 0,
		fileCount = 0,
		certificateCount = 0;
	imgTableData.value = [];
	fileTableData.value = [];
	tableData.value = [];
	if (fileUrl) {
		fileUrl.forEach((item: any, index: any) => {
			if (item.exactType == 'picture') {
				imgCount++;
				let obj = {
					index: imgCount,
					company: formContent.value.ename,
					name: item.fileName,
					img: item.url,
					time: item.createTime,
					user: item.userUpload,
					number: index,
				};
				imgTableData.value.push(obj);
			} else if (item.exactType == 'profile') {
				fileCount++;
				let obj = {
					index: fileCount,
					company: formContent.value.ename,
					name: item.fileName,
					img: item.url,
					time: item.createTime,
					user: item.userUpload,
				};
				fileTableData.value.push(obj);
			} else {
				certificateCount++;
				let obj = {
					index: certificateCount,
					company: formContent.value.ename,
					name: item.fileName,
					img: item.url,
					time: item.createTime,
					user: item.userUpload,
					number: index,
				};
				tableData.value.push(obj);
			}
		});
	}

	console.log(imgTableData.value);
};
// 文件上传取消
const cancel = () => {
	showModal_newAdd.value = false;
	fileList.value = [];
	message.info('取消上传');
	console.log(fileList.value);
	form_details.user.name = '';
};
// 文件删除
let rowDelete = (row: any, name: any, index: any) => {
	formContent.value.fileUrl.splice(row.number, 1);
	if (name == '证件') {
		tableData.value.splice(index, 1);
	} else if (name == '文件') {
		fileTableData.value.splice(index, 1);
	} else {
		imgTableData.value.splice(index, 1);
	}
	console.log(formContent.value.fileUrl);

	// deleteFlag.value = true
};
// 确认删除文件
let onDeleteClick = () => {
	console.log('确认删除');
};
// 取消删除文件
let onDeleteCancelClick = () => {
	message.success('取消成功');
};
// 地图点击事件
let getLocation = () => {
	console.log('点击iframe');

	let pointInfo = document.getElementsByTagName('iframe')[0].contentWindow;
	if (pointInfo) {
		console.log(pointInfo.location);
	}
};
// 分页翻页
const handlePageChange = (currentPage: number) => {
	console.log(currentPage);
};
// 展示多少页
const handlePageSize = (pageSizes: number) => {
	console.log(pageSizes);
};
// 表格当前选中行
const handleCheck = async (rowKeys: any) => {
	console.log(rowKeys);
};
// 文件上传按钮
const upload = (name: string) => {
	form_details.name = name;
	showModal_newAdd.value = true;
};
// 查看大图
const showBigImage = () => {
	const img = new Image();
	img.src = imageUrl.value;
	const newWin: any = window.open('', '_blank');
	newWin.document.write(img.outerHTML);
};
// 编辑方法
let query = (state: boolean) => {
	editFlag.value = state;
	rules.value.user.name.required = !state;
};
// 保存方法
let query1 = (state: boolean) => {
	console.log(formContent.value);
	if (formContent.value.ename == '') {
		message.error('请输入企业名称');
		return;
	}
	update();
};
// 更改数据方法
let update = () => {
	const parmas: any = JSON.parse(JSON.stringify(formContent.value));
	console.log('更新上传数据', parmas);
	information_api.updateEnterprise(parmas).then((res: any) => {
		console.log('更新返回数据', res);

		if (res.code == 200) {
			console.log('更新企业信息');
			getData();
			message.success('保存成功');
			editFlag.value = true;
		} else {
			console.log(res);

			message.error('保存失败');
		}
	});
};
let onNegativeClick: any = () => {
	// message.success('Cancel')
	showModalCancel.value = false;
};
let onPositiveClick = () => {
	message.success('取消成功');
	showModalCancel.value = false;
	editFlag.value = true;
	getData();
};
let tempData: Ref<any> = ref();
// 根据公司id获取数据
let getData = () => {
	// console.log(props.id);

	information_api.getInformationDataById(companyId.value).then((res: any) => {
		if (res.code == 200) {
			console.log('id获取数据', res);
			// for (let key in res.data) {
			// 	if (res.data[key]) {
			// 		formContent.value[key] = res.data[key];
			// 	}
			// }
			formContent.value = res.data;
			// formContent.value = res.data
			// console.log('根据id获取数据',res.data);
			if (formContent.value.point == null) {
				formContent.value.point = {
					id: '6ff06a1dfa6b41928238408e7a499ee6',
					ywId: '1960a49c16904d99b23e3702bb72417d',
					longitude: '6',
					latitude: '5',
					startTime: null,
					createTime: null,
					plotting: 'POINT(0 0)',
				};
			}
			updatePageFile();
		}
	});
};
// 下载word
let downLoadWordByName = () => {
	information_api
		.getCompanyWord('131')
		.then((res: any) => {
			const link = document.createElement('a');
			const blob = new Blob([res]);
			link.style.display = 'none';
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', '企业详情.zip');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(link.href);
		})
		.catch(function (error) {
			message.error('下载失败');
		});
};
onMounted(() => {
	getSelectData();
	getData();
	getUserInfo();
	console.log(formContent.value);
	window.point = pointInfo.value;
});
// downLoadWordByName()
watch(
	() => props.data,
	(prev, next) => {
		if (prev) {
			tempData.value = prev;
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
</script>

<style lang="postcss" scoped>
.contentList {
	position: relative;
	width: 100%;
	.listContent {
		/* position: fixed; */
		top: 100px;
		/* width: calc(100% - 335px); */
		width: 100%;
		height: 50px;
		border-radius: 10px;
		background: #c6e3f54a;
		z-index: 10;
		> :first-child {
			margin-right: 20px;
			float: right;
		}
	}
	.basicContent {
		margin-top: 30px;
		width: 100%;
		border-radius: 10px;
		background: #fff;
		.contentBox {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: 34px;
		}
		.n-form-item {
			margin: 40px 70px;
			width: 250px;
			:deep(.n-form-item-label) {
				font-size: 20px;
			}
		}
	}
	.enterpriseDetails {
		margin-top: 20px;
		width: 100%;
		border-radius: 10px;
		background: #fff;
		.n-form-item {
			margin: 40px 70px;
			width: 250px;
			:deep(.n-form-item-label) {
				font-size: 20px;
			}
		}
	}
	.list {
		position: relative;
		margin-top: 20px;
		background-color: white;
		border-radius: 10px;
		padding: 10px;
		.topright {
			position: absolute;
			top: 10px;
			right: 20px;
		}
	}
	.tableDiv {
		width: 120px;
		height: 60px;
		overflow: hidden;
		.tableImage {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
<style lang="postcss">
.tableDiv {
	width: 120px;
	height: 60px;
	overflow: hidden;
	.tableImage {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
.table {
	width: 100%;
	margin-bottom: 10px;
	tr {
		height: 50px;
		text-align: center;
		border: 1px solid rgb(241, 241, 241);
		transition: all 0.1s;
		td:nth-child(1) {
			width: 80px;
		}
		td:nth-child(2) {
			width: 180px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	tr + tr:hover {
		background: rgba(241, 241, 241, 0.664);
	}
	.tHead {
		background: rgba(241, 241, 241, 0.664);
	}
	td {
		img {
			width: 50px;
			height: 50px;
			margin: 0 5px;
		}
	}
}
:deep(.n-card__content) {
	padding: 10px 40px;
}
</style>
