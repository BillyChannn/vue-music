<template>
  <div class="singer" ref="singer">
    <v-singer-list :data="singers" @selectSinger="selectSinger" ref="list"></v-singer-list>
    <v-loading class="loading" v-show="!singers.length"></v-loading>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList, Singer} from '../api/singer';
  import {ERR_OK} from '../api/config';
  import SingerList from '../components/SingerList';
  import Loading from '../components/Loading';
  import {mapMutations} from 'vuex';
  import {playlistMixin} from "../api/mixin";

  const HOT_NAME = '热门';
  const HOT_SINGER_LENGTH = 10;

  export default {
    mixins: [playlistMixin],
    components: {
      'v-singer-list': SingerList,
      'v-loading': Loading
    },
    data() {
      return {
        singers: []
      };
    },
    created() {
      this._getSingerList();
    },
    methods: {
      ...mapMutations({
        // vuex提供的语法糖，实现以下转换
        // this.setSinger(payload) <==> this.$store.commit('SET_SINGER', payload)
        setSinger: 'SET_SINGER'
      }),
      handlePlaylist(list) {
        this.$refs.singer.style.bottom = list.length ? '60px' : '';
        this.$refs.list.refresh();
      },
      selectSinger(singer) {
        this.$router.push('/singer/' + singer.id);
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSingerList(res.data.list);
          }
        });
      },
      _normalizeSingerList(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }));
          }

          let key = item.Findex;

          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            };
          }

          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        });

        let hot = [];
        let rest = [];
        for (let key in map) {
          let val = map[key];
          if (val.title === HOT_NAME) {
            hot.push(val);
          } else if (val.title.match(/[a-zA-Z]/)) {
            rest.push(val);
          }
        }
        rest.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(rest);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
    z-index: 100;
  }

  .loading {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }
</style>
