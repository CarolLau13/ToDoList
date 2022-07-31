<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
    <el-tab-pane label="验证码登录" name="first">
      <verify-code-login></verify-code-login>
    </el-tab-pane>
    <el-tab-pane label="密码登录" name="second">
      <password-login v-on="$listeners"></password-login>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import verifyCodeLogin from "./verifyCodeLogin.vue";
import passwordLogin from "./passwordLogin.vue";

export default {
  name: "login",
  components: {
    verifyCodeLogin,
    passwordLogin,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped>
</style>
