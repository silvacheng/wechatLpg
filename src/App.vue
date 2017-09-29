<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped rel="stylesheet/style">
  @import "common/css/reset.css";
  @import "common/css/iconfont.css";
  #app{
    height:100%;
    background-color: #f4f4f4;
  }
</style>
