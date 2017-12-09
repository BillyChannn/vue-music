<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      click: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        this._play();

        window.addEventListener('resize', () => {
          this._setSliderWidth(true);
          this.slider.refresh();
        });
      }, 20);
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let groupWidth = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (var i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          child.classList.add('slider-item');
          child.style.width = sliderWidth + 'px';
          groupWidth += sliderWidth;
        };

        if (this.loop && !isResize) {
          groupWidth += 2 * sliderWidth;
        };
        this.$refs.sliderGroup.style.width = groupWidth + 'px';
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          click: this.click,
          probeType: 1,
          resizePolling: 60,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        this.slider.on('scroll', () => clearTimeout(this.timer));

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;
          clearTimeout(this.timer);
          this._play();
        });
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _play() {
        if (this.autoPlay) {
          this.timer = setTimeout(() => {
            this.slider.next(400);
          }, this.interval);
        };
      }
    },
    destroyed() {
      clearTimeout(this.timer);
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .slider {
    position: relative;
    width: 100%;
    overflow: hidden;
    min-height: 1px;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-item {
        float: left;
        display: block;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        text-align: center;

        img {
          display: block;
          width: 100%;
        }
      }
    }
  }

    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;

      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;

        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
</style>