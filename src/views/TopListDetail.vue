<template>
  <transition name="slide">
    <v-detail
      :title="ListName"
      :headerBgImg="albumPic"
      :songList="songList"
      :isRank="true">
    </v-detail>
  </transition>
</template>

<script>
  import Detail from '../components/Detail';
  import {mapGetters} from 'vuex';
  import {getTopListDetail} from '../api/topList';
  import {ERR_OK} from '../api/config';
  import {createSong} from '../api/song';

  export default {
    components: {
      'v-detail': Detail
    },
    data() {
      return {
        ListName: '',
        albumPic: '',
        songList: []
      };
    },
    computed: {
      ...mapGetters([
        'topListId'
      ])
    },
    created() {
      this._getTopListDetail();
    },
    methods: {
      _getTopListDetail() {
        if (!this.topListId) {
          this.$router.push('/topList');
          return null;
        }
        getTopListDetail(this.topListId).then(res => {
          if (res.code === ERR_OK) {
            this.ListName = res.topinfo.ListName;
            this.albumPic = res.topinfo.pic_album;
            this.songList = this._normalizeSongList(res.songlist);
          }
        });
      },
      _normalizeSongList(list) {
        let ret = [];
        list.forEach(song => {
          ret.push(createSong(song.data));
        });
        return ret;
      }
    }
  };
</script>

<style scoped lang="scss">

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
