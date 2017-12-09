<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="toggleDisplay">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text"  @click="changeMode">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <v-scroll class="list-content" ref="listContent" :data="sequenceList">
          <transition-group name="list" ref="list" tag="ul">
            <li class="item"
                :class="{currentSong: currentSong === item}"
                ref="listItem"
                v-for="(item, index) in sequenceList"
                :key="item.id"
                @click="selectSong(item,index)">
              <i class="currentIcon" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}} - {{item.singer}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="favoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteSong(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </v-scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="toggleDisplay">
          <span>关闭</span>
        </div>
      </div>
      <v-add-song ref="addSong"></v-add-song>
      <v-confirm ref="confirm" :text="confirmText" @confirm="clearPlaylist"></v-confirm>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import Scroll from '../components/Scroll';
  import Confirm from '../components/Confirm';
  import AddSong from '../components/AddSong';
  import VConfirm from "./Confirm";
  import {playMode} from "../api/config";
  import {playerMixin} from "../api/mixin";

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        confirmText: {
          content: '确认清空播放列表吗？',
          cancelBtnText: '取消',
          confirmBtnText: '确认'
        }
      };
    },
    computed: {
      ...mapGetters([
        'currentSong',
        'isPlaying',
        'playlist',
      ]),
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random?  '随机播放' : '单曲循环';
      }
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (this.showFlag && newVal !== oldVal) {
          this.scrollToCurrentSong(newVal);
        }
      }
    },
    methods: {
      showAddSong() {
        this.$refs.addSong.toggleDisplay();
      },
      showConfirm() {
        this.$refs.confirm.toggleDisplay();
      },
      selectSong(song, index) {
        if (song === this.currentSong) {
          this.setPlayingState(!this.isPlaying);
        } else {
          if (this.mode === playMode.random) {
            index = this.playlist.findIndex(item => item.id === song.id);
          }
          this.setCurrentIndex(index);
          this.setPlayingState(true);
        }
      },
      scrollToCurrentSong(currentSong) {
        const index = this.sequenceList.findIndex(item => item.id === currentSong.id);
        index > 2 ? this.$refs.listContent.scrollToElement(this.$refs.listItem[index - 2], 200) : null;
      },
      getCurrentIcon(item) {
        const icon = this.isPlaying ? 'icon-pause' : 'icon-play';
        return item.id === this.currentSong.id ? icon : '';
      },
      toggleDisplay() {
        this.showFlag = !this.showFlag;
        setTimeout(() => {
          this.showFlag ? this.scrollToCurrentSong(this.currentSong) : null;
        }, 20);
      },
      ...mapMutations({
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'deleteSong',
        'clearPlaylist'
      ])
    },
    components: {
      'v-scroll': Scroll,
      'v-confirm': Confirm,
      'v-add-song': AddSong
    },
    name: "playlist"
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;

          .icon {
            margin-right: 10px;
            font-size: 30px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
          }
          &.list-enter, &.list-leave-to {
            height: 0;
          }
          &.currentSong {
            span {
              color: $color-theme;
            }
          }
          .currentIcon {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .like {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme-d;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme-d;
          }
        }
      }

      .list-operate {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
