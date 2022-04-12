<template>
    <div class="personal">
        <div class="head">个人中心</div>
        
        <div class="cont">
            <div class="imgs">
                <div class="img">
                    <p></p>
                    <p>
                        <span>登录时间</span>
                        <span>2022.04.03 14:00</span>
                    </p>
                </div>
                <div class="img">
                    <p></p>
                    <p>
                        <span>登录IP</span>
                        <span>192.168.1.1</span>
                    </p>
                </div>
                <div class="img">
                    <p></p>
                    <p>
                        <span>设备类型</span>
                        <span>计算机</span>
                    </p>
                </div>
            </div>
            <div class="bottom">
                <div class="mesg">
                    <div class="headImg"></div>
                    <p class="name">超级系统管理员</p>
                    <div class="disc" @click="showUserData"><span>个人信息</span></div>
                    <div class="dask">
                        <p @click="changeContent(0)">
                            <span>我的通知</span>
                            <span>99</span>
                        </p>
                        <p @click="changeContent(1)">
                            <span>我的任务</span>
                            <span>99</span>
                        </p>
                    </div>
                </div>
                <div class="userData" v-if="!showContent.showNews">
                    <div class="item">
                        <p>
                            <span></span>
                            <span>姓名</span>
                        </p>
                        <input type="text" v-model="personalDatas.name" disabled>
                    </div>
                    <div class="item">
                        <p>
                            <span></span>
                            <span>账号</span>
                        </p>
                        <input type="text" v-model="personalDatas.account">
                    </div>
                    <div class="item">
                        <p>
                            <span></span>
                            <span>手机号</span>
                        </p>
                        <input type="text" v-model="personalDatas.phone">
                    </div>
                    <div class="item">
                        <p>
                            <span></span>
                            <span>密码</span>
                        </p>
                        <input type="password" v-model="personalDatas.password">
                    </div>
                    <div class="item">
                        <p>
                            <span></span>
                            <span>部门</span>
                        </p>
                        <input type="text" v-model="personalDatas.deptName">
                    </div>
                    <div class="item">
                        <p>
                            <span></span>
                            <span>用户角色</span>
                        </p>
                        <input type="text"  v-model="personalDatas.roleCode">
                    </div>
                    <n-button type="info" class="updataBtn" @click="updateUserData">修改</n-button>
                </div>
                <userNews v-else :newsType="showContent.newsType"></userNews>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
// import personalMesg from "@/pages/personalCenter/personalMesg.vue"
import userNews from "@/pages/personalCenter/userNews.vue"
import { useMessage } from 'naive-ui'
import { ref, onMounted } from 'vue'
import router from '../../router'
import personalData from '../../axios/api/personal/index'
const loginMesg = ref({
    time: '2022年1月4日17:37:54',
    ip: '192.168.1.1',
    type: 'computer'
})

const personalDatas:any = ref({
    name: 'aaa',
    account: '',
    password: '',
    phone: '',
    deptName: '',
    roleCode: ''
})
const goBack = () => {
    router.go(-1)
}
let showContent: any = ref({
    showNews: false,
    newsType: 0, // 0是通知，1是任务
})
const getUserData = () => {
    personalData.getUserData().then(res => {
        personalDatas.value = res.data
    })
}
// 消息组件
const message = useMessage()
const updateUserData = () => {
    if(personalDatas.value.name && personalDatas.value.account && personalDatas.value.account) {
        // debugger
        for(let i in personalDatas.value) {
            if(!personalDatas.value[i]) {
                delete personalDatas.value[i]
            }
        }
        personalData.updateUserData(personalDatas.value).then((res:any) => {
            message.success('修改成功')
            getUserData()
        })
    } else {
        message.error('请将账号密码填写完整')
    }
}

const changeContent = (index:Number) => {
    showContent.value.showNews = true
    showContent.value.newsType = index
}
const showUserData = () => {
    showContent.value.showNews = false
    showContent.value.newsType = 0
}
onMounted(() => {
    getUserData()
})
</script>

<style lang="postcss" scoped>
.personal {
    width: 1100px;
    height: 700px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    border-radius: 20px;
    background: #eaf2f7;
    position: relative;
    .head {
        width: 100%;
        height: 70px;
        background: #46596d;
        border-radius: 20px 20px 0px 0px;
        font-size: 25px;
        color: #fff;
        line-height: 70px;
        text-align: center;
    }
    .cont {
        width: 100%;
        height: calc(100% - 70px);
        padding: 0 30px;
        .imgs {
            display: flex;
            justify-content: space-between;
            margin-top: 18px;
        }
        .img {
            height:112px;
            width: 326px;
            position: relative;
            p:nth-child(1) {
                width: 98px;
                height: 98px;
                position: absolute;
                left: 14px;
                top: 0;
                background: url("@/assets/images/header/img1.png") no-repeat;
                z-index: 5;
            }
            p:nth-child(2) {
                width: 326px;
                height: 88px;
                opacity: 0.7;
                position: absolute;
                background: #1e9fff;
                border-radius: 10px;
                left: 0;
                bottom: 0;
                padding-left: 134px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: #fff;
                line-height: 25px;
                span:nth-child(1) {
                    font-size: 14px;
                    opacity: 0.7;
                }
                span:nth-child(2) {
                    font-size: 18px;
                    font-weight: 700;
                }
            }
        }
        .img:nth-of-type(2) {
            p:nth-child(1) {
                width: 153px;
                background: url("@/assets/images/header/img2.png") no-repeat;
            }
            p:nth-child(2) {
                padding-left: 183px;
                background: #ffa138;
            }                    
        }
        .img:nth-of-type(3) {
            p:nth-child(1) {
                width: 146px;
                background: url("@/assets/images/header/img3.png") no-repeat;
            }
            p:nth-child(2) {
                padding-left: 183px;
                background: #28ce76;
            }                    
        }
    }
    .bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        .mesg {
            width: 300px;
            height: 451px;
            background: #ffffff;
            border-radius: 10px;
            position: relative;
            .headImg {
                margin-left: 90px;
                margin-top: 30px;
                background: url("@/assets/images/header/user.png") no-repeat;
                background-size: 100% 100%;
                height:120px;
                width: 120px;
                border-radius: 50%;
            }
            .name {
                text-align: center;
                font-size: 16px;
                font-weight: 700;
                color: #1e9fff;
                line-height: 56px;
                margin: 0 20px;
                border-bottom: 2px dashed #b7d0e9;
            }
            .disc {
                margin: 20px auto;
                width: 260px;
                height: 60px;
                /* opacity: 0.1; */
                font-weight: 500;
                
                background: linear-gradient(90deg,#1f9eff46, rgba(30,159,255,0.00));
                span{
                    opacity: 1;
                    color: #1e9fff;
                    line-height: 60px;
                    font-size: 14px;
                    margin-left: 20px;
                }
            }
            .dask {
                width: 100%;
                height: 120px;
                box-sizing: border-box;
                padding: 0 20px;
                p{
                    display:flex;
                    justify-content: space-between;
                    cursor: pointer;
                    span:nth-child(1) {
                        font-size: 14px;
                        color: #333;
                        font-weight: 500;
                    }
                    span:nth-child(2) {
                        width: 32px;
                        height: 32px;
                        background: #ff9924;
                        border-radius: 50%;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: center;
                        line-height: 32px;
                        color: #ffffff;
                    }
                }
                p+p{
                    margin-top: 20px;
                }
            }
        }
    }
    .userData {
        width: 710px;
        height: 451px;
        background: #fff;
        border-radius: 10px;
        font-size: 14px;
        padding: 0 30px;
        position: relative;
        .item {
            width: 100%;
            display: flex;
            justify-content:space-between;
            height: 64px;
            align-items: center;
            border-bottom: 2px dashed #b7d0e9;
            input {
                border: 0;
                outline: 0;
                background: #fff;
                height: 56px;
                width: 80%;
                text-align: right;
            }
            p{
                display: flex;
                align-items: center;
                span:nth-child(1) {
                    width: 16px;
                    height: 16px;
                    background: url("@/assets/images/header/lingxing.png") no-repeat center center;
                    background-size: 100% 100%;
                }
                span:nth-child(2) {
                    margin-left: 16px;
                    font-weight: 600;
                }
            }
        }
    }
    .updataBtn {
        position: absolute;
        right: 50px;
        bottom: 10px;
    }
    
}
</style>