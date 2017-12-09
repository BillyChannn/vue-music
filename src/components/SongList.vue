<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(song, index) in songList"
        @click="selectItem(song, index)">
        <div class="rank" v-show="isRank">
          <span
            class="text"
            :class="{icon: index <= 2,icon0: index===0, icon1: index===1, icon2: index===2}">
            {{index + 1}}
          </span>
        </div>
        <div class="content">
          <h2 v-html="song.name"></h2>
          <p class="desc" v-html="song.singer + ' · ' + song.album"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songList: {
        type: Array,
        default() {
          return [];
        }
      },
      isRank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem(song, index) {
        this.$emit('select', song, index);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";
  @import "../style/mixin";

  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;

      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;

        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;

          &.icon0 {
            @include bg-image('first');
          }

          &.icon1 {
            @include bg-image('second');
          }

          &.icon2 {
            @include bg-image('third');
          }
        }

        .text {
          color: $color-theme;
          font-size: $font-size-large;
        }
      }

      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          @include no-wrap();
        }

        .desc {
          @include no-wrap();
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
  }
</style>
