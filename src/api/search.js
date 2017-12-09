import jsonp from '../api/jsonp';
import {commonParams, options} from '../api/config';

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const data = Object.assign({}, commonParams, {
    g_tk: 724661112,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  });

  return jsonp(url, data, options);
}

export function search(query, page = 1, perPage = 20, flag = 1) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n: perPage,
    perpage: perPage,
    catZhida: flag,
    g_tk: 724661112,
    uin: 0,
    format: 'jsonp',
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    _: +new Date()
  });

  return jsonp(url, data, options);
}

