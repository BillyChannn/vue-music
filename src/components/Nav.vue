<template>
  <div class="nav">
    <router-link class="nav-item" to="/recommend">推荐</router-link>
    <router-link class="nav-item" to="/singer">歌手</router-link>
    <router-link class="nav-item" to="/topList">排行</router-link>
    <router-link class="nav-item" to="/search">搜索</router-link>
    <span class="bar"></span>
  </div>
</template>

<script>
  export default {};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../style/variable";

.nav {
  display: flex;   
  justify-content: space-around;
  align-items: center;
  height: 44px;
  font-size: $font-size-medium;
  color: $color-text-l;

  .nav-item {
    display: block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;

    &.router-link-active {
      border-bottom: 2px solid $color-theme;
      color: $color-theme;
    }
  }

  .bar {
    position: absolute;
    
  }
}

</style>