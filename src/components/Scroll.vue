<template>
  <div ref="scroll">
    <div class="scroll-content" ref="scrollContent">
      <slot>
      </slot>
      <slot name="pullUp" v-if="pullUpLoad">
        <div class="pullUp-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <p v-show="!pullUpLoad.empty">{{pullUpTxt}}</p>
            <v-no-result
              :title="pullUpLoad.emptyTxt"
              v-show="!pullUpLoad.hasMore && pullUpLoad.empty"></v-no-result>
          </div>
          <div class="after-trigger" v-else>
            <v-loading></v-loading>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import Loading from '../components/Loading';
  import NoResult from '../components/NoResult';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      scrollbar: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: [Boolean, Object],
        default: false
      },
      data: {
        default: null
      }
    },
    data() {
      return {
        isPullUpLoad: false,
        pullUpTxt: ''
      };
    },
    computed: {
      contentHeight() {
        return this.$refs.scrollContent.clientHeight;
      }
    },
    watch: {
      data() {
        setTimeout(() => this.refresh(), 20);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initScroll();
      });

    },
    methods: {
      initScroll() {
        if (this.$refs.scroll) {
          this.scroll = new BScroll(this.$refs.scroll, {
            click: this.click,
            probeType: this.probeType,
            scrollbar: this.scrollbar,
            pullUpLoad: this.pullUpLoad
          });
          if (this.listenScroll) {
            this.scroll.on('scroll', pos => {
              this.$emit('scroll', pos);
            });
          }
          if (this.listenBeforeScroll) {
            this.scroll.on('beforeScrollStart', pos => {
              this.$emit('beforeScroll', pos);
            });
          }
          if (this.pullUpLoad) {
            this.scroll.on('pullingUp', () => {
              if (this.pullUpLoad.hasMore) {
                this.isPullUpLoad = true;
                this.$emit('pullingUp');
              }
            });
          }
        }
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();

        if (this.scroll && this.pullUpLoad && this.isPullUpLoad) {
          this.scroll.finishPullUp();
          this.isPullUpLoad = false;
          this._refreshPullUpTxt();
        }
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },
      _refreshPullUpTxt() {
        const moreTxt = this.pullUpLoad && this.pullUpLoad.moreTxt ? this.pullUpLoad.moreTxt : '';
        const noMoreTxt = this.pullUpLoad && this.pullUpLoad.noMoreTxt ? this.pullUpLoad.noMoreTxt : '';
        this.pullUpTxt = this.pullUpLoad.hasMore ? moreTxt : noMoreTxt;
      }
    },
    components: {
      'v-loading': Loading,
      'v-no-result': NoResult
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .pullUp-wrapper {
    padding-bottom: 20px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
</style>
