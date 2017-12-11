const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 80;

const router = express.Router();

app.use(express.static(__dirname + '/dist'));
app.use('/api', router);

router.get('/getRecommendSongList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data);
  }).catch(err => {
    console.log(err);
  });
});

router.get('/getSongList', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/n/yqq/playlist/3285441761.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data);
  }).catch(err => {
    console.log(err);
  });
});

router.get('/getLyric', function(req, res) {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data;
    if (typeof ret === 'string') {
      let reg = /^\w+\(({[^()]+})\)$/;
      let matches = ret.match(reg);
      if (matches) {
        ret = JSON.parse(matches[1]);
      }
    }
    res.json(ret);
  }).catch((e) => {
    console.log(e);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!\n`);
});
