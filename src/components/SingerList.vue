<template>
  <div class="singer-list">
    <v-scroll
      class="list-groups-wrapper"
      ref="singerList"
      :data="data"
      :listenScroll="true"
      :probeType="3"
      @scroll="onScroll">
      <li
        class="list-group"
        ref="listGroup"
        v-for="group in data"
        :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="item in group.items"
            @click="select(item)">
            <img class="avatar" v-lazy="item.avatar" :alt="item.name">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </v-scroll>

    <div
      class="list-shortcut"
      @touchstart="onShortcutListTouchStart"
      @touchmove.stop.prevent="onShortcutListTouchMove">
      <ul>
        <li class="item"
            :class="{'current': index === curIndex}"
            :data-index="index"
            v-for="(item, index) in shortcutList">
          {{item}}
        </li>
      </ul>
    </div>

    <h2
      class="title-fixed"
      :style="{top: fixedTitleTop}"
      v-show="fixedTitle">
      {{fixedTitle}}
    </h2>
  </div>
</template>

<script>
  import Scroll from "../components/Scroll";

  const SHORTCUT_ITEM_HEIGHT = 18;

  export default {
    components: {
      'v-scroll': Scroll
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        curIndex: 0,
        scrollY: 0,
        dis: 0
      };
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        });
      },
      fixedTitle() {
        if (this.scrollY < 0) {
          return '';
        } else {
          return this.data[this.curIndex] ? this.data[this.curIndex].title : '';
        }
      },
      fixedTitleTop() {
        return this.dis >= 30 ? 0 : this.dis - 30 + 'px';
      }
    },
    watch: {
      data() {
        setTimeout(() => this._calcGroupsPosY(), 20);
      }
    },
    created() {
      this.touch = {};
      this.groupsPosY = [];
    },
    methods: {
      refresh() {
        this.$refs.singerList.refresh();
      },
      onShortcutListTouchStart(e) {
        const index = Number(e.target.getAttribute('data-index'));
        this.touch.y1 = e.touches[0].pageY;
        this.touch.startIndex = index;
        this._scrollTo(index);
      },
      onShortcutListTouchMove(e) {
        this.touch.y2 = e.touches[0].pageY;
        let delta = Math.round((this.touch.y2 - this.touch.y1) / SHORTCUT_ITEM_HEIGHT);
        let index = Number(this.touch.startIndex) + delta;
        this._scrollTo(index);
      },
      onScroll(pos) {
        this.scrollY = -pos.y;
        const y = -pos.y;
        const groupsPosY = this.groupsPosY;
        let i;
        for (i = 0; i < groupsPosY.length; i++) {
          // y<0 的情况是为了让curIndex设为0
          // 而这一段可以不用加
          // 因为在达到 y<0 之前已经将curIndex设为0了
          // if (y < 0) {
          //   this.curIndex = 0;
          //   break;
          // }
          if (y >= groupsPosY[i] && y < groupsPosY[i + 1]) {
            this.curIndex = i;
            break;
          }
        }
        this.dis = groupsPosY[i + 1] - this.scrollY;
      },
      select(singer) {
        this.$emit('selectSinger', singer);
      },
      _scrollTo(index) {
        if (index < 0) {
          index = 0;
        } else if (index > this.groupsPosY.length - 2) {
          index = this.groupsPosY.length - 2;
        }
        if (index !== null) {
          this.curIndex = index;
          this.$refs.singerList.scrollToElement(this.$refs.listGroup[index], 0);
        }
      },
      _calcGroupsPosY() {
        this.groupsPosY = [];
        const list = this.$refs.listGroup;
        let posY = 0;
        this.groupsPosY.push(posY);
        for (let i = 0; i < list.length; i++) {
          let group = list[i];
          posY += group.clientHeight;
          this.groupsPosY.push(posY);
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../style/variable";

  .singer-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;

    .list-groups-wrapper {
      width: 100%;
      height: 100%;
    }

    .list-group {
      padding-bottom: 30px;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 50px;
          // height: 50px;
          border-radius: 50%;
        }

        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }

    .list-shortcut {
      position: absolute;
      z-index: 100;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;

      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;

        &.current {
          color: $color-theme;
        }
      }
    }

    .title-fixed {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      padding-left: 20px;
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
</style>
