<template>
    <form class="form">
        <div class="title">请填写用户信息后修改新密码</div>
        <div>
            <span>原登录密码</span>
            <input type="text" v-model="personalMesg.password" placeholder="用户原密码">
        </div>
        <div>
            <span>验证码</span>
            <input type="text" v-model="personalMesg.code" placeholder="请输入验证码">
        </div>
        <div>
            <span>新密码</span>
            <input type="text" v-model="personalMesg.newPass" placeholder="用户新密码：8-16位字符，必须由数字、字母组成">
        </div>
        <div>
            <span>确认新密码</span>
            <input type="text" v-model="personalMesg.determine" placeholder="确认密码">
        </div>
        
        <div class="updateMesg">确认重置</div>
    </form>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

// 密码
const personalMesg:any = ref({
    password: 'aaa',
    code: '',
    newPass: '',
    determine: '',
})
</script>
<style lang="postcss" scoped>
.form {
    height: 640px;
    padding-top: 50px;
    background: rgb(238, 237, 237);
    padding-right: 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* justify-content: center; */
    .title {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        justify-content: center;
    }
    div{
        width: 100%;
        display: flex;
        margin: 20px 0;
        justify-content: flex-end;
    }
    div span {
        font-size: 26px;
        /* font-weight: bold; */
        line-height: 60px;
        margin-right: 100px;
    }
    div input {
        width: 70%;
        height: 50px;
        font-size: 20px;
    }
    .updateMesg{
        height: 50px;
        width: 663px;
        font-size: 20px;
        background: rgb(61, 152, 236);
        text-align: center;
        line-height: 50px;
        justify-content: center;
        border-radius: 5px;
        color: #fff;
    }
}
</style>