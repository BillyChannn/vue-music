import {commonParams, ERR_OK} from "./config"
import axios from 'axios'
import {Base64} from 'js-base64'

export class Song {
  constructor({id, mid, singer, name, album, duration, albumPic, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.albumPic = albumPic;
    this.url = url;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      _getLyric(this.mid).then(res => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    });
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    albumPic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `//ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=38`
  });
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join('/');
}

function _getLyric(songMid) {
  const url = '/api/getLyric';

  const data = Object.assign({}, commonParams, {
    callback: 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: songMid,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
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
