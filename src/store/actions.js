import * as types from './mutation-types';
import {shuffle} from "../api/utils";
import {playMode} from "../api/config";
import {saveSearchHistory, deleteSearchHistory, clearSearchHistory, savePlayHistory, saveFavorite, unFavorite} from "../api/cache";

export default {

  // 播放器相关
  selectPlay({commit}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
  },
  randomPlay({commit}, list) {
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_MODE, playMode.random);
    commit(types.SET_PLAYLIST, shuffle(list));
    commit(types.SET_CURRENT_INDEX, 0);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
  },
  insertSong({commit, state}, song) {
    let playlist = state.playlist.slice(0);
    let sequenceList = state.sequenceList.slice(0);
    let currentIndex = state.currentIndex;

    let fpIndex = findIndex(playlist, song);
    if (fpIndex > -1) {
      currentIndex = fpIndex;
    } else {
      playlist.push(song);
      sequenceList.push(song);
      currentIndex = playlist.length - 1;
    }
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
  },
  deleteSong({commit, state}, song) {
    let playlist = state.playlist.slice(0);
    let sequenceList = state.sequenceList.slice(0);
    let currentIndex = state.currentIndex;

    let fpIndex = findIndex(playlist, song);

    if (fpIndex < currentIndex) {
      currentIndex--;
    }

    if (fpIndex === currentIndex && currentIndex === playlist.length - 1) {
      currentIndex = 0;
    }

    if (playlist.length === 1) {
      currentIndex = -1;
      commit(types.SET_PLAYING_STATE, false);
    } else {
      commit(types.SET_PLAYING_STATE, true);
    }

    playlist.splice(fpIndex, 1);
    sequenceList = sequenceList.filter(item => item !== song);

    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_CURRENT_INDEX, currentIndex);
  },
  clearPlaylist({commit}) {
    commit(types.SET_SEQUENCE_LIST, []);
    commit(types.SET_PLAYLIST, []);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING_STATE, false);
  },


  // 历史记录相关
  saveSearchHistory({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearchHistory(query));
  },
  deleteSearchHistory({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearchHistory(query));
  },
  clearSearchHistory({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearchHistory());
  },

  savePlayHistory({commit, state}, song) {
    commit(types.SET_PLAY_HISTORY, savePlayHistory(song));
  },

  // 用户中心
  saveFavorite({commit}, song) {
    commit(types.SET_FAVORITE, saveFavorite(song))
  },
  unFavorite({commit}, song) {
    commit(types.SET_FAVORITE, unFavorite(song))
  },

};

function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id);
}
