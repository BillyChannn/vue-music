<template>
  <div class="player">
    <transition name="normal"
                @enter="onMaximize"
                @leave="onMinimize">
      <div class="normal-player" v-show="isFullScreen && playlist.length">

        <div class="background">
          <img :src="currentSong.albumPic" width="100%" height="100%" alt="">
        </div>

        <div class="top">
          <span class="icon-back" @click="minimize"></span>
          <div class="title" v-html="currentSong.name"></div>
          <div class="subtitle" v-html="currentSong.singer"></div>
        </div>

        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd play" :class="{pause: !isPlaying || !canPlay}">
                <img :src="currentSong.albumPic">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>

          <v-scroll class="middle-r" :data="currentLyric" ref="lyricList">
            <div class="lyric-wrapper">
              <div class="currentLyric" v-if="currentLyric">
                <p
                  class="text"
                  :class="{current: currentLineNum === index}"
                  ref="lyricLine"
                  v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </v-scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentView === 'cd'}"></span>
            <span class="dot" :class="{active: currentView === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <v-progress-bar
                :percent="percent"
                @percentChanged="onPercentChanged"></v-progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <span :class="modeIcon" @click="changeMode"></span>
            </div>
            <div class="icon icon-left">
              <span class="icon-prev" @click="changeSong(-1)"></span>
            </div>
            <div class="icon icon-center" :class="{disable: !canPlay}">
              <span :class="playIcon" @click="togglePlaying"></span>
            </div>
            <div class="icon icon-right">
              <span class="icon-next" @click="changeSong()"></span>
            </div>
            <div class="icon icon-right">
              <span :class="favoriteIcon(currentSong)" @click="toggleFavorite()"></span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!isFullScreen && playlist.length" @click="maximize">
        <div class="mini-progress-bar" :style="{width: miniProgressWidth}"></div>
        <div class="icon">
          <img width="40" height="40" :src="currentSong.albumPic" class="play" :class="{pause: !isPlaying}">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <span :class="playIconMini" @click.stop="togglePlaying"></span>
        </div>
        <div class="control">
          <span class="icon-playlist" @click.stop="showPlaylist"></span>
        </div>
      </div>
    </transition>

    <v-playlist ref="playlist"></v-playlist>

    <audio
      ref="audio"
      :src="currentSong.url"
      @timeupdate="onTimeUpdate"
      @loadstart="canPlay = false"
      @canplay="canPlay = true"
      @error="canPlay = false"
      @play="canplay = true"
      @ended="end"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import animations from 'create-keyframe-animation';
  import Lyric from 'lyric-parser';
  import ProgressBar from '../components/ProgressBar';
  import Scroll from '../components/Scroll';
  import Playlist from '../components/Playlist';
  import {playMode, ERR_OK} from '../api/config';
  import {playerMixin} from "../api/mixin";

  export default {
    mixins: [playerMixin],
    components: {
      'v-progress-bar': ProgressBar,
      'v-scroll': Scroll,
      'v-playlist': Playlist
    },
    data() {
      return {
        currentTime: 0,
        canPlay: false,
        currentLyric: null,
        currentLineNum: 0,
        currentView: 'cd',
        playingLyric: ''
      };
    },
    computed: {
      ...mapGetters([
        'isPlaying',
        'isFullScreen',
        'playlist',
        'sequenceList',
        'currentSong',
        'currentIndex',
        'mode'
      ]),
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      playIcon() {
        return this.isPlaying ? 'icon-pause' : 'icon-play';
      },
      playIconMini() {
        return this.isPlaying ? 'icon-pause-mini' : 'icon-play-mini';
      },
      miniProgressWidth() {
        return this.percent * 100 + '%';
      }
    },
    watch: {
      canPlay(newVal) {
        this.$nextTick(() => {
          const audio = this.$refs.audio;

          if (newVal === false || !this.isPlaying) {
            return null;
          }

          if (this.playList && this.playList.length <= 0) {
            audio.pause();
            return null;
          }

          if (this.currentLyric) {
            this.currentLyric.stop();
            this.currentTime = 0;
            this.playingLyric = '';
            this.currentLineNum = 0;
            this.currentLyric = null;
          }

          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.getLyric();
            audio.play();
            this.savePlayHistory(this.currentSong);
          }, 300);
        });
      },
      isPlaying(newVal) {
        const audio = this.$refs.audio;
        if (this.canPlay) {
          newVal ? audio.play() : audio.pause();
        }
      },
    },
    created() {
      this.touch = {};
      this.timer = null;
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'savePlayHistory'
      ]),
      showPlaylist() {
        this.$refs.playlist.toggleDisplay();
      },
      minimize() {
        this.setFullScreen(false);
      },
      maximize() {
        this.setFullScreen(true);
      },
      onMaximize(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        let animation = {
          0: {
            transform: `translate(${x}px,${y}px) scale(${scale})`
          },
          60: {
            transform: `translate(0, 0) scale(1.1)`
          },
          100: {
            transform: `translate(0, 0) scale(1)`
          }
        };

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, 'move', () => {
          animations.unregisterAnimation('move');
          this.$refs.cdWrapper.style.animation = '';
          done();
        });
      },
      onMinimize(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        this.$refs.cdWrapper.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
        el.addEventListener('transitionend', () => {
          this.$refs.cdWrapper.style.transition = '';
          this.$refs.cdWrapper.style.transform = '';
          done();
        });
      },
      onTimeUpdate(e) {
        const time = e.target.currentTime;
        const duration = this.currentSong.duration;
        this.currentTime = time > duration ? duration : time;
        this.canPlay = true;
      },
      togglePlaying() {
        if (this.canPlay) {
          this.setPlayingState(!this.isPlaying);
        }
        this.currentLyric ? this.currentLyric.togglePlay() : null;
      },
      changeSong(offset = 1) {
        let index = this.currentIndex;
        const len = this.playlist.length;

        if (len === 1) {
          if (offset < 0) {
            this.$refs.audio.currentTime = 0;
          }
          return null;
        }

        if (index === 0 && offset < 0) {
          index = len - 1;
        } else if (index === len - 1 && offset > 0) {
          index = 0;
        } else {
          index = index + offset;
        }

        this.setCurrentIndex(index);

        if (!this.isPlaying) {
          this.togglePlaying();
        }
      },
      end() {
        if (this.mode !== playMode.loop && this.playlist.length > 1) {
          this.changeSong();
        } else if (this.mode === playMode.loop || this.playlist.length === 1) {
          this.$refs.audio.currentTime = 0;
          this.$refs.audio.play();
          this.currentLyric ? this.currentLyric.seek(0) : null;
        }
      },
      onPercentChanged(percent) {
        const time = this.currentSong.duration * percent;
        this.$refs.audio.currentTime = time;
        this.currentLyric.seek(time * 1000);
        if (!this.isPlaying) {
          this.togglePlaying();
        }
      },
      formatTime(time) {
        time = Math.floor(time);
        const min = Math.floor(time / 60);
        const sec = this._addZero(time % 60);
        return min + ':' + sec;
      },
      getLyric() {
        // this.currentLyric ? this.currentLyric.seek(0) : null;
        this.currentSong.getLyric().then(lyric => {
          // this.currentLyric ? this.currentLyric.stop() : null;
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          this.isPlaying ? this.currentLyric.play() : null;
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        });
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scroll.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scroll.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      middleTouchStart(e) {
        // TODO: 搞清楚 initiated 这个标志位有没有必要添加；
        // this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
        this.$refs.lyricList.$el.style.transition = null;
        this.$refs.middleL.style.transition = null;
      },
      middleTouchMove(e) {
        // if (this.touch.initiated) {
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const deltaY = e.touches[0].pageY - this.touch.startY;
        const ww = window.innerWidth;
        if (Math.abs(deltaY) < Math.abs(deltaX)) {
          const offsetX = Math.min(0, Math.max(-ww, this.currentView === 'cd' ? deltaX : deltaX - ww));
          this.touch.offsetPercent = Math.abs(offsetX / ww);
          this.$refs.middleL.style.opacity = 1 - Math.abs(offsetX / ww);
          this.$refs.lyricList.$el.style.transform = `translateX(${offsetX}px)`;
        }
        // }
      },
      middleTouchEnd() {
        let offsetX;
        let opacity;
        if (this.currentView === 'cd') {
          if (this.touch.offsetPercent > 0.1) {
            offsetX = -window.innerWidth;
            opacity = 0;
            this.currentView = 'lyric';
          } else {
            offsetX = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.offsetPercent < 0.9) {
            offsetX = 0;
            opacity = 1;
            this.currentView = 'cd';
          } else {
            opacity = 0;
            offsetX = -window.innerWidth;
          }
        }
        this.$refs.lyricList.$el.style.transition = 'all 0.4s';
        this.$refs.lyricList.$el.style.transform = `translateX(${offsetX}px)`;

        this.$refs.middleL.style.transition = 'all 0.4s';
        this.$refs.middleL.style.opacity = opacity;

        this.touch = {};
      },
      _addZero(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
      _getPosAndScale() {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {x, y, scale};
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 998;
      background: $color-background;

      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }

      .top {
        position: relative;
        margin-bottom: 25px;
        .icon-back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }

      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused;
              }
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }

        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            transition: all 0.4s;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }

        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;

          .time {
            flex: 0 0 30px;
            width: 30px;
            font-size: $font-size-small;
            line-height: 30px;
            color: $color-text;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }

          .progress-bar-wrapper {
            flex: 1;
          }
        }

        .operators {
          display: flex;
          align-items: center;

          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            span {
              font-size: 30px;
            }
          }
          .icon-left {
            text-align: right;
          }
          .icon-center {
            padding: 0 20px;
            text-align: center;
            span {
              font-size: 40px;
            }
          }
          .icon-right {
            text-align: left;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }

      &.normal-enter-active, &.normal-leave-active {
        transition: all 0.4s;
        .top, .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }

      &.normal-enter, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translateY(-100px);
        }
        .bottom {
          transform: translateY(100px);
        }
      }
    }

    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 999;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;

      &.mini-enter-active, &.mini-leave-active {
        transition: all .4s;
      }

      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }

      .mini-progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        border-top: 1px solid $color-theme;
      }

      .icon {
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }

      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;

        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px;
          color: $color-theme;
        }

        .icon-mini {
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
