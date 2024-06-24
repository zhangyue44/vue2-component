<template>
  <div
    class="common-anchor"
    :class="{ 'is-folder': folded }"
    :style="{ top: `${top}px`, right: `${right}px` }"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <i v-show="folded" class="h-anchor-icon h-icon-ctrl_anchor" />
    <div
      v-show="!folded"
      class="anchor-content"
      :style="{ height: contentHeight ? `${contentHeight}px` : 'unset' }"
    >
      <div v-for="item in list" :key="item.href">
        <commonAnchorItem
          :href="item.href"
          :title="item.title"
          :current-id="currentId"
          @itemClick="itemClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import commonAnchorItem from "./commonAnchorItem.vue";
import { throttle } from "lodash";

export default {
  components: { commonAnchorItem },
  props: {
    container: { type: String, default: "" },
    top: { type: String, default: "20" },
    right: { type: String, default: "20" },
    contentHeight: { type: String, default: "" },
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      folded: true,
      currentId: null,
      isMouseEnter: false,
      timer: null,
    };
  },
  beforeDestroy() {
    this.clearTime();
    if (this.containerNode) {
      this.containerNode.removeEventListener("scroll", this.handleScroll);
      this.containerNode = null;
    }
  },
  mounted() {
    this.currentId = this.list[0].href;
    this.containerNode = document.querySelector(".cross-container-c");
    if (this.containerNode) {
      this.containerNode.addEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    handleMouseenter(e) {
      this.clearTime();
      this.folded = false;
      this.isMouseEnter = true;
    },
    handleMouseleave() {
      this.folded = true;
      this.isMouseEnter = false;
    },
    itemClick(id) {
      if (this.currentId === id) return;
      this.currentId = id;
      const node = document.querySelector(id);
      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    handleScroll: throttle(function (e) {
      if (this.isMouseEnter) return;
      this.folded = false;
      this.clearTime();
      this.timer = setTimeout(() => {
        this.folded = true;
        this.timer = null;
      }, 800);
      const { scrollTop } = e.target;
      let node;
      for (let i = 1; i < this.list.length; i++) {
        node = document.querySelector(this.list[i].href);
        if (scrollTop === node.offsetTop) {
          this.currentId = this.list[i].href;
          break;
        } else if (scrollTop < node.offsetTop) {
          this.currentId = this.list[i - 1].href;
          break;
        }
      }
    }, 200),
    clearTime() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.common-anchor {
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  &.is-folder {
    width: 36px;
    height: 36px;
    background: #fff;
    border-radius: 2px;
    cursor: pointer;
    float: right;
    text-align: center;
  }
  .h-anchor-icon {
    font-size: 24px;
    line-height: 36px;
    pointer-events: none;
  }
  .anchor-content {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px 0px;
  }
}
</style>
