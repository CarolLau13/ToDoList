<template>
  <div id="registerpage">
    <div class="w">
      <h2>用户注册</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="ruleForm.isSubmitLoading"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "registerpage",
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (this.ruleForm.username !== "") {
          if (this.ruleForm.username.length >= 3) {
            callback();
          } else {
            callback(new Error("请至少输入三个字符"));
          }
        }
      }
    };

    var validatePass = (rule, value, callback) => {
      // debugger;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 8) {
        callback(new Error("密码至少输入8位字符"));
      } else if (value.length >= 8) {
        if (this.isIncludeNumAndAlpha(value) == false) {
          callback(new Error("密码只能由数字和字母组成"));
        }
        if (this.isIncludeOneAlpha(value) == false) {
          callback(new Error("密码需至少包含一个字母"));
        }
        if (this.ruleForm.checkPass !== "") {
          // 触发确认密码框校验
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        pass: "",
        checkPass: "",
        legalCharacter:
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        allAlphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        isSubmitLoading: false,
      },
      rules: {
        username: [{ validator: validateUserName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 判断密码是否都是数字和字母
    isIncludeNumAndAlpha(password) {
      // debugger;
      for (let i = 0; i < password.length; i++) {
        if (this.ruleForm.legalCharacter.indexOf(password[i]) == -1) {
          return false;
        }
      }
      return true;
    },
    // 判断是否至少有一个字母
    isIncludeOneAlpha(password) {
      for (let i = 0; i < password.length; i++) {
        if (this.ruleForm.allAlphabet.indexOf(password[i]) !== -1) {
          return true;
        }
      }
      return false;
    },
    submitForm(formName) {
      this.ruleForm.isSubmitLoading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios
            .post("http://localhost:5030/account/register", {
              username: this.ruleForm.username,
              password: this.ruleForm.pass,
            })
            .then((res) => {
              if (res.data.isSuccess == true) {
                this.$message({
                  message: "注册成功",
                  type: "success",
                });
                this.$emit("registerSuccess");
              } else {
                this.ruleForm.isSubmitLoading = false;
                this.$message({
                  message: res.data.message,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.ruleForm.isSubmitLoading = false;
              this.$message({
                message: "网络错误",
                type: "error",
              });
            });
        } else {
          this.ruleForm.isSubmitLoading = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.w h2 {
  margin: 0 0 40px 100px;
}

.w {
  margin: 0 auto;
  width: 80%;
}
</style>