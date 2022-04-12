<template>
	<div class="resetpwd">
		<div class="resetpwd_box">
			<div class="resetpwd_switc">
				<div>
					<div
						:class="resetpwdData.componentActive == 'account' ? 'active' : ''"
					>
						<div class="resetpwd_p">1</div>
						<div>确定账户</div>
					</div>
					<div></div>
					<div
						:class="
							resetpwdData.componentActive == 'verification' ? 'active' : ''
						"
					>
						<div class="resetpwd_p">2</div>
						<div>安全验证</div>
					</div>
					<div></div>
					<div
						:class="resetpwdData.componentActive == 'submit' ? 'active' : ''"
					>
						<div class="resetpwd_p">3</div>
						<div>重置密码</div>
					</div>
				</div>
			</div>
			<div>
				<component
					:is="resetpwdData.componentNmae"
					:placeholderobj="resetpwdData.placeholderobj"
					@componentChange="componentChange"
				/>
			</div>
			<!-- <div class="user_smb_btn">
                <n-button color="#1e9fff" type="success">返回登录</n-button>
            </div> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import account from './account.vue';
import verification from './verification.vue';
import submit from './submit.vue';
let resetpwdData = reactive({
	componentActive: 'account',
	componentNmae: account,
	placeholderobj: {
		name: '请输入用户姓名',
		department: '请输入所属部门',
	},
});
let router = useRouter();
let resetpwd = sessionStorage.getItem('resetpwd');
const init = () => {
	if (resetpwd == '1') {
		resetpwdData.placeholderobj.name = '请输入用户姓名';
		resetpwdData.placeholderobj.department = '请输入所属部门';
	} else {
		resetpwdData.placeholderobj.name = '请输入企业名称';
		resetpwdData.placeholderobj.department = '请输入企业社会信用代码';
	}
};
const componentChange = (name: string) => {
	resetpwdData.componentActive = name;
	switch (name) {
		case 'verification':
			(resetpwdData.componentNmae as any) = verification;
			break;
		default:
			(resetpwdData.componentNmae as any) = submit;
	}
};

onMounted(() => {
	init();
	if (!resetpwd) {
		router.push('/login');
	}
});
</script>

<style lang="postcss" scoped>
.resetpwd {
	height: 100%;
	position: relative;
	.resetpwd_box {
		width: 680px;
		height: 850px;
		padding: 0 40px;
		background: linear-gradient(180deg, #506a85, #283b4e);
		.resetpwd_switc {
			height: 110px;
			display: flex;
			padding-bottom: 16px;
			border-bottom: 1px solid #77d1ff;
			align-items: flex-end;
			width: 100%;
			> div {
				display: flex;
				align-items: center;
				font-size: 20px;
				color: #71aae3;
				width: 100%;
				> div {
					position: relative;
					width: calc((100% - 112px - 44px) / 3);
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;
					.resetpwd_p {
						text-align: center;
						line-height: 37px;
						transform: skewX(-10deg);
						width: 40px;
						height: 37px;
						margin-right: 10px;
						background: linear-gradient(180deg, #6285a7, rgba(98, 133, 167, 0));
					}
				}
				> div:nth-child(2n) {
					margin: 0 11px;
					width: 56px;
					border-bottom: 1px solid #7ca3cd;
				}
			}
			.active {
				color: #77d1ff;
			}
			.active .resetpwd_p {
				color: #ffffff;
				background: linear-gradient(180deg, #77d1ff, rgba(119, 209, 255, 0));
			}
			.active:after {
				content: '';
				position: absolute;
				bottom: -16px;
				width: 100%;
				border-bottom: 2px solid #77d1ff;
			}
		}
	}
}
</style>
