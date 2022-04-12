
<template>
    <div class="change_phone user_input">
        <div class="change_phone_img user_input_img">
            <img src="@/assets/images/login/user_phone.png" />
        </div>
        <input type="text" placeholder="请输入手机号" />
    </div>
    <!-- <div class="change_code user_input">
        <div class="change_code_img user_input_img">
            <img src="@/assets/images/login/user_code.png" />
        </div>
        <input type="text" placeholder="请输入验证码" />
        <div style="width: 140px;height:100%;" class="user_input_code">
            <img src="@/assets/images/login/test_code.png" />
        </div>
    </div> -->
    <div class="user_smb_btn">
        <n-button color="#1e9fff" @click="clickBtn" type="success">下一步</n-button>
    </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";
let emits = defineEmits<{ (e: 'componentChange', name: string): void }>()
const clickBtn = () => {
    emits('componentChange', 'verification')
}
</script>

<style lang="postcss" scoped>
@import "../style/common.postcss";
</style>