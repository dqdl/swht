<template>
	<div class="submit_new_pwd1 user_input">
		<div class="user_pwd_img user_input_img">
			<img src="@/assets/images/login/user_pwd.png" />
		</div>
		<input type="text" placeholder="请输入修改密码" />
		<div class="submit_pwd_show_img user_input_img user_input_img_none">
			<img src="@/assets/images/login/user_pwd_show1.png" />
		</div>
		<safegrade />
	</div>
	<div class="change_new_pwd2 user_input">
		<div class="user_pwd_img user_input_img">
			<img src="@/assets/images/login/user_pwd.png" />
		</div>
		<input type="text" placeholder="请再次输入修改密码" />
		<div class="user_pwd_show_img user_input_img user_input_img_none">
			<img src="@/assets/images/login/user_pwd_show1.png" />
		</div>
	</div>

	<div class="user_smb_btn">
		<n-button color="#1e9fff" type="success">确认提交</n-button>
	</div>
</template>

<script lang="ts" setup>
import safegrade from '../components/safegrade.vue';
</script>

<style lang="postcss" scoped>
@import '../style/common.postcss';
.submit_new_pwd1 {
	position: relative;
}
</style>
