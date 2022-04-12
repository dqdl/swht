<template>
  <div class="changepwd">
    <div class="changepwd_box">
      <div class="changepwd_title">
        <div>
          <img src="@/assets/images/login/user_c_pwd.png" />
          <div>修改密码</div>
        </div>
      </div>
      <div>
        <div class="change_phone user_input">
          <div class="change_phone_img user_input_img">
            <img src="@/assets/images/login/user_phone.png" />
          </div>
          <input type="text" :placeholder="changepwdData.placeholder" />
        </div>
        <div class="change_pwd user_input">
          <div class="change_pwd_img user_input_img">
            <img src="@/assets/images/login/user_pwd.png" />
          </div>
          <input type="text" placeholder="请输入密码" />
          <div class="change_pwd_show_img user_input_img user_input_img_none">
            <img src="@/assets/images/login/user_pwd_show.png" />
          </div>
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
        <div class="change_new_pwd1 user_input">
          <div class="user_pwd_img user_input_img">
            <img src="@/assets/images/login/user_pwd.png" />
          </div>
          <input type="text" placeholder="请输入修改密码" />
          <div class="change_pwd_show_img user_input_img user_input_img_none">
            <img src="@/assets/images/login/user_pwd_show1.png" />
          </div>
          <safegrade :level="changepwdData.level" />
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
          <n-button color="#1e9fff" type="success">确定重置</n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import safegrade from "../components/safegrade.vue";
let router = useRouter()
let changepwd = sessionStorage.getItem("changepwd")
let changepwdData = reactive({
  len: "",
  placeholder: "请输入手机号",
  level: 4
})
const init = () => {
  if (changepwd == '1') {
    changepwdData.placeholder = "请输入手机号";
  } else {
    changepwdData.placeholder = "请输入企业社会信用代码";
  }
}
onMounted(() => {
  init();
  if (!changepwd) {
    router.push("/login")
  }
})

</script>

<style lang="postcss" scoped>
@import "../style/common.postcss";
.changepwd {
  height: 100%;
  .changepwd_box {
    width: 680px;
    padding: 0 40px 40px 40px;
    background: linear-gradient(180deg, #506a85, #283b4e);
    .changepwd_title {
      height: 110px;
      display: flex;
      padding-bottom: 16px;
      border-bottom: 1px solid #77d1ff;
      > div {
        display: flex;
        align-items: flex-end;
        color: #77d1ff;
        font-size: 20px;
        img {
          width: 36px;
          height: 36px;
          margin-right: 10px;
        }
      }
    }
  }
  .change_new_pwd1 {
    position: relative;
  }
}
</style>

