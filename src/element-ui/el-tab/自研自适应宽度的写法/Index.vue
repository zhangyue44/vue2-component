<template>
  <div class="header-tab" id="erd-tab">
    <div class="header-contant" :style="`transform:translateX(-${curIndex * itemWidth}px)`">
      <div v-for="(item, index) in tabList" :key="item.id" class="header-tab-item">
        <!-- totalTab中高度可以写死 -->
        <totalTab
          :info="item"
          :parentIndex="index"
          :class="{ hasborder: index && index !== tabList.length - 1 }"
        />
      </div>
    </div>
    <div v-if="tabList.length > 4 && curIndex + 4 < tabList.length" class="right" @click="toRight">
      {{ ">" }}
    </div>
    <div v-if="curIndex !== 0" class="left" @click="toLeft">{{ "<" }}</div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import { debounce } from "lodash";
import totalTab from "./totalTab.vue";

export default {
  components: { totalTab },
  props: {},
  data() {
    return {
      curIndex: 0, // 最左侧的索引值
      itemWidth: 0,
      tabList: [
        { id: "1", name: "xxxxxxxxxx", total: 0, resourceTotal: 10000, online: "85%" },
        { id: "2", name: "xxxxxxxxxx", total: 0, resourceTotal: 10000, online: "85%" },
        { id: "3", name: "xxxxxxxxxx", total: 0, resourceTotal: 10000, online: "85%" },
        { id: "4", name: "xxxxxxxxxx", total: 0, resourceTotal: 10000, online: "85%" },
        { id: "5", name: "xxxxxxxxxx", total: 0, resourceTotal: 10000, online: "85%" },
      ],
    };
  },
  destroyed() {
    const node = document.getElementById("erd-tab");
    if (this.erd && node) {
      this.erd.uninstall(node);
    }
    this.erd = null;
  },
  mounted() {
    this.erd = elementResizeDetectorMaker();
    const that = this;
    this.erd.listenTo(document.getElementById("erd-tab"), (ele) => {
      const arr = document.getElementsByClassName("header-tab-item");
      if (!arr) return;
      const node = arr[0];
      if (node) {
        that.itemWidth = node.clientWidth;
      }
    });
  },
  methods: {
    toRight: debounce(function () {
      this.curIndex = Math.min(this.curIndex + 4, this.tabList.length - 4);
    }, 200),
    toLeft: debounce(function () {
      this.curIndex = Math.max(0, this.curIndex - 4);
    }, 200),
  },
};
</script>

<style scoped lang="scss">
.header-tab {
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  margin: 16px 12px;
  overflow: hidden;
  .header-contant {
    display: flex;
    flex-wrap: nowrap;
    transition: all 0.2s;
  }
  &-item {
    width: 25%;
    flex-shrink: 0;
  }
}
.hasborder {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.right,
.left {
  position: absolute;
  top: 50%;
  right: 4px;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  user-select: none;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.left {
  left: 2px;
}
</style>
