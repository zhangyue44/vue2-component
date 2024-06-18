<template>
  <div class="w-full h-full">
    <div class="w-[200px] h-[200px] overflow-hidden flex flex-nowrap relative">
      <carulItem item="1"></carulItem>
      <carulItem item="2"></carulItem>
      <carulItem item="3"></carulItem>
      <carulItem item="4"></carulItem>
      <carulItem item="5"></carulItem>
      <carulItem item="6"></carulItem>
    </div>
    <button @click="arrowClick(activeIndex - 1)">上一个</button>
    <button @click="arrowClick(activeIndex + 1)">下一个</button>
  </div>
</template>

<script>
import { throttle } from "lodash";
import carulItem from "./carulItem.vue";

export default {
  components: { carulItem },
  data() {
    return {
      items: [],
      initialIndex: 0,
      activeIndex: -1,
      timer: null,
    };
  },
  watch: {
    items(val) {
      if (val.length) {
        this.setActiveItem(this.initialIndex);
      }
    },
    activeIndex(val, oldVal) {
      this.resetItemPosition(oldVal);
    },
  },
  mounted() {
    this.updateItems();
  },
  methods: {
    updateItems() {
      this.items = this.$children;
    },
    resetTimer() {
      this.pauseTimer();
      this.startTimer();
    },
    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    startTimer() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.activeIndex < this.items.length - 1) {
            this.activeIndex++;
          } else {
            this.activeIndex = 0;
          }
        }, 3000);
      }
    },
    setActiveItem(index) {
      index = Number(index);
      const len = this.items.length;
      if (index < 0) {
        this.activeIndex = len - 1;
      } else if (index >= len) {
        this.activeIndex = 0;
      } else {
        this.activeIndex = index;
      }
      this.resetTimer();
    },
    resetItemPosition(oldIndex) {
      this.items.forEach((item, index) => {
        item.translateItem(index, this.activeIndex, oldIndex);
      });
    },
    /* eslint-disable comma-dangle */
    // trailing: false 节流结束后不会再调用一次函数 默认值为 true
    arrowClick: throttle(
      function (index) {
        this.setActiveItem(index);
      },
      400,
      { trailing: false }
    ),
  },
};
</script>

<style scoped lang="scss"></style>
