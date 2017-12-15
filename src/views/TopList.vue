<template>
  <div class="top-list" ref="topList">
    <v-scroll class="top-list-content" :data="topLists" ref="scroll">
      <li class="top-list-item" v-for="item in topLists" @click="selectItem(item)">
        <img v-lazy="item.picUrl" :alt="item.topTitle">
        <ul class="song-list">
          <li v-for="(song,index) in item.songList">
            {{index + 1 + ' ' + song.songname + '-' + song.singername}}
          </li>
        </ul>
      </li>
    </v-scroll>
    <v-loading class="loading" v-show="!topLists.length"></v-loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from '../components/Scroll';
  import Loading from '../components/Loading';
  import {playlistMixin} from "../api/mixin";
  import {getTopLists} from '../api/topList';
  import {ERR_OK} from '../api/config';
  import {mapMutations} from 'vuex';

  export default {
    mixins: [playlistMixin],
    components: {
      'v-scroll': Scroll,
      'v-loading': Loading
    },
    data() {
      return {
        topLists: []
      };
    },
    created() {
      this._getTopLists();
    },
    methods: {
      ...mapMutations({
        setTopListId: 'SET_TOP_LIST_ID'
      }),
      handlePlaylist(list) {
        this.$refs.topList.style.bottom = list.length ? '60px' : '';
        this.$refs.scroll.refresh();
      },
      selectItem({id}) {
        this.$router.push('/topList/' + id);
        this.setTopListId(id);
      },
      _getTopLists() {
        getTopLists().then(res => {
          if (res.code === ERR_OK) {
            this.topLists = res.data.topList;
          }
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .top-list {
    position: absolute;
    top: 88px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }

  .top-list-content {
    width: 100%;
    height: 100%;

    .top-list-item {
      display: flex;
      padding: 20px 20px 0 20px;
      height: 100px;

      &:last-child {
        padding: 20px;
      }

      img {
        width: 100px;
      }

      .song-list {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        padding: 10px 20px;
        background-color: $color-highlight-background;
        overflow: hidden;

        > li {
          font-size: $font-size-small;
          color: $color-text-d;
          @include no-wrap();
        }
      }
    }

    .loading {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }

</style>
