<template>
  <div class="search">
    <div class="search-box-wrapper">
      <v-search-box ref="searchBox" @query="onQueryChange"></v-search-box>
    </div>
    <v-scroll class="shortcut"
              ref="shortcut"
              v-show="!query"
              :data="searchHistory.concat(hotKeys)">
      <div class="hot-key">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item"
              v-for="hotKey in hotKeys"
              @click="addQuery(hotKey.k)">
            {{hotKey.k}}
          </li>
        </ul>
      </div>
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
        </h1>
        <v-search-history-list :searchHistory="searchHistory"
                               @select="addQuery"
                               @delete="deleteSearchHistory"></v-search-history-list>
      </div>
    </v-scroll>
    <div class="search-result" v-show="query">
      <v-suggest ref="suggest"
                 :query="query"
                 @listScroll="blurInput"
                 @select="selectSuggest"></v-suggest>
    </div>
    <v-confirm ref="confirm" :text="confirmText" @confirm="clearSearchHistory"></v-confirm>
    <router-view></router-view>
  </div>
</template>

<script>

  import SearchHistoryList from '../components/SearchHistoryList';
  import Scroll from '../components/Scroll';
  import Confirm from '../components/Confirm';
  import SearchBox from '../components/SearchBox';
  import Suggest from '../components/Suggest';
  import {getHotKey} from "../api/search";
  import {ERR_OK} from "../api/config";
  import {mapActions, mapGetters} from 'vuex';
  import {playlistMixin, searchMixin} from "../api/mixin";

  export default {
    mixins: [playlistMixin, searchMixin],
    data() {
      return {
        hotKeys: [],
        confirmText: {
          content: '确认删除全部历史记录吗？',
          cancelBtnText: '取消',
          confirmBtnText: '确认'
        }
      };
    },
    computed: {
      ...mapGetters([
        'searchHistory',
        'playlist'
      ])
    },
    created() {
      this._getHotKey();
    },
    updated() {
      this.handlePlaylist(this.playlist);
    },
    methods: {
      showConfirm () {
        this.$refs.confirm.toggleDisplay();
      },
      handlePlaylist(list) {
        this.$refs.shortcut.$el.style.bottom = list.length ? '60px' : '';
        this.$refs.shortcut.refresh();
      },
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKeys = res.data.hotkey.slice(0, 10);
          }
        });
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    components: {
      'v-search-history-list': SearchHistoryList,
      'v-scroll': Scroll,
      'v-confirm': Confirm,
      'v-search-box': SearchBox,
      'v-suggest': Suggest
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
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

    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>
