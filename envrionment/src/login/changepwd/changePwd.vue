<template>
	<div class="changepwd">
		<div class="changepwd_box">
			<div class="changepwd_title">
				<div>
					<img src="@/assets/images/login/user_c_pwd.png" />
					<div>修改密码</div>
				</div>
			</div>
			<div>
				<div class="change_phone user_input">
					<div class="change_phone_img user_input_img">
						<img src="@/assets/images/login/user_phone.png" />
					</div>
					<input
						v-model="user.account"
						type="text"
						:placeholder="changepwdData.placeholder"
					/>
				</div>
				<div class="change_pwd user_input">
					<div class="change_pwd_img user_input_img">
						<img src="@/assets/images/login/user_pwd.png" />
					</div>
					<input
						v-model="user.password"
						:type="pwdShow.password"
						placeholder="请输入密码"
					/>
					<div
						class="change_pwd_show_img user_input_img user_input_img_none csspointer"
					>
						<img
							src="@/assets/images/login/user_pwd_show.png"
							@click="isShow(1)"
						/>
					</div>
				</div>
				<!-- <div class="change_code user_input">
          <div class="change_code_img user_input_img">
            <img src="@/assets/images/login/user_code.png" />
          </div>
          <input type="text" placeholder="请输入验证码" />
          <div style="width: 140px;height:100%;" class="user_input_code">
            <img src="@/assets/images/login/test_code.png" />
          </div>
        </div>-->
				<div class="change_new_pwd1 user_input">
					<div class="user_pwd_img user_input_img">
						<img src="@/assets/images/login/user_pwd.png" />
					</div>
					<input
						v-model="user.newPassword"
						:type="pwdShow.newPassword"
						placeholder="请输入修改密码"
						@keyup="keyNewPassword"
					/>
					<div
						class="change_pwd_show_img user_input_img user_input_img_none csspointer"
					>
						<img
							src="@/assets/images/login/user_pwd_show1.png"
							@click="isShow(2)"
						/>
					</div>
					<safegrade :level="changepwdData.level" />
				</div>
				<div class="change_new_pwd2 user_input">
					<div class="user_pwd_img user_input_img">
						<img src="@/assets/images/login/user_pwd.png" />
					</div>
					<input
						v-model="user.newTwoPassword"
						:type="pwdShow.newTwoPassword"
						placeholder="请再次输入修改密码"
					/>
					<div
						class="user_pwd_show_img user_input_img user_input_img_none csspointer"
					>
						<img
							src="@/assets/images/login/user_pwd_show1.png"
							@click="isShow(3)"
						/>
					</div>
				</div>
				<div class="user_smb_btn">
					<n-button color="#1e9fff" type="success" @click="changePwdBtn"
						>确定重置</n-button
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useMessage } from 'naive-ui';
import safegrade from '../components/safegrade.vue';
import { verification } from '../../../src/util/verification';
// 路由对象
let router = useRouter();
// 消息组件
// const message = useMessage();
// 确定用户类型
let changepwd = sessionStorage.getItem('changepwd');
// 验证
let {
	verificauser,
	verificapwd,
	AnalyzePasswordSecurityLevel,
	verificanewpwd,
} = verification();
// 数据
let changepwdData = reactive({
	len: '',
	placeholder: '请输入手机号',
	level: 0,
});
// 用户输入数据
let user = reactive({
	account: '',
	password: '',
	newPassword: '',
	newTwoPassword: '',
});
// 对三种密码显示隐藏
let pwdShow = reactive({
	password: 'password',
	newPassword: 'password',
	newTwoPassword: 'password',
});
// 初始化
const init = () => {
	if (changepwd == '1') {
		changepwdData.placeholder = '请输入手机号';
	} else {
		changepwdData.placeholder = '请输入企业社会信用代码';
	}
};
// 验证密码安全性
const keyNewPassword = () => {
	let PasswordSecurityLevel = AnalyzePasswordSecurityLevel(user.newPassword);
	changepwdData.level = PasswordSecurityLevel;
};
// 三种密码显示隐藏
const isShow = (num: number) => {
	if (num === 1) {
		pwdShow.password = pwdShow.password == 'password' ? 'text' : 'password';
	} else if (num === 2) {
		pwdShow.newPassword =
			pwdShow.newPassword == 'password' ? 'text' : 'password';
	} else {
		pwdShow.newTwoPassword =
			pwdShow.newTwoPassword == 'password' ? 'text' : 'password';
	}
};
// 密码修改提交
const changePwdBtn = () => {
	let userMsg = verificauser(user.account);
	let pwdMsg = verificapwd(user.password);
	let newpwdMsg = verificanewpwd(user.newPassword);
	if (typeof userMsg === 'string') {
		// message.error(userMsg, { duration: 3000 })
		return;
	}
	if (typeof pwdMsg === 'string') {
		// message.error(pwdMsg, { duration: 3000 })
		return;
	}
	if (typeof newpwdMsg === 'string') {
		// message.error(newpwdMsg, { duration: 3000 })
		return;
	}
	if (user.newPassword !== user.newTwoPassword) {
		// message.error('两次输入得密码不一样', { duration: 3000 })
		return;
	}
};
onMounted(() => {
	init();
	if (!changepwd) {
		router.push('/login');
	}
});
</script>

<style lang="postcss" scoped>
@import '../style/common.postcss';
.changepwd {
	height: 100%;
	.changepwd_box {
		width: 680px;
		padding: 0 40px 40px 40px;
		height: 800px;
		background: linear-gradient(180deg, #506a85, #283b4e);
		.changepwd_title {
			height: 110px;
			display: flex;
			padding-bottom: 16px;
			border-bottom: 1px solid #77d1ff;
			> div {
				display: flex;
				align-items: flex-end;
				color: #77d1ff;
				font-size: 20px;
				img {
					width: 36px;
					height: 36px;
					margin-right: 10px;
				}
			}
		}
	}
	.change_new_pwd1 {
		position: relative;
	}
}
</style>
