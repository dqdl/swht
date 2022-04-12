<template>
	<div class="loginmain">
		<div class="login_box">
			<!-- 登录切换 -->
			<div class="login_switch">
				<div
					:class="loginData.active ? 'active' : ''"
					@click="loginChange(true)"
				>
					<img src="@/assets/icon/login/yonghu.png" />
					<span>管委会用户</span>
				</div>
				<div
					:class="!loginData.active ? 'active' : ''"
					@click="loginChange(false)"
				>
					<img src="@/assets/icon/login/qiyeyonghuguanli.png" />
					<span>企业用户</span>
				</div>
			</div>
			<!-- 登录详情 -->
			<div class="login_details">
				<!-- 管委会用户登录 -->
				<div v-if="loginData.active">
					<LoginDetails :user-box="loginData.user" />
				</div>
				<!-- 企业用户登录 -->
				<div v-else>
					<LoginDetails :user-box="loginData.company" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import LoginDetails from './loginDetails.vue';
import { reactive } from 'vue';

// 登陆数据
let loginData = reactive({
	active: true,
	user: {
		name: '管委会用户登录',
		placeholder: '请输入手机号码',
	},
	company: {
		name: '企业用户登录',
		placeholder: '请输入企业名称',
	},
});
// 登录切换
const loginChange = (val: boolean): void => {
	loginData.active = val;
};
</script>

<style lang="postcss" scoped>
.loginmain {
	height: 100%;
	position: relative;
	.login_box {
		width: 680px;
		padding: 0 40px 0 40px;
		height: 800px;
		background: linear-gradient(180deg, #506a85, #283b4e);
		.login_switch {
			height: 110px;
			display: flex;
			border-bottom: 1px solid #7ca3cd;
			> div,
			.activ {
				width: 50%;
				display: flex;
				justify-content: center;
				padding-top: 36px;
				align-items: center;
				font-size: 20px;
				color: #fff;
				img {
					width: 36px;
					height: 36px;
					margin-right: 6px;
				}
			}
			.active {
				border-bottom: 2px solid #77d1ff;
				color: #77d1ff;
			}
		}
	}
}
</style>
