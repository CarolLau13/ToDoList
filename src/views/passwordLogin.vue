<template>
  <div id="passwordLogin">
    <div class="content">
      <el-form :model="passLogin" status-icon :rules="rules" ref="passLogin">
        <el-form-item prop="account" class="account">
          <el-input
            placeholder="个人账号"
            prefix-icon="el-icon-user"
            v-model="passLogin.account"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="password" class="password">
          <el-input
            placeholder="密码"
            prefix-icon="el-icon-lock"
            v-model="passLogin.password"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login"
            @click="login"
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
  name: "passwordLogin",
  data() {
    var validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入个人账号"));
      } else {
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      passLogin: {
        account: "",
        password: "",
      },
      rules: {
        account: [{ validator: validateAccount, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      isloginLoading: false,
    };
  },
  methods: {
    register() {
      this.$router.push("/registerpage");
    },
    login() {
      this.isloginLoading = true;
      this.$refs.passLogin.validate((valid) => {
        if (valid) {
          axios
            .post("http://localhost:5030/passwordlogin", {
              userName: this.passLogin.account,
              password: this.passLogin.password,
            })
            .then((res) => {
              console.log(res);
              if (res.data.isSuccess == true) {
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$emit("passLogin");
              } else {
                this.isloginLoading = false;
                this.$message({
                  message: res.data.message,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.$message({
                message: "网络错误",
                type: "error",
              });
            });
        } else {
          this.isloginLoading = false;
          return false;
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

.account,
.password {
  margin-bottom: 23px;
  text-align: center;
}

.account {
  margin-top: 25px;
}

.login {
  display: block;
  width: 100%;
}
</style>