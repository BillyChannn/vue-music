<template>
  <div id="app" @touchstart.once="initialAudio">
    <v-header></v-header>
    <v-nav></v-nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <v-player ref="player"></v-player>
  </div>
</template>

<script>
import Header from 'components/Header';
import Nav from 'components/Nav';
import Player from 'views/Player';

export default {
  components: {
    'v-header': Header,
    'v-nav': Nav,
    'v-player': Player
  },
  methods: {
    // 针对ios网页不能autoplay和preLoad做的优化
    initialAudio() {
      this.$refs.player.initialAudio();
    }
  }
};
</script>

<style>

</style>
