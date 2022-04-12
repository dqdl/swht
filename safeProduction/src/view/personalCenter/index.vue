<template>
	<div class="personal">
		<div class="head">个人中心</div>

		<div class="cont">
			<div class="imgs">
				<div class="img">
					<p></p>
					<p>
						<span>登录时间</span>
						<span>2022.04.03 14:00</span>
					</p>
				</div>
				<div class="img">
					<p></p>
					<p>
						<span>登录IP</span>
						<span>192.168.1.1</span>
					</p>
				</div>
				<div class="img">
					<p></p>
					<p>
						<span>设备类型</span>
						<span>计算机</span>
					</p>
				</div>
			</div>
			<div class="bottom">
				<div class="mesgs">
					<div class="headImg"></div>
					<p class="name">超级系统管理员</p>
					<div
						:class="['disc', showContent.showNews ? '' : 'active']"
						@click="showUserData"
					>
						<span>个人信息</span>
					</div>
					<div class="dask">
						<p
							:class="[
								showContent.showNews && showContent.newsType === 0
									? 'active'
									: '',
							]"
						>
							<span @click="changeContent(0)">我的通知</span>
							<span @click="jumpTo('news')">{{ showContent.news }}</span>
						</p>
						<p
							:class="[
								showContent.showNews && showContent.newsType === 1
									? 'active'
									: '',
							]"
						>
							<span @click="changeContent(1)">我的任务</span>
							<span>99</span>
						</p>
					</div>
				</div>
				<div v-if="!showContent.showNews" class="userData">
					<div class="item">
						<p>
							<span></span>
							<span>姓名</span>
						</p>
						<input v-model="personalDatas.name" type="text" disabled />
					</div>
					<div class="item">
						<p>
							<span></span>
							<span>账号</span>
						</p>
						<input v-model="personalDatas.account" type="text" disabled />
					</div>
					<div class="item" @click="showUpdateBox('修改手机号')">
						<p>
							<span></span>
							<span>手机号</span>
						</p>
						<input v-model="personalDatas.phone" type="text" disabled />
					</div>
					<div class="item" @click="showUpdateBox('修改密码')">
						<p>
							<span></span>
							<span>密码</span>
						</p>
						<input v-model="personalDatas.password" type="password" disabled />
					</div>
					<div class="item">
						<p>
							<span></span>
							<span>部门</span>
						</p>
						<input v-model="personalDatas.deptName" type="text" disabled />
					</div>
					<div class="item">
						<p>
							<span></span>
							<span>用户角色</span>
						</p>
						<input v-model="personalDatas.roleCode" type="text" disabled />
					</div>
					<n-button v-if="notEdit" type="info" class="updataBtn" @click="edit"
						>编辑</n-button
					>
					<div v-else class="editBtn">
						<n-button type="info" class="btn-item" @click="updateUserData"
							>保存</n-button
						>
						<n-button type="info" class="btn-item" @click="cancleEdit"
							>取消</n-button
						>
					</div>
				</div>
				<userNews v-else :news-type="showContent.newsType"></userNews>
			</div>
		</div>
		<n-modal
			v-model:show="showBox"
			preset="card"
			size="huge"
			:bordered="false"
			:segmented="false"
			style="width: 500px; height: 500px"
			:title="showBoxTitle"
		>
			<n-form ref="formRef" :model="updateList">
				<n-grid :cols="24" :x-gap="24">
					<n-form-item-gi
						v-for="(ele, index) in Object.keys(updateList[showBoxTitle])"
						:key="index"
						:span="18"
						:label="ele"
					>
						<n-input-group v-if="ele === '验证码'" n-button>
							<n-input
								v-model:value="updateList[showBoxTitle][ele]"
								clearable
								:placeholder="ele"
							/>
							<n-button v-if="!active" type="primary" ghost @click="sendCode">
								获取验证码
							</n-button>
							<span
								v-if="active"
								style="
									padding: 0 37px;
									border: 1px solid rgb(224, 224, 230);
									line-height: 32px;
									color: #666;
								"
							>
								<n-countdown
									:render="renderCountdown"
									:duration="60000"
									:active="active"
									@finish="endSend"
								/>
							</span>
						</n-input-group>
						<n-input
							v-else
							v-model:value="updateList[showBoxTitle][ele]"
							clearable
							:placeholder="ele"
						/>
					</n-form-item-gi>
					<n-form-item-gi :span="18" label="" path="user.role">
						<n-space>
							<n-button type="info" @click="sureUp">确认</n-button>
							<n-button type="info" @click="cancelUp">取消</n-button>
						</n-space>
					</n-form-item-gi>
				</n-grid>
			</n-form>
		</n-modal>
	</div>
</template>

<script lang="ts" setup>
// import personalMesg from "@/pages/personalCenter/personalMesg.vue"
import userNews from '@/view/personalCenter/userNews.vue';
import { useMessage, NSpace, CountdownProps } from 'naive-ui';
import { ref, onMounted, reactive } from 'vue';
import router from '../../router';
import { getMyNewsData } from '../../http/api/myNews/index';
import { personalData } from '../../http/api/personal/index';
const loginMesg = ref({
	time: '2022年1月4日17:37:54',
	ip: '192.168.1.1',
	type: 'computer',
});

const personalDatas: any = ref({
	name: 'aaa',
	account: '',
	password: '',
	phone: '',
	deptName: '',
	roleCode: '',
});
const emit = defineEmits(['getemits']);
const goBack = () => {
	router.go(-1);
};
let showContent: any = ref({
	showNews: false,
	newsType: 0, // 0是通知，1是任务
	news: 0, // 通知数
});

const getUserData = () => {
	personalData.personal.getUserData().then((res: any) => {
		personalDatas.value = res.data;
	});
	getMyNewsData.getMyNews
		.myToBeReadList({
			current: 1,
			size: 10,
		})
		.then((res: any) => {
			showContent.value.news = res.data.total;
		});
};
// 消息组件
// const message = useMessage()
const updateUserData = () => {
	if (
		personalDatas.value.name &&
		personalDatas.value.account &&
		personalDatas.value.account
	) {
		for (let i in personalDatas.value) {
			if (!personalDatas.value[i]) {
				delete personalDatas.value[i];
			}
		}
		personalData.personal
			.updateUserData(personalDatas.value)
			.then((res: any) => {
				// message.success('修改成功')
				notEdit.value = true;
				getUserData();
			});
	} else {
		// message.error('请将账号密码填写完整')
	}
};
const cancleEdit = () => {
	notEdit.value = true;
	getUserData();
};
const edit = () => {
	notEdit.value = false;
};
const jumpTo = (str: string) => {
	emit('getemits', 'goToNews');
	if (str === 'news') {
		router.push('/myNews');
	}
};
const changeContent = (index: number) => {
	showContent.value.showNews = true;
	showContent.value.newsType = index;
};
const showUserData = () => {
	showContent.value.showNews = false;
	showContent.value.newsType = 0;
};

let notEdit: any = ref(true);
let showBox = ref(false);
let showBoxTitle: any = ref('修改手机号');
const showUpdateBox = (str: any) => {
	if (!notEdit.value) {
		showBox.value = true;
		showBoxTitle.value = str;
	}
};
const updateList: any = reactive({
	修改手机号: {
		原手机号: '',
		新手机号: '',
		确认手机号: '',
		验证码: '',
	},
	修改密码: {
		原密码: '',
		新密码: '',
		确认密码: '',
		验证码: '',
	},
});
const sureUp = () => {
	let flag = true;
	for (let x in updateList[showBoxTitle.value]) {
		if (!updateList[showBoxTitle.value][x]) {
			flag = false;
		}
	}
	if (showBoxTitle.value === '修改手机号') {
		if (
			updateList[showBoxTitle.value]['新手机号'] !==
			updateList[showBoxTitle.value]['确认手机号']
		) {
			flag = false;
		}
	} else if (showBoxTitle.value === '修改密码') {
		if (
			updateList[showBoxTitle.value]['新密码'] !==
			updateList[showBoxTitle.value]['确认密码']
		) {
			flag = false;
		}
	}
	alert(flag);
};
const cancelUp = () => {
	showBox.value = false;
	showBoxTitle.value = '修改手机号';
};
// 获取验证码
let active = ref(false);
const sendCode = () => {
	active.value = true;
};
// 倒计时结束
const endSend = () => {
	active.value = false;
};
const renderCountdown: CountdownProps['render'] = ({ seconds }) => {
	return `${String(seconds).padStart(2, '0')}s`;
};
onMounted(() => {
	getUserData();
});
</script>

<style lang="postcss" scoped>
.personal {
	width: 1100px;
	height: 700px;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	border-radius: 20px;
	background: #eaf2f7;
	position: relative;
	.head {
		width: 100%;
		height: 70px;
		background: #46596d;
		border-radius: 20px 20px 0px 0px;
		font-size: 25px;
		color: #fff;
		line-height: 70px;
		text-align: center;
	}
	.cont {
		width: 100%;
		height: calc(100% - 70px);
		padding: 0 30px;
		.imgs {
			display: flex;
			justify-content: space-between;
			margin-top: 18px;
		}
		.img {
			height: 112px;
			width: 326px;
			position: relative;
			p:nth-child(1) {
				width: 98px;
				height: 98px;
				position: absolute;
				left: 14px;
				top: 0;
				background: url('@/assets/images/header/img1.png') no-repeat;
				z-index: 5;
			}
			p:nth-child(2) {
				width: 326px;
				height: 88px;
				opacity: 0.7;
				position: absolute;
				background: #1e9fff;
				border-radius: 10px;
				left: 0;
				bottom: 0;
				padding-left: 134px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: #fff;
				line-height: 25px;
				span:nth-child(1) {
					font-size: 14px;
					opacity: 0.7;
				}
				span:nth-child(2) {
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
		.img:nth-of-type(2) {
			p:nth-child(1) {
				width: 153px;
				background: url('@/assets/images/header/img2.png') no-repeat;
			}
			p:nth-child(2) {
				padding-left: 183px;
				background: #ffa138;
			}
		}
		.img:nth-of-type(3) {
			p:nth-child(1) {
				width: 146px;
				background: url('@/assets/images/header/img3.png') no-repeat;
			}
			p:nth-child(2) {
				padding-left: 183px;
				background: #28ce76;
			}
		}
	}
	.bottom {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 30px;
		.mesgs {
			width: 300px;
			height: 451px;
			background: #ffffff;
			border-radius: 10px;
			position: relative;
			.headImg {
				margin-left: 90px;
				margin-top: 30px;
				background: url('../../assets/images/header/user.png') no-repeat;
				background-size: 100% 100%;
				height: 120px;
				width: 120px;
				border-radius: 50%;
			}
			.name {
				text-align: center;
				font-size: 16px;
				font-weight: 700;
				color: #1e9fff;
				line-height: 56px;
				margin: 0 20px;
				border-bottom: 2px dashed #b7d0e9;
			}
			.disc {
				margin: 0px auto;
				margin-top: 20px;
				width: 260px;
				height: 60px;
				/* opacity: 0.1; */
				font-weight: 500;

				span {
					opacity: 1;

					line-height: 60px;
					font-size: 14px;
					margin-left: 10px;
				}
			}
			.active {
				color: #1e9fff;
				background: linear-gradient(90deg, #1f9eff46, rgba(30, 159, 255, 0));
			}
			.dask {
				width: 100%;
				height: 120px;
				box-sizing: border-box;
				padding: 0 20px;
				p {
					display: flex;
					justify-content: space-between;
					align-items: center;
					cursor: pointer;
					height: 60px;
					padding-left: 10px;
					span:nth-child(1) {
						font-size: 14px;
						color: #333;
						font-weight: 500;
						line-height: 60px;
						flex: 1;
					}
					span:nth-child(2) {
						width: 32px;
						height: 32px;
						background: #ff9924;
						border-radius: 50%;
						font-size: 14px;
						font-weight: 500;
						text-align: center;
						line-height: 32px;
						color: #ffffff;
					}
				}
			}
		}
	}
	.userData {
		width: 710px;
		height: 451px;
		background: #fff;
		border-radius: 10px;
		font-size: 14px;
		padding: 0 30px;
		position: relative;
		.item {
			width: 100%;
			display: flex;
			justify-content: space-between;
			height: 64px;
			align-items: center;
			border-bottom: 2px dashed #b7d0e9;
			cursor: pointer;
			input {
				border: 0;
				outline: 0;
				background: #fff;
				height: 56px;
				width: 80%;
				text-align: right;
				cursor: pointer;
			}
			p {
				display: flex;
				align-items: center;
				span:nth-child(1) {
					width: 16px;
					height: 16px;
					background: url('../..//assets/images/header/lingxing.png') no-repeat
						center center;
					background-size: 100% 100%;
				}
				span:nth-child(2) {
					margin-left: 16px;
					font-weight: 600;
				}
			}
		}
	}
	.updataBtn {
		position: absolute;
		right: 50px;
		bottom: 10px;
	}
	.editBtn {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		position: absolute;
		right: 50px;
		bottom: 10px;
		/* padding-right: 65px; */
		.btn-item + .btn-item {
			margin-left: 10px;
		}
	}
}
</style>
