<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text.content}}</p>
          <div class="operate">
            <div @click.stop="confirm" class="operate-btn left">{{text.confirmBtnText}}</div>
            <div @click.stop="cancel" class="operate-btn">{{text.cancelBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: Object,
        default() {
          return {
            content: '确定吗？',
            confirmBtnText: '确认',
            cancelBtnText: '取消'
          };
        }
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      toggleDisplay() {
        this.showFlag = !this.showFlag;
      },
      confirm() {
        this.toggleDisplay();
        this.$emit('confirm');
      },
      cancel() {
        this.toggleDisplay();
        this.$emit('cancel');
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;
    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: $color-highlight-background;
      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text-l;
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;
        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid $color-background-d;
          color: $color-text-d;
          &.left {
            border-right: 1px solid $color-background-d;
          }
        }
      }
    }
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
