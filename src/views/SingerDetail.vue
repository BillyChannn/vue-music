<template>
  <transition name="slide">
    <v-detail
      :songList="songList"
      :title="singer.name"
      :headerBgImg="singer.avatar_x2"
      :pullUpLoad="pullUpLoad"
      @pullingUp="searchMore">
    </v-detail>
  </transition>
</template>

<script>
  import {getSingerDetail} from '../api/singer';
  import {createSong} from '../api/song';
  import {ERR_OK} from '../api/config';
  import {mapGetters} from 'vuex';
  import Detail from '../components/Detail';

  export default {
    components: {
      'v-detail': Detail
    },
    data() {
      return {
        songList: [],
        hasMore: true,
        page: 0
      };
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      pullUpLoad() {
        return {
          threshold: -50,
          moreTxt: '上拉加载',
          noMoreTxt: '没有更多数据了',
          hasMore: this.hasMore,
          empty: !this.songList
        };
      }
    },
    created() {
      this._getSingerDetail();
    },
    methods: {
      searchMore() {
        if (this.hasMore) {
          this.page++;
          this._getSingerDetail();
        }
      },
      _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer');
          return null;
        }
        getSingerDetail(this.singer.id, this.page).then(res => {
          if (res.code === ERR_OK) {
            this.songList = this.songList.concat(this._normalizeSongList(res.data.list));
            this.hasMore = res.data.total > this.songList.length;
          }
        });
      },
      _normalizeSongList(list) {
        let ret = [];
        list.forEach(item => {
          let {musicData} = item;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .slide-enter-active,
  .slide-leave-active {
    transition: all .4s;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateX(100%);
  }

</style>
