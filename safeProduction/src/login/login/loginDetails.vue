<template>
	<div>
		<div class="user_phone user_input">
			<div class="user_phone_img user_input_img">
				<img src="@/assets/images/login/user_phone.png" />
			</div>
			<input
				v-model="user.username"
				type="text"
				:placeholder="userBox.placeholder"
			/>
		</div>
		<div class="user_pwd user_input">
			<div class="user_pwd_img user_input_img">
				<img src="@/assets/images/login/user_pwd.png" />
			</div>
			<input v-model="user.password" :type="isType" placeholder="请输入密码" />
			<div class="user_pwd_show_img user_input_img user_input_img_none">
				<img class="csspointer" :src="imgShow.src" @click="pwdShow" />
			</div>
		</div>
		<div class="user_code user_input">
			<div class="user_code_img user_input_img">
				<img src="@/assets/images/login/user_code.png" />
			</div>
			<input v-model="user.code" type="text" placeholder="请输入验证码" />
			<div class="user_input_code">
				<img
					style="width: 158px; height: 100%"
					class="csspointer"
					:src="imgUrl"
					@click="changeCode"
				/>
			</div>
		</div>
		<div class="user_smb_btn">
			<n-button
				:loading="loading"
				color="#1e9fff"
				type="success"
				@click="smbLogin"
				>登录</n-button
			>
		</div>
		<!-- 跳转其他 -->
		<div class="jump_other">
			<div class="user_register csspointer" @click="registeuser">账号注册</div>
			<div class="jump_other_pwd">
				<!-- <div @click="changePwd" class="modify_pwd csspointer">修改密码</div>
                <div>|</div>-->
				<div
					style="color: #ff9924"
					class="forget_pwd csspointer"
					@click="forgetPwd"
				>
					忘记密码？
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useMessage } from 'naive-ui';
import { verification } from '@/util/verification';
import showTrue from '@/assets/images/login/user_pwd_show.png';
import showFalse from '@/assets/images/login/user_pwd_show1.png';
import { loginHome } from '@/http/api/login';
// 消息组件
// const message = useMessage();
// 路由对象
const router = useRouter();
// 验证
let { verificauser, verificapwd, code } = verification();
// props
let props = defineProps<{
	userBox: {
		name: string;
		placeholder: string;
	};
}>();
let userBox = ref(props.userBox);
// 登录输入框账号密码
let user = reactive({
	username: '',
	type: 1,
	password: '',
	code: '',
	uuid: '',
});

let imgUrl = ref('');
// 获取验证码
const getCode = () => {
	loginHome.login.getcode().then((res: any) => {
		if (res.code == 200) {
			imgUrl.value = `data:image/jpg;base64,${res.img}`;
			user.uuid = res.uuid;
		}
	});
};
// 重新获取验证码
const changeCode = () => {
	getCode();
};
// 防止多次点击登录登录
const loading = ref(false);
// 登录
const smbLogin = () => {
	if (userBox.value.name === '管委会用户登录') {
		user.type = 1;
	} else {
		user.type = 2;
	}
	let userMsg = verificauser(user.username);
	let pwdMsg = verificapwd(user.password);
	let codeMsg = code(user.code);
	if (typeof userMsg === 'string') {
		// message.error(userMsg, { duration: 3000 })
		return;
	}
	if (typeof pwdMsg === 'string') {
		// message.error(pwdMsg, { duration: 3000 })
		return;
	}
	if (typeof codeMsg === 'string') {
		// message.error(codeMsg, { duration: 3000 })
		return;
	}
	loading.value = true;
	loginHome.login.login(user).then((res: any) => {
		if (res.code === 200) {
			window.sessionStorage.setItem('type', JSON.stringify(user.type));
			window.sessionStorage.setItem('token', res.data.token);
			router.push('/toggle');
		} else {
			getCode();
			// message.error(res.message, { duration: 3000 })
		}
		loading.value = false;
	});
};
let imgShow = reactive({
	src: showFalse,
});
// 密码的显示隐藏
let isType = ref('password');
const pwdShow = () => {
	imgShow.src = isType.value == 'password' ? showTrue : showFalse;
	isType.value = isType.value == 'password' ? 'text' : 'password';
};
// 更改密码
const changePwd = () => {
	// if (userBox.value.name === '管委会用户登录') {
	//     sessionStorage.setItem("changepwd", "1")
	// } else {
	//     sessionStorage.setItem("changepwd", "2")
	// }
	// router.push('/changepwd')
};

// 注册用户
const registeuser = () => {
	// message.info('请联系管理员', { duration: 3000 })
	// if (userBox.value.name === '管委会用户登录') {
	//     sessionStorage.setItem("resetpwd", "1")
	// } else {
	//     sessionStorage.setItem("resetpwd", "2")
	// }
	// router.push('/resetpwd')
};
// 忘记密码
const forgetPwd = () => {
	// message.info('请联系管理员', { duration: 3000 })
	// if (userBox.value.name === '管委会用户登录') {
	//     sessionStorage.setItem("resetpwd", "1")
	// } else {
	//     sessionStorage.setItem("resetpwd", "2")
	// }
	// router.push('/resetpwd')
};
onMounted(() => {
	getCode();
});
</script>

<style lang="postcss" scoped>
@import '../style/common.postcss';
.jump_other {
	display: flex;
	justify-content: space-between;
	color: #1e9fff;
	font-size: 18px;
	margin-top: 28px;
	.jump_other_pwd {
		display: flex;
		align-items: center;
	}
	.jump_other_pwd > div:nth-child(2) {
		padding: 0 10px;
		color: #7ca3cd;
	}
}
</style>
