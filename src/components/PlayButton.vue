<template>
  <div class="play-button" @click="onClick">
    <span class="icon-play"></span>
    <span class="text">{{text}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    methods: {
      onClick() {
        this.$emit('click');
      }
    },
    name: "play-button"
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .play-button {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-theme;
    color: $color-theme;
    border-radius: 100px;
    font-size: 0;

    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
</style>
