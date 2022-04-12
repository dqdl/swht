<template>
    <div class="resetpwd">
        <div class="resetpwd_box">
            <div class="resetpwd_switc">
                <div>
                    <div class="active">
                        <div class="resetpwd_p">1</div>
                        <div>确定账户</div>
                    </div>
                    <div></div>
                    <div>
                        <div class="resetpwd_p">2</div>
                        <div>安全验证</div>
                    </div>
                    <div></div>
                    <div>
                        <div class="resetpwd_p">3</div>
                        <div>重置密码</div>
                    </div>
                </div>
            </div>
            <div>
                <div class="frist">
                    <div class="change_phone user_input">
                        <div class="change_phone_img user_input_img">
                            <img src="@/assets/images/login/user_phone.png" />
                        </div>
                        <input type="text" placeholder="请输入企业名称" />
                    </div>
                    <div class="change_pwd user_input">
                        <div class="change_pwd_img user_input_img">
                            <img src="@/assets/images/login/user_pwd.png" />
                        </div>
                        <input type="text" placeholder="请输入企业社会信用代码" />
                    </div>
                    <div class="change_code user_input">
                        <div class="change_code_img user_input_img">
                            <img src="@/assets/images/login/user_code.png" />
                        </div>
                        <input type="text" placeholder="请输入验证码" />
                        <div style="width: 140px;height:100%;" class="user_input_code">
                            <img src="@/assets/images/login/test_code.png" />
                        </div>
                    </div>
                    <div class="user_smb_btn">
                        <n-button color="#1e9fff" type="success">下一步</n-button>
                    </div>
                </div>
                <div class="second"></div>
                <div class="third"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="postcss" scoped>
@import "../style/common.postcss";
.resetpwd {
    height: 100%;
    position: relative;
    .resetpwd_box {
        width: 680px;
        padding: 0 40px 212px 40px;
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
                        background: linear-gradient(
                            180deg,
                            #6285a7,
                            rgba(98, 133, 167, 0)
                        );
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
                background: linear-gradient(
                    180deg,
                    #77d1ff,
                    rgba(119, 209, 255, 0)
                );
            }
            .active:after {
                content: "";
                position: absolute;
                bottom: -16px;
                width: 100%;
                border-bottom: 2px solid #77d1ff;
            }
        }
    }
}
</style>

