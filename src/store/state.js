import {playMode} from '../api/config';
import {loadSearchHistory, loadPlayHistory, loadFavorite} from "../api/cache";

export default {
  singer: {},
  topListId: 0,
  songListId: 0,

  // 播放器相关
  isPlaying: false,
  isFullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,

  // 历史纪录
  searchHistory: loadSearchHistory(),
  playHistory: loadPlayHistory(),

  // 用户中心
  isUserShow: false,
  favorite: loadFavorite()

}

