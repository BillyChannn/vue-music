import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from './config';
import {shuffle} from "./utils";

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  watch: {
    playlist(newList) {
      this.handlePlaylist(newList);
    }
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() {
    this.handlePlaylist(this.playlist);
  },
  methods: {
    handlePlaylist(list) {
      throw new Error('components must implement handlePlaylist method');
    }
  }
};

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'mode',
      'currentSong',
      'favorite'
    ]),
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },

  },
  methods: {
    favoriteIcon(song) {
      return this.favorite.findIndex(item => item.id === song.id) >= 0
        ? 'icon-favorite'
        : 'icon-not-favorite';
    },
    changeMode() {
      this.setMode((this.mode + 1) % 3);

      let list = [];
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }

      let index = list.findIndex(item => item.id === this.currentSong.id);
      this.setCurrentIndex(index);
      this.setPlaylist(list);
    },
    toggleFavorite(song) {
      song = song ? song : this.currentSong;
      this.favorite.findIndex(item => item.id === song.id) >= 0
        ? this.unFavorite(song)
        : this.saveFavorite(song);
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST',
      setMode: 'SET_MODE',
      setFavorite: 'SET_FAVORITE'
    }),
    ...mapActions([
      'saveFavorite',
      'unFavorite'
    ])
  }
};

export const searchMixin = {
  data() {
    return {
      query: ''
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapMutations({}),
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    selectSuggest() {
      this.saveSearchHistory(this.query);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    onQueryChange(query) {
      this.query = query;
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    }
  }
};
