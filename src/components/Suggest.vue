<template>
  <v-scroll
    class="suggest"
    ref="suggest"
    :data="result"
    :listenBeforeScroll="listenBeforeScroll"
    :pullUpLoad="pullUpLoad"
    @pullingUp="searchMore"
    @beforeScroll="beforeScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="setIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <v-loading v-show="!result.length"></v-loading>
  </v-scroll>
</template>

<script>
  import {search} from "../api/search";
  import {ERR_OK} from "../api/config";
  import {createSong} from "../api/song";
  import {Singer} from '../api/singer';
  import Scroll from '../components/Scroll';
  import Loading from '../components/Loading';
  import {mapMutations, mapActions} from "vuex";
  import VNoResult from "./NoResult";

  const TYPE_SINGER = 'singer';

  export default {
    data() {
      return {
        page: 1,
        perPage: 20,
        result: [],
        hasMore: true,
        listenBeforeScroll: true
      };
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      pullUpLoad() {
        return {
          threshold: -50,
          moreTxt: '上拉加载',
          noMoreTxt: '没有更多数据了',
          hasMore: this.hasMore,
          empty: !this.result.length,
          emptyTxt: '抱歉，暂无搜索结果'
        };
      }
    },
    watch: {
      query(newQuery) {
        this.hasMore = true;
        this.result = [];
        newQuery ? this.search() : null;
      }
    },
    methods: {
      ...mapActions([
        'insertSong'
      ]),
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      beforeScroll() {
        this.$emit('listScroll');
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({id: item.singermid, name: item.singername});
          this.$router.push('/search/' + singer.id);
          this.setSinger(singer);
        } else {
          this.insertSong(item);
        }
        this.$emit('select', item);
      },
      searchMore() {
        if (this.hasMore) {
          this.page++;
          this.search();
        }
      },
      getDisplayName(song) {
        if (song.type === TYPE_SINGER) {
          return song.singername;
        } else {
          return song.name + ' - ' + song.singer;
        }
      },
      setIconClass(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine';
        } else {
          return 'icon-music';
        }
      },
      search() {
        search(this.query, this.page, this.perPage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data));
            this.hasMore = res.data.song.totalnum > this.result.length;
          }
        });
      },
      _genResult(data) {
        let ret = [];
        if (this.showSinger) {
          if (data.zhida.singerid) {
            ret.push({...data.zhida, ...{type: TYPE_SINGER}});
          }
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach(item => {
          item.songid && item.albumid ? ret.push(createSong(item)) : null;
        });
        return ret;
      }

    },
    name: "suggest",
    components: {
      'v-scroll': Scroll,
      'v-loading': Loading
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .suggest {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
    .loading {
      position: absolute;
      top: 500%;
      width: 100%;
    }
  }
</style>
