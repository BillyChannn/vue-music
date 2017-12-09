<template>
  <div class="loading">
    <img src="../images/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .loading {
    text-align: center;

    img {
      width: 24px;
      height: 24px;
    }

    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
</style>
