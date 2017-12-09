<template>
  <div class="header">
    <img class="logo" src="../images/logo.png" alt="logo">
    <h1 class="name">Vue Music</h1>
    <router-link class="user-icon" to="/user"><i class="icon-mine"></i></router-link>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable.scss";

  .header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: $font-size-large;

    .logo {
      margin-right: 10px;
      height: 28px;
    }

    .user-icon {
      position: absolute;
      top: 0;
      right: 0;

      .icon-mine {
        display: inline-block;
        padding: 12px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
  }

</style>
