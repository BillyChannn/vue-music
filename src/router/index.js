import Vue from 'vue';
import Router from 'vue-router';
import Recommend from '../views/Recommend';
import Singer from '../views/Singer';
import SingerDetail from '../views/SingerDetail';
import TopList from '../views/TopList';
import Search from '../views/Search';
import TopListDetail from '../views/TopListDetail';
import SongListDetail from '../views/SongListDetail';
import User from '../views/User';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: SongListDetail
        }
      ]
    },
    {
      path: '/topList',
      component: TopList,
      children: [
        {
          path: ':id',
          component: TopListDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/User',
      component: User
    },

  ]
});
