<template>
  <div id="app">
    <v-header></v-header>
    <v-nav></v-nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <v-player></v-player>
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
  }
};
</script>

<style>

</style>
