<template>
	<div class="change_phone user_input">
		<div class="change_phone_img user_input_img">
			<img src="@/assets/images/login/user_phone.png" />
		</div>
		<input type="text" :placeholder="placeholderData.placeholderobj.name" />
	</div>
	<div class="change_pwd user_input">
		<div class="change_pwd_img user_input_img">
			<img src="@/assets/images/login/user_pwd.png" />
		</div>
		<input
			type="text"
			:placeholder="placeholderData.placeholderobj.department"
		/>
	</div>

	<div class="user_smb_btn">
		<n-button color="#1e9fff" type="success" @click="clickBtn">下一步</n-button>
	</div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';
const placeholderData = defineProps<{
	placeholderobj: {
		name: string;
		department: string;
	};
}>();
console.log(placeholderData.placeholderobj);
const emits = defineEmits<{ (e: 'componentChange', name: string): void }>();
const clickBtn = () => {
	emits('componentChange', 'submit');
};
</script>

<style lang="postcss" scoped>
@import '../style/common.postcss';
</style>
