import jsonp from '../api/jsonp';
import {commonParams, options} from '../api/config';
import axios from 'axios';

export function getRecommendSlider() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    format: 'jsonp'
  });

  return jsonp(url, data, options);
}

export function getRecommendSongList(page) {
  const url = '/api/getRecommendSongList';

  const data = Object.assign({}, commonParams, {
    sin: page,
    picmid: 1,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    ein: 29
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
