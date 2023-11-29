<!-- 网上看到的一篇博客的实现方式 -->

<template>
  <div
    ref="list"
    class="list-container relative h-full overflow-auto"
    @scroll="scrollEvent($event)"
  >
    <div ref="phantom" class="absolute left-0 top-0 right-0 -z-1" />
    <div ref="content" class="absolute left-0 right-0 top-0 text-center">
      <div v-for="item in visibleData" ref="items" :key="item.id" :id="item.id" class="item">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: { type: Array, default: () => [] }, // 所有列表数据
    estimatedItemSize: { type: Number }, // 预估高度
  },
  data() {
    return {
      screenHeight: 0,
      start: 0,
      end: 0,
    };
  },
  computed: {
    // 可显示的列表项数
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize);
    },
    // 获取真实显示列表数据
    visibleData() {
      return this.listData.slice(this.start, Math.min(this.end, this.listData.length));
    },
  },
  mounted() {
    this.initPositions();
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  updated() {
    this.$nextTick(() => {
      if (!this.$refs.items || !this.$refs.items.length) return;
      this.updateItemsSize();
      const height = this.positions[this.positions.length - 1].bottom;
      this.$refs.phantom.style.height = `${height}px`;
      this.setStartOffset();
    });
  },
  methods: {
    initPositions() {
      this.positions = this.listData.map((item, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize,
      }));
    },
    scrollEvent() {
      const { scrollTop } = this.$refs.list;
      this.start = this.getStartIndex(scrollTop);
      this.end = this.start + this.visibleCount;
      this.setStartOffset();
    },
    getStartIndex(scrollTop = 0) {
      return this.binarySearch(this.positions, scrollTop); // 二分查找
    },
    binarySearch(list, value) {
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;
      while (start <= end) {
        const midIndex = parseInt((start + end) / 2);
        const midValue = list[midIndex].bottom;
        if (midValue === value) {
          return midIndex + 1;
        }
        if (midValue < value) {
          start = midIndex + 1;
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex;
          }
          end -= 1;
        }
      }
      return tempIndex;
    },
    // 获取列表项的当前尺寸
    updateItemsSize() {
      const nodes = this.$refs.items;
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const { height } = rect;
        const index = +node.id;
        const oldHeight = this.positions[index].height;
        const dValue = oldHeight - height;
        if (dValue) {
          this.positions[index].bottom -= dValue;
          this.positions[index].height = height;
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom -= dValue;
          }
        }
      });
    },
    // 获取当前的偏移量
    setStartOffset() {
      const startOffset = this.start >= 1 ? this.positions[this.start - 1].bottom : 0;
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`;
    },
  },
};
</script>

<style scoped lang="scss">
.list-container {
  -webkit-overflow-scrolling: touch;
  .item {
    padding: 10px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #999;
  }
}
</style>
