<template>
  <transition name="slide">
    <v-detail
      :songList="songList"
      :title="singer.name"
      :headerBgImg="singer.avatar_x2">
    </v-detail>
  </transition>
</template>

<script>
import {getSingerDetail} from 'api/singer';
import {createSong} from 'api/song';
import {ERR_OK} from 'api/config';
import {mapGetters} from 'vuex';
import Detail from 'components/Detail';

export default {
  components: {
    'v-detail': Detail
  },
  data() {
    return {
      songList: []
    };
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return null;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songList = this._normalizeSongList(res.data.list);
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
    transition: all .5s;
  }

  .slide-enter,
  .slide-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

</style>
