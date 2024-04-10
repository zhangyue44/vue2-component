<template>
  <div @scroll="sumaryScroll" ref="sumaryref">内容</div>
</template>

<script>
import { throttle } from "lodash";

export default {
  data() {
    return {
      disableScroll: false,
      heightList: [0, 0, 0, 0],
    };
  },
  methods: {
    sumaryScroll(index) {
      this.disableScroll = true;
      // 回到顶部
      if (index === -1) {
        this.$refs.sumaryref.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        this.canScroll();
        return;
      }
      const node = document.getElementById(`sumaryScroll${index}`);
      if (!node) {
        this.canScroll();
        return;
      }
      this.$refs.sumaryref.scrollTo({
        top: node.offsetTop - 60,
        behavior: "smooth",
      });
      this.canScroll();
    },
    canScroll() {
      setTimeout(() => {
        this.disableScroll = false;
      }, 1000);
    },
    // 滚动节流
    handleScroll: throttle(function (e) {
      if (this.disableScroll) return;
      const scrollTop = e.target.scrollTop + 60;
      for (const i in this.heightList) {
        if (scrollTop < this.heightList[i] && Number(i) === 0) {
          this.$refs.topbtnref.updateIndex(-1);
          return;
        }
        if (scrollTop >= this.heightList[i] && scrollTop < this.heightList[Number(i) + 1]) {
          this.$refs.topbtnref.updateIndex(i);
          return;
        }
      }
    }, 200),
  },
};
</script>
