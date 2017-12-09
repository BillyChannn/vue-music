import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;
const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 30;
const FAVORITE_KEY = 'favorite';

function insertArray(arr, val, compare, maxLength) {
  const index = arr.findIndex(compare);

  if (index === 0) {
    return null;
  }

  if (index > 0) {
    arr.splice(index, 1);
  }

  arr.unshift(val);

  if (maxLength && arr.length > maxLength) {
    arr.pop();
  }
}

export function saveSearchHistory(query) {
  let searches = loadSearchHistory();
  insertArray(searches, query, item => item === query, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function loadSearchHistory() {
  return storage.get(SEARCH_KEY, []);
}

export function deleteSearchHistory(query) {
  const searches = loadSearchHistory().filter(item => item !== query);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearSearchHistory() {
  localStorage.clear();
  return [];
}

export function savePlayHistory(song) {
  let searches = loadPlayHistory();
  insertArray(searches, song, item => item.id === song.id, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, searches);
  return searches;
}

export function loadPlayHistory() {
  return storage.get(PLAY_KEY, []);
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}

export function saveFavorite(song) {
  let searches = loadFavorite();
  insertArray(searches, song, item => item.id === song.id);
  storage.set(FAVORITE_KEY, searches);
  return searches;
}

export function unFavorite(song) {
  let ret = loadFavorite().filter(item => item.id !== song.id);
  storage.set(FAVORITE_KEY, ret);
  return ret;
}

