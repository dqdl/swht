<template>
    <form class="form">
        <n-form
        :model="personalMesg"
        ref="formRef"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        size="large"
        >
            <n-form-item path="name" label="名字">
                <n-input v-model:value="personalMesg.name" @keydown.enter.prevent :disabled="true" />
            </n-form-item>
            <n-form-item path="account" label="账号">
                <n-input placeholder="请输入账号" v-model:value="personalMesg.account" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input placeholder="请输入密码" type="password" v-model:value="personalMesg.password" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="phone" label="手机号">
                <n-input placeholder="请输入手机号" v-model:value="personalMesg.phone" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="deptName" label="部门">
                <n-input placeholder="请输入部门" v-model:value="personalMesg.deptName" @keydown.enter.prevent />
            </n-form-item>
            <n-form-item path="roleCode" label="用户角色">
                <n-input placeholder="请输入用户角色" v-model:value="personalMesg.roleCode" @keydown.enter.prevent />
            </n-form-item>
        </n-form>
        <!-- <div class="updateMesg">修改</div> -->
        <n-button type="info" size="large" class="updateMesg" @click="handleValidateClick">
            修改
        </n-button>
    </form>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import personalData from '../../axios/api/personal/index'
// 个人信息
const personalMesg:any = ref({
    name: 'aaa',
    account: '',
    password: '',
    phone: '',
    deptName: '',
    roleCode: ''
})
// 消息组件
const message = useMessage()
const formRef = ref(null)
const rules = ref({
    name: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur']
        }
    ],
    account: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur']
        }
    ],
    password: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur']
        }
    ],
    phone: [
        {
            required: false,
            message: '请输入手机号'
        }
    ],
    deptName: [
        {
            required: false,
            message: '请输入所属部门'
        }
    ],
    roleCode: [
        {
            required: false,
            message: '请输入用户角色'
        }
    ]
})
const getUserData = () => {
    personalData.getUserData().then(res => {
        personalMesg.value = res.data
    })
}
onMounted(() => {
    getUserData()
})
const handleValidateClick = (e:any) => {
    (formRef.value as any).validate((errors:any) => {
        if (!errors) {
            personalData.updateUserData(personalMesg.value).then((res:any) => {
                message.success('修改成功')
                getUserData()
            })
        } else {
            console.log(errors)
            message.error('请填写完整信息')
        }
    })
}
</script>
<style lang="postcss" scoped>
.form {
    height: 600px;
    padding-top: 40px;
    background: rgb(238, 237, 237);
    padding-right: 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* justify-content: center; */
    /* div{
        width: 100%;
        display: flex;
        margin: 15px 0;
        justify-content: flex-end;
    } */
    div span {
        font-size: 30px;
        font-weight: bold;
        line-height: 60px;
        margin-right: 100px;
    }
    div input {
        width: 70%;
        height: 50px;
        font-size: 20px;
        border: 0;
        border-radius: 5px;
        outline: none;
        background: #fff;
        color: #666;
    }
    .updateMesg{
        margin-right: 10px;
    }
    
}

.n-form {
    width: 100%;
    height: 80%;
    padding: 10px;
}
.n-form-item {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 30px;
    position: relative;
    div {
        width: 800px !important;
    }
}

</style>