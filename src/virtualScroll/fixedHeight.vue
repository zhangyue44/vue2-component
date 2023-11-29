<!-- vxe-list 的源码解读 -->
<!-- 自己理解：在template中，感觉topSpaceHeight可以不要，同时bodyHeight只计算一次即可 -->

<template>
  <div class="vxe-list">
    <div
      ref="virtualWrapper"
      class="vxe-list--virtual-wrapper"
      :style="styles"
      @scroll="scrollEvent"
    >
      <div
        ref="ySpace"
        class="vxe-list--y-space"
        :style="`height:${bodyHeight ? bodyHeight + 'px' : ''}`"
      ></div>
      <div
        ref="body"
        class="vxe-list--body"
        :style="`marginTop:${topSpaceHeight ? topSpaceHeight + 'px' : ''}`"
      >
        <slot :props="{ items: items }"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    height: [Number, String],
    maxHeight: [Number, String],
    sYopts: { type: Object, default: () => ({ gt: 100 }) },
  },
  data() {
    return {
      bodyHeight: 0, // 总长度
      topSpaceHeight: 0, // top偏移量
      scrollYLoad: false, // 是否启用虚拟列表
      items: [], // 可视区数据
    };
  },
  watch: {
    data(val) {
      this.loadData(val);
    },
  },
  cteated() {
    this.fullData = [];
    this.lastScrollLeft = 0;
    this.lastScrollTop = 0;
    this.scrollYStore = {
      startIndex: 0,
      endIndex: 0,
      visibleSize: 0,
    };
    this.loadData(this.data);
  },
  computed: {
    styles() {
      const { height, maxHeight } = this;
      const style = {};
      if (height) {
        style.height = `${height}px`;
      } else if (maxHeight) {
        style.height = "auto";
        style.maxHeight = `${maxHeight}px`;
      }
      return style;
    },
  },
  methods: {
    /**
     * 1.先绘制一行元素，通过这个元素计算出一个固定高度，再拿高度计算出startIndex endIndex
     * 2.再绘制可视区的所有元素
     */
    loadData(datas) {
      this.scrollYStore.startIndex = 0;
      this.scrollYStore.endIndex = 1;
      this.scrollYStore.visibleSize = 0; // 可视区内可以展示多少个元素
      this.fullData = datas || [];
      this.scrollYLoad = this.sYOpts.gt > -1 && this.fullData.length > this.sYOpts.gt;
      this.handleData();
      return this.computeScrollLoad().then(() => {
        this.refreshScroll();
      });
    },
    handleData() {
      this.items = this.scrollYLoad
        ? this.fullData.slice(this.scrollYStore.startIndex, this.scrollYStore.endIndex)
        : this.fullData.slice(0);
      return this.$nextTick();
    },
    computeScrollLoad() {
      return this.$nextTick().then(() => {
        if (this.scrollYLoad) {
          const firstItemElem = this.$refs.body.children[0];
          const rHeight = firstItemElem.offsetHeight;
          this.scrollYStore.visibleSize = Math.ceil(
            this.$refs.virtualWrapper.clientHeight / rHeight
          );
          this.scrollYStore.rowHeight = rHeight;
          this.scrollYStore.endIndex = Math.max(
            this.scrollYStore.startIndex,
            this.scrollYStore.visibleSize,
            this.scrollYStore.endIndex
          );
          this.updateYData();
        } else {
          this.updateYSpace();
        }
      });
    },
    refreshScroll() {
      const { lastScrollLeft, lastScrollTop } = this;
      this.clearScroll();
      return this.$nextTick().then(() => {
        if (lastScrollLeft || lastScrollTop) {
          this.lastScrollLeft = 0;
          this.lastScrollTop = 0;
          return this.scrollTo(lastScrollLeft, lastScrollTop);
        }
      });
    },
    clearScroll() {
      const scrollBodyElem = this.$refs.virtualWrapper;
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0;
      }
      // return this.$nextTick()
    },
    scrollTo(scrollLeft, scrollTop) {
      const scrollBodyElem = this.$refs.virtualWrapper;
      scrollBodyElem.scrollLeft = scrollLeft;
      scrollBodyElem.scrollTop = scrollTop;
      if (this.scrollYLoad) {
        return new Promise((resolve) => setTimeout(() => resolve(this.$nextTick()), 50));
      }
      return this.$nextTick();
    },
    scrollEvent(evnt) {
      const scrollBodyElem = evnt.target;
      const { scrollTop } = scrollBodyElem;
      const { scrollLeft } = scrollBodyElem;
      const isX = scrollLeft !== this.lastScrollLeft;
      const isY = scrollTop !== this.lastScrollTop;
      this.lastScrollTop = scrollTop;
      this.lastScrollLeft = scrollLeft;
      if (this.scrollYLoad) {
        this.loadYData(evnt);
      }
      this.$emit("scroll", {
        scrollLeft,
        scrollTop,
        isX,
        isY,
        $event: evnt,
      });
    },
    loadYData(evnt) {
      const { scrollYStore } = this;
      const { startIndex, endIndex, visibleSize, offsetSize, rowHeight } = scrollYStore;
      const scrollBodyElem = evnt.target;
      const { scrollTop } = scrollBodyElem;
      const toVisibleIndex = Math.floor(scrollTop / rowHeight);
      const offsetStartIndex = Math.max(0, toVisibleIndex - 1 - offsetSize);
      const offsetEndIndex = toVisibleIndex + visibleSize + offsetSize;
      if (toVisibleIndex <= startIndex || toVisibleIndex >= endIndex - visibleSize - 1) {
        if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
          scrollYStore.startIndex = offsetStartIndex;
          scrollYStore.endIndex = offsetEndIndex;
          this.updateYData();
        }
      }
    },
    updateYData() {
      this.handleData();
      this.updateYSpace();
    },
    updateYSpace() {
      const { scrollYStore, scrollYLoad, fullData } = this;
      this.bodyHeight = scrollYLoad ? fullData.length * scrollYStore.rowHeight : 0;
      this.topSpaceHeight = scrollYLoad
        ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0)
        : 0;
    },
  },
};
</script>

<style scoped lang="scss">
.vxe-list {
  position: relative;
  display: block;
  padding: 0;
  direction: ltr;
  .vxe-list--virtual-wrapper {
    position: relative;
    overflow: auto;
  }
  .vxe-list--y-space {
    width: 0;
    float: left;
  }
  .vxe-list--virtual-wrapper,
  .vxe-list--body {
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
  }
}

.vxe-list--virtual-wrapper {
  height: 100px;
}
</style>
