<template>
  <div class="recommend" ref="recommend">
    <v-scroll class="recommend-content" ref="scroll" :data="recommendSongList">
      <v-slider v-if="recommendSlider.length">
        <a v-for="item in recommendSlider" :href="item.linkUrl">
          <img @load="loadImage" :src="item.picUrl" :alt="item.id">
        </a>
      </v-slider>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul class="list-content">
          <li class="list-item" v-for="item in recommendSongList" @click="selectItem(item)">
            <img class="cover" v-lazy="item.imgurl" :alt="item.introduction">
            <div class="info">
              <h2 class="desc" v-html="item.dissname"></h2>
              <span class="author" v-html="item.creator.name"></span>
            </div>
          </li>
        </ul>
      </div>
    </v-scroll>
    <v-loading class="loading" v-show="!recommendSongList.length"></v-loading>s
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRecommendSlider, getRecommendSongList} from '../api/recommend';
  import {ERR_OK} from '../api/config';
  import {playlistMixin} from "../api/mixin";
  import Slider from '../components/Slider';
  import Scroll from '../components/Scroll';
  import Loading from '../components/Loading';
  import {mapMutations} from 'vuex';

  export default {
    mixins: [playlistMixin],
    components: {
      'v-slider': Slider,
      'v-scroll': Scroll,
      'v-loading': Loading
    },
    data() {
      return {
        recommendSlider: [],
        recommendSongList: []
      };
    },
    created() {
      this._getRecommendSlider();
      this._getRecommendSongList();
    },
    methods: {
      ...mapMutations({
        setSongListId: 'SET_SONG_LIST_ID'
      }),
      handlePlaylist(list) {
        this.$refs.recommend.style.bottom = list.length ? '60px' : '';
        this.$refs.scroll.refresh();
      },
      selectItem(item) {
        this.$router.push('/recommend/' + item.dissid);
        this.setSongListId(item.dissid);
      },
      _getRecommendSlider() {
        getRecommendSlider().then(res => {
          if (res.code === ERR_OK) {
            this.recommendSlider = res.data.slider;
          }
        });
      },
      _getRecommendSongList() {
        getRecommendSongList().then(res => {
          if (res.code === ERR_OK) {
            this.recommendSongList = res.data.list;
          }
        });
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .recommend {
    position: absolute;
    top: 88px;
    bottom: 0;
    width: 100%;
    overflow: hidden;

    .recommend-content {
      width: 100%;
      height: 100%;
    }

    .recommend-list {
      padding: 0 20px;

      .list-content {
        display: flex;
        flex-wrap: wrap;
      }

      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .list-item {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        height: 60px;
        padding-bottom: 20px;

        @media screen and (min-width: 768px) {
          width: 50%;
        }

        .cover {
          width: 60px;
          padding-right: 20px;
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          font-size: $font-size-medium;

          .desc {
            color: $color-text;
          }

          .author {
            color: $color-text-d;
          }
        }
      }
    }

    .loading {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
    }
  }

</style>
