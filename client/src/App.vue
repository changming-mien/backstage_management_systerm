<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import jwt_decode from "jwt-decode"
export default {
  name: "app",
  created(){
    if(localStorage.eleToken){
      // 解析token
      const decoded=jwt_decode(localStorage.eleToken);
      // console.log(decoded)
      // token存储到vuex中
      this.$store.dispatch("setAutnenticated",!this.isEmpty(decoded));
      this.$store.dispatch("setUser",decoded);
    }
  },
  methods: {
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>
<style>
#app{
  width: 100%;
  height: 100%;
}
</style>
