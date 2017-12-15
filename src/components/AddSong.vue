<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到播放列表</h1>
        <div class="close">
          <i class="icon-close" @click="toggleDisplay"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <v-search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></v-search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <v-switches ref="switches"
                    :switches="switches"
                    :currentIndex="currentIndex"
                    @switch="switchItem"></v-switches>
        <div class="list-wrapper">
          <v-scroll ref="scroll" class="list-scroll">
            <v-song-list :songList="playHistory"
                         v-show="currentIndex === 0"
                         @select="selectSong"></v-song-list>
            <v-search-history-list :searchHistory="searchHistory"
                                   v-show="currentIndex === 1"
                                   @select="addQuery"
                                   @delete="deleteSearchHistory"></v-search-history-list>
          </v-scroll>
        </div>

      </div>
      <div class="search-result" v-show="query">
        <v-suggest ref="suggest"
                   :query="query"
                   :showSinger="showSinger"
                   @select="_selectSuggest"
                   @listScroll="blurInput"></v-suggest>
      </div>
      <v-prompt-box ref="promptBox" text="1首歌歌曲已经添加到播放列表"></v-prompt-box>
    </div>
  </transition>
</template>

<script>
  import {searchMixin} from "../api/mixin";
  import SearchBox from './SearchBox';
  import Suggest from './Suggest';
  import Switches from './Switches';
  import SearchHistoryList from './SearchHistoryList';
  import SongList from './SongList';
  import Scroll from './Scroll';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {Song} from "../api/song";
  import PromptBox from './PromptBox';

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      };
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      _selectSuggest(item) {
        this.selectSuggest(item);
        this.$refs.promptBox.show(1500);
      },
      selectSong(song, index) {
        index > 0 ? this.insertSong(new Song(song)) : this.setPlayingState(true);
        this.$refs.promptBox.show(1500);
      },
      toggleDisplay() {
        this.showFlag = !this.showFlag;
        if (this.showFlag) {
          setTimeout(() => {
            this.$refs.scroll.refresh();
          }, 20);
        }
      },
      switchItem(index) {
        this.currentIndex = index;
      },
      ...mapMutations({
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      'v-search-box': SearchBox,
      'v-suggest': Suggest,
      'v-switches': Switches,
      'v-scroll': Scroll,
      'v-song-list': SongList,
      'v-search-history-list': SearchHistoryList,
      'v-prompt-box': PromptBox
    },
    name: "add-song"
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translateX(100%);
    }
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut {
      .list-wrapper {
        position: absolute;
        top: 165px;
        bottom: 0;
        box-sizing: border-box;
        padding: 20px 30px;
        width: 100%;
        overflow: hidden;

        .list-scroll {
          height: 100%;
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
    .tip-title {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        font-size: $font-size-medium;
        color: $color-theme;
        margin-right: 4px;
      }

      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>
