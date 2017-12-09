<template>
  <transition name="slide">
    <div class="user">
      <v-switches class="switches"
                  :switches="switches"
                  :currentIndex="currentIndex"
                  @switch="switchItem"></v-switches>
      <i class="icon-back" @click="back"></i>
      <v-play-button class="play-button" :text="playText" @click="_randomPlay"></v-play-button>
      <div class="list-wrapper" ref="listWrapper">
        <v-scroll class="list-content" ref="scroll" :data="favorite.concat(playHistory)">
          <v-song-list :songList="favorite" v-show="currentIndex === 0" @select="selectSong"></v-song-list>
          <v-song-list :songList="playHistory" v-show="currentIndex === 1" @select="selectSong"></v-song-list>
        </v-scroll>
      </div>
      <v-no-result class="no-result" v-show="!noResultShowFlag" :title="noResultTitle"></v-no-result>
    </div>
  </transition>
</template>

<script>
  import Switches from '../components/Switches';
  import PlayButton from '../components/PlayButton';
  import NoResult from '../components/NoResult';
  import Scroll from '../components/Scroll';
  import SongList from '../components/SongList';
  import {mapGetters, mapActions} from 'vuex';
  import {playlistMixin} from "../api/mixin";
  import {Song} from "../api/song";

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ],
        currentIndex: 0,
        playText: '随机播放全部'
      };
    },
    computed: {
      noResultShowFlag() {
        return this.currentIndex === 0 ? this.favorite.length : this.playHistory.length;
      },
      noResultTitle() {
        return this.currentIndex === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲';
      },
      ...mapGetters([
        'favorite',
        'playHistory'
      ])
    },
    methods: {
      _randomPlay() {
        let list = this.currentIndex === 0 ? this.favorite : this.playHistory;
        list = list.map(item => new Song(item));
        this.randomPlay(list);
      },
      selectSong(song, index) {
        this.insertSong(new Song(song));
      },
      back() {
        this.$router.go(-1);
      },
      switchItem(index) {
        this.currentIndex = index;
      },
      handlePlaylist(list) {
        this.$refs.listWrapper.style.bottom = list.length ? '60px' : '';
        this.$refs.scroll.refresh();
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      'v-switches': Switches,
      'v-play-button': PlayButton,
      'v-no-result': NoResult,
      'v-scroll': Scroll,
      'v-song-list': SongList
    },
    name: "user"
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .user {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    background-color: $color-background;
    z-index: 2;

    &.slide-enter-active,
    &.slide-leave-active {
      transition: all 0.4s;
    }

    &.slide-enter,
    &.slide-leave-to {
      transform: translateX(100%);
    }

    .switches {
      margin: 10px auto 30px !important;
    }

    .icon-back {
      position: absolute;
      top: 5px;
      right: 10px;
      transform: rotate(180deg);
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }

    .play-button {
      border-color: $color-text-l;
      color: $color-text-l;
    }

    .list-wrapper {
      position: absolute;
      top: 110px;
      bottom: 0;
      box-sizing: border-box;
      padding: 20px 30px;
      width: 100%;

      .list-content {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }

    .no-result {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }

</style>
