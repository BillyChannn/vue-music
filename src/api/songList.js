import {commonParams} from 'api/config';
import axios from 'axios';

export function getSongList(id) {
  const url = '/api/getSongList';

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: id,
    format: 'json',
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    platform: 'yqq',
    needNewCode: 0
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
