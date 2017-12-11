<template>
  <div class="detail">
    <span class="icon-back" @click="goBack"></span>
    <h1 class="title" v-html="title"></h1>
    <div class="header" :style="headerBgImgStyle" ref="header">
      <div class="play-wrapper">
        <v-play-button v-show="songList.length" :text="playText" @click="randomPlay(songList)"></v-play-button>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <v-scroll class="scroll-wrapper"
              :data="songList"
              :probeType="3"
              :listenScroll="true"
              ref="scroll"
              :pullUpLoad="pullUpLoad"
              @pullingUp="onPullingUp"
              @scroll="onScroll">
      <v-song-list
        class="song-list"
        ref="songList"
        :songList="songList"
        :isRank="isRank"
        @select="selectItem"></v-song-list>
      <div class="list-background" ref="listBackground"></div>
    </v-scroll>
    <v-loading class="loading" v-show="!songList.length"></v-loading>
  </div>
</template>

<script>
  import SongList from '../components/SongList';
  import Scroll from '../components/Scroll';
  import Loading from '../components/Loading';
  import PlayButton from '../components/PlayButton';
  import {mapActions} from 'vuex';
  import {playlistMixin} from "../api/mixin";

  const TITLE_HEIGHT = 40;

  export default {
    mixins: [playlistMixin],
    components: {
      'v-song-list': SongList,
      'v-scroll': Scroll,
      'v-loading': Loading,
      'v-play-button': PlayButton
    },
    props: {
      headerBgImg: {
        type: String,
        default: ''
      },
      songList: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      isRank: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        playText: '随机播放全部'
      };
    },
    computed: {
      headerBgImgStyle() {
        return `background-image: url(${this.headerBgImg})`;
      }
    },
    methods: {
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
      onPullingUp() {
        this.$emit('pullingUp');
      },
      goBack() {
        this.$router.go(-1);
      },
      // onScroll({y}) {
      //   const headerHeight = window.innerHeight * 0.4;
      //   let header = this.$refs.header;
      //   let scroll = this.$refs.scroll.$el;
      //   let dis = headerHeight + y;
      //   let blur = Math.min(-y * 0.05, 10) + 'px';
      //   // x=headerHeight  y=滚动的量  s=scale的数值
      //   // x * s - x = y ==> x(s - 1) = y ==> s = y/x + 1
      //   let scale = y / headerHeight + 1;
      //
      //   if (y < 0) {
      //     header.style.transform = `scale(1)`;
      //     header.style.filter = `blur(${blur})`;
      //     header.style.zIndex = '0';
      //     scroll.style.zIndex = '1';
      //     if (dis >= TITLE_HEIGHT) {
      //       scroll.style.top = headerHeight + y + 'px';
      //       scroll.style.paddingTop = -y + 'px';
      //     } else {
      //       scroll.style.top = TITLE_HEIGHT + 'px';
      //       scroll.style.paddingTop = 0;
      //       scroll.style.overflow = 'hidden';
      //     }
      //   } else {
      //     scroll.style.zIndex = '0';
      //     scroll.style.top = headerHeight + 'px';
      //     scroll.style.paddingTop = '0';
      //     header.style.zIndex = '1';
      //     header.style.transform = `scale(${scale})`;
      //     header.style.filter = null;
      //   }
      // },
      onScroll({y}) {
        const headerHeight = window.innerHeight * 0.4;
        let header = this.$refs.header;
        let bg = this.$refs.listBackground;
        let scroll = this.$refs.scroll.$el;
        let dis = headerHeight + y;
        let blur = Math.min(-y * 0.05, 10) + 'px';
        // x=headerHeight  y=滚动的量  s=scale的数值
        // x * s - x = y ==> x(s - 1) = y ==> s = y/x + 1
        let scale = y / headerHeight + 1;

        header.style.height = '40%';
        if (y < 0) {
          header.style.transform = `scale(1)`;
          header.style.filter = `blur(${blur})`;
          header.style.zIndex = '10';
          scroll.style.zIndex = '20';
          bg.style.zIndex = '1';
          if (dis >= TITLE_HEIGHT) {
            // bg.style.top = y + 'px';
          } else {
            bg.style.height = scroll.clientHeight + dis - TITLE_HEIGHT + 'px';
            // bg.style.top = -y - headerHeight + TITLE_HEIGHT + 'px';
            header.style.height = TITLE_HEIGHT + 'px';
            header.style.zIndex = '30';
          }
        } else {
          bg.style.zIndex = '-1';
          header.style.transform = `scale(${scale})`;
          header.style.filter = null;
          header.style.zIndex = '30';
        }
      },
      selectItem(song, index) {
        this.selectPlay({
          list: this.songList,
          index: index
        });
      },
      handlePlaylist(list) {
        this.$refs.scroll.$el.style.bottom = list.length ? '60px' : '';
        this.$refs.scroll.refresh();
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;

    .icon-back {
      position: absolute;
      z-index: 100;
      top: 0;
      left: 5px;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }

    .title {
      position: absolute;
      z-index: 99;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .header {
      position: absolute;
      top: 0;
      height: 40%;
      width: 100%;
      transform-origin: top;
      background-size: cover;

      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;

        .play {
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
      }

      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }

    .scroll-wrapper {
      position: absolute;
      top: 40%;
      bottom: 0;
      width: 100%;
      background: $color-background;

      .song-list {
        position: relative;
        z-index: 2;
        padding: 20px 30px;
      }

      .list-background {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: -1;
        width: 100%;
        background: $color-background;
        overflow: hidden;
      }
    }

    .loading {
      position: absolute;
      top: 40%;
      bottom: 0;
      padding-top: 30%;
      width: 100%;
      z-index: 10000;
      background: $color-background;
    }
  }

</style>
