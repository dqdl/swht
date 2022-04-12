
<template>
    <div class="user_phone user_input">
        <div class="user_phone_img user_input_img">
            <img src="@/assets/images/login/user_phone.png" />
        </div>
        <input v-model="user.username" type="text" :placeholder="userBox.placeholder" />
    </div>
    <div class="user_pwd user_input">
        <div class="user_pwd_img user_input_img">
            <img src="@/assets/images/login/user_pwd.png" />
        </div>
        <input v-model="user.password" type="text" placeholder="请输入密码" />
        <div class="user_pwd_show_img user_input_img user_input_img_none">
            <img src="@/assets/images/login/user_pwd_show.png" />
        </div>
    </div>
    <!-- <div class="user_code user_input">
        <div class="user_code_img user_input_img">
            <img src="@/assets/images/login/user_code.png" />
        </div>
        <input type="text" placeholder="请输入验证码" />
        <div style="width: 140px;height:100%;" class="user_input_code">
            <img src="@/assets/images/login/test_code.png" />
        </div>
    </div>-->
    <div class="user_smb_btn">
        <n-button @click="smbLogin" color="#1e9fff" type="success">登录</n-button>
    </div>
    <!-- 跳转其他 -->
    <div class="jump_other">
        <div class="user_register csspointer">账号注册</div>
        <div class="jump_other_pwd">
            <div @click="changePwd" class="modify_pwd csspointer">修改密码</div>
            <div>|</div>
            <div @click="forgetPwd" style="color:#ff9924;" class="forget_pwd csspointer">忘记密码？</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive } from "vue";
import loginHome from "../../../axios/api/login";
import { useRouter } from "vue-router";
// 路由对象
const router = useRouter()
let props = defineProps<{
    userBox: {
        name: string,
        placeholder: string
    }
}>()
let userBox = ref(props.userBox)
let user = reactive({
    username: "",
    type: 1,
    password: ""
})
const smbLogin = () => {
    if (userBox.value.name === '管委会用户登录') {
        user.type = 1
    } else {
        user.type = 2
    }
    loginHome.login(user).then((res: any) => {
        if (res.token) {
            window.sessionStorage.setItem('token', res.token);
            router.push("/index")
        }
    })
}
const changePwd = () => {
    if (userBox.value.name === '管委会用户登录') {
        sessionStorage.setItem("changepwd", "1")
    } else {
        sessionStorage.setItem("changepwd", "2")
    }
    router.push('/changepwd')
}
const forgetPwd = () => {
    if (userBox.value.name === '管委会用户登录') {
        sessionStorage.setItem("resetpwd", "1")
    } else {
        sessionStorage.setItem("resetpwd", "2")
    }
    router.push('/resetpwd')
}
</script>

<style lang="postcss" scoped>
@import "../style/common.postcss";
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