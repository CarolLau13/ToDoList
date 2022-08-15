<template>
  <div id="verifyCodeLogin">
    <div class="content">
      <el-form :model="verifyCodeLogin" :rules="rules" ref="verifyCodeLogin">
        <el-form-item prop="phoneNum" class="telNum">
          <el-input
            placeholder="手机号"
            prefix-icon="el-icon-mobile-phone"
            v-model="verifyCodeLogin.phoneNum"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="verifyCode" class="verify">
          <el-input
            placeholder="输入4位短信验证码"
            prefix-icon="el-icon-lock"
            v-model="verifyCodeLogin.verifyCode"
          >
          </el-input>
          <el-button
            type="text"
            @click="countDown"
            :disabled="isDisabled"
            class="getVerifyNum"
            >{{ buttonText }}</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login"
            @click="submitForm"
            :loading="isloginLoading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "verifyCodeLogin",
  data() {
    var validateTel = (rule, value, callback) => {
      if (this.isVaild(this.verifyCodeLogin.phoneNum)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };

    var validateVerifyCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };

    return {
      verifyCodeLogin: {
        phoneNum: "",
        verifyCode: "",
      },
      rules: {
        phoneNum: [{ validator: validateTel, trigger: "blur" }],
        verifyCode: [{ validator: validateVerifyCode, trigger: "blur" }],
      },
      buttonText: "获取短信验证码",
      second: 60,
      isDisabled: false,

      telNum: 0,
      num: "0123456789",
      isloginLoading: false,
    };
  },
  methods: {
    // 判断手机号是否以数字1开头
    isStartFromOnefunc(telephoneNum) {
      if (telephoneNum[0] == 1) {
        return true;
      } else {
        return false;
      }
    },
    // 判断手机号是否够11位
    isElevenfunc(telephoneNum) {
      if (telephoneNum.length == 11) {
        return true;
      } else {
        return false;
      }
    },
    // 判断手机号是否全是数字
    isAllNumfunc(telephoneNum) {
      for (let i = 0; i < telephoneNum.length; i++) {
        if (this.num.indexOf(telephoneNum[i]) == -1) {
          return false;
        }
      }
      return true;
    },
    // 判断是否为正确手机号
    isVaild(telephoneNum) {
      if (
        this.isStartFromOnefunc(telephoneNum) &&
        this.isElevenfunc(telephoneNum) &&
        this.isAllNumfunc(telephoneNum)
      ) {
        return true;
      } else {
        return false;
      }
    },

    submitForm() {
      this.isloginLoading = true;
      this.$refs.verifyCodeLogin.validate((valid) => {
        if (valid) {
          axios
            .post("/api/phonelogin", {
              phonenum: this.verifyCodeLogin.phoneNum,
              code: this.verifyCodeLogin.verifyCode,
            })
            .then((res) => {
              if (res.data.isSuccess == true) {
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$emit("verifyCodeLogin", res.data.message);
              } else {
                this.isloginLoading = false;
                this.$message({
                  message: res.data.message,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.isloginLoading = false;
              this.$message({
                message: "网络错误",
                type: "error",
              });
            });
        } else {
          this.isloginLoading = false;
        }
      });
    },

    countDown() {
      this.$refs.verifyCodeLogin.validateField("phoneNum", (valid) => {
        // console.log(valid);
        if (!valid) {
          axios
            .post("/api/verify/sendcode", {
              phonenum: this.verifyCodeLogin.phoneNum,
              code: this.verifyCodeLogin.verifyCode,
            })
            .then((res) => {
              if (res.data.isSuccess == true) {
                this.$message({
                  message: "验证码已发送",
                  type: "success",
                });
              }
            })
            .catch((err) => {
              this.$message({
                message: "网路错误",
                type: "error",
              });
            });

          this.buttonText = "60秒";
          this.second = 60;
          this.isDisabled = true;
          let stopInterval = setInterval(() => {
            this.second--;
            this.buttonText = this.second + "秒";
            if (this.second == "0") {
              this.buttonText = "发送验证码";
              this.isDisabled = false;
              clearInterval(stopInterval);
            }
          }, 1000);
        }
      });
    },
  },
};
</script>

<style scoped>
.content {
  width: 80%;
  margin: 0 auto;
}
.telNum,
.verifyNum {
  margin-bottom: 25px;
  text-align: center;
}

.telNum {
  margin-top: 25px;
}

.verify {
  position: relative;
}

.getVerifyNum {
  position: absolute;
  right: 15px;
  font-weight: normal;
}

.login {
  display: block;
  width: 100%;
}
</style>