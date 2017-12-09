<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const PROGRESS_BTN_WIDTH = 16;

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
          const offsetX = newPercent * barWidth;
          this._offset(offsetX);
        }
      }
    },
    created() {
      this.touch = {};
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if (this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
          const deltaX = e.touches[0].pageX - this.touch.startX;
          const offsetX = Math.min(barWidth, Math.max(0, this.touch.left + deltaX));
          this._offset(offsetX);
          this._emit('percentChanging');
        }
      },
      progressTouchEnd(e) {
        this.touch.initiated = false;
        this._emit();
      },
      progressClick(e) {
        this._offset(e.offsetX);
        this._emit();
      },
      _emit(name = 'percentChanged') {
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit(name, percent)
      },
      _offset(offsetX) {
        this.$refs.progress.style.width = offsetX + 'px';
        this.$refs.progressBtn.style.left = offsetX - PROGRESS_BTN_WIDTH * 0.5 + 'px';
      }
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import "../style/variable";

  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        top: -13px;
        width: 30px;
        height: 30px;
      }
      .progress-btn {
        position: relative;
        top: 7.5px;
        left: 7.5px;
        width: 10px;
        height: 10px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
</style>
