import oJsonp from 'jsonp';

export default function jsonp(url, data, opts) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);

  return new Promise((resolve, reject) => {
    oJsonp(url, opts, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

function param(data) {
  let query = '';
  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : '';
    query += `&${key}=${encodeURIComponent(value)}`;
  }
  return query ? query.substring(1) : '';
}
