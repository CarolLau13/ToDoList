<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Home from "./views/Home.vue";

export default {
  name: "App",
  components: {
    Home,
  },
};
</script>

<style>
@import "assets/css/base.css";
</style>
