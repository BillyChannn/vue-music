const getters = {
  singer: state => state.singer,
  topListId: state => state.topListId,
  songListId: state => state.songListId,

  // 播放器相关
  isPlaying: state => state.isPlaying,
  isFullScreen: state => state.isFullScreen,
  playlist: state => state.playlist,
  sequenceList: state => state.sequenceList,
  mode: state => state.mode,
  currentIndex: state => state.currentIndex,
  currentSong: state => state.playlist[state.currentIndex] || {},

  // 历史纪录
  searchHistory: state => state.searchHistory,
  playHistory: state => state.playHistory,

  // 用户中心
  isUserShow: state => state.isUserShow,
  favorite: state => state.favorite,
};


export default getters;
