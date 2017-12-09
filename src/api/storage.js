export default {
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    return this.get(key);
  },

  add(key, val) {
    const storage = this.get(key).filter(item => item !== val).unshift(val);
    return this.set(key, storage);
  },

  get(key, backUp) {
    return this.has(key) ? JSON.parse(localStorage.getItem(key)) : backUp;
  },

  getAll() {
    let ret = [];
    this.forEach((key, val) => ret[key] = val);
    return ret;
  },

  forEach(callback) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      callback(key, this.get(key));
    }
  },

  has(key) {
    return localStorage.hasOwnProperty(key);
  },

  remove(key) {
    this.has(key) ? localStorage.removeItem(key) : null;
    return this.getAll();
  },

  clear() {
    localStorage.clear();
  },
};
