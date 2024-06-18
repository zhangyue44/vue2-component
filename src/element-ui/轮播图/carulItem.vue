<template>
  <div
    class="w-full h-full flex-shrink-0 item"
    :style="itemStyle"
    :class="{ active: active, animating: animating }"
  >
    <img :src="imgSrc" alt="" class="w-full h-full" />
  </div>
</template>

<script>
import img1 from "@/element-ui/轮播图/img/1.jpg";
import img2 from "@/element-ui/轮播图/img/2.jpg";
import img3 from "@/element-ui/轮播图/img/3.jpg";
import img4 from "@/element-ui/轮播图/img/4.jpg";
import img5 from "@/element-ui/轮播图/img/5.jpg";
import img6 from "@/element-ui/轮播图/img/6.jpg";

export default {
  props: {
    item: { type: [Number, String], default: "" },
  },
  data() {
    return {
      active: false,
      animating: false,
      translate: 0,
      imgSrc: null,
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
    };
  },
  destroyed() {
    this.$parent && this.$parent.updateItems();
  },
  created() {
    this.imgSrc = this[`img${this.item}`];
    this.$parent && this.$parent.updateItems();
  },
  computed: {
    itemStyle() {
      const value = `translateX(${this.translate}px)`;
      const style = {
        transform: value,
      };
      return style;
    },
  },
  methods: {
    processIndex(index, activeIndex, length) {
      if (activeIndex === 0 && index === length - 1) {
        return -1;
      }
      if (activeIndex === length - 1 && index === 0) {
        return length;
      }
      if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1;
      }
      if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2;
      }
      return index;
    },
    calcTranslate(index, activeIndex) {
      const distance = this.$el.offsetWidth;
      return distance * (index - activeIndex);
    },
    translateItem(index, activeIndex, oldIndex) {
      this.animating = index === activeIndex || index === oldIndex;
      const len = this.$parent.items.length;
      if (index !== activeIndex && len > 2) {
        index = this.processIndex(index, activeIndex, len);
      }
      this.active = index === activeIndex;
      this.translate = this.calcTranslate(index, activeIndex);
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  &.active {
    z-index: 100;
  }
  &.animating {
    transition: transform 0.4s ease-in-out;
  }
}
</style>
