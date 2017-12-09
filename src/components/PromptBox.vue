<template>
  <transition name="slide">
    <div class="prompt-box" v-show="showFlag">
      <p class="text"><i class="icon-ok"></i>{{text}}</p>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '',
        required: true
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      show(time) {
        this.showFlag = true;
        setTimeout(() => {
          this.showFlag = false;
        }, time);
      }
    },
    name: "prompt-box"
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .prompt-box {
    position: absolute;
    top: 0;
    width: 100%;
    height: 44px;
    background: $color-dialog-background;

    &.slide-enter-active,
    &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter,
    &.slide-leave-to {
      transform: translateY(-100%);
    }

    .text {
      text-align: center;
      line-height: 44px;
      font-size: $font-size-medium;
      color: $color-text;
    }

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

  }

</style>
