import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Recommend = () => import('../views/Recommend');
const Singer = () => import('../views/Singer');
const TopList = () => import('../views/TopList');
const Search = () => import('../views/Search');
const SingerDetail = () => import('../views/SingerDetail');
const TopListDetail = () => import('../views/TopListDetail');
const SongListDetail = () => import('../views/SongListDetail');
const User = () => import('../views/User');

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
    }
  ]
});
