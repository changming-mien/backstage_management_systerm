<template>
  <div class="index">
      <HeadNav/>
      <keep-alive>
        <LeftMenu></LeftMenu>
      </keep-alive>
      <div class="rightContainer">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav"
import LeftMenu from "../components/LeftMenu"
export default {
  components:{
    HeadNav,
    LeftMenu
  }
}
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer {
  position: relative;
  top: 0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>