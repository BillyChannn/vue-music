<template>
  <transition name="slide">
    <v-detail 
      :title="ListName" 
      :headerBgImg="albumPic"
      :songList="songList">
    </v-detail>
  </transition>
</template>

<script>
import Detail from 'components/Detail';
import {mapGetters} from 'vuex';
import {getSongList} from 'api/songList';
import {ERR_OK} from 'api/config';
import {createSong} from 'api/song';

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
      'songListId'
    ])
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.songListId) {
        this.$router.go(-1);
        return null;
      }
      getSongList(this.songListId).then(res => {
        if (res.code === ERR_OK) {
          this.ListName = res.cdlist[0].dissname;
          this.albumPic = res.cdlist[0].logo;
          this.songList = this._normalizeSongList(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongList(list) {
      let ret = [];
      list.forEach(song => {
        ret.push(createSong(song));
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
