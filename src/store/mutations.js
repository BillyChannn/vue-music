import * as types from './mutation-types';

export default {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },

  [types.SET_TOP_LIST_ID](state, topListId) {
    state.topListId = topListId;
  },

  [types.SET_SONG_LIST_ID](state, songListId) {
    state.songListId = songListId;
  },

  // 播放器相关
  [types.SET_PLAYING_STATE](state, flag) {
    state.isPlaying = flag;
  },

  [types.SET_FULL_SCREEN](state, flag) {
    state.isFullScreen = flag;
  },

  [types.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },

  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },

  [types.SET_MODE](state, mode) {
    state.mode = mode;
  },

  [types.SET_CURRENT_INDEX](state, index) {
      state.currentIndex = index;
  },

  [types.SET_SEARCH_HISTORY](state, history) {
      state.searchHistory = history;
  },

  [types.SET_PLAY_HISTORY](state, playHistory) {
      state.playHistory = playHistory;
  },

  [types.SET_USER_DISPLAY](state, flag) {
      state.isUserShow = flag;
  },

  [types.SET_FAVORITE](state, favorite) {
      state.favorite = favorite;
  },


};
