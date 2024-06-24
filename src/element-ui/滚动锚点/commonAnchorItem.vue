<template>
  <div class="common-anchor-item" :class="{ active: currentId === href }" @click="itemClick">
    <div class="title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    href: { type: String, default: "" },
    title: { type: String, default: "" },
    currentId: { type: String, default: "" },
  },
  methods: {
    itemClick() {
      this.$emit("itemClick", this.href);
    },
  },
};
</script>

<style scoped lang="scss">
.common-anchor-item {
  position: relative;
  min-width: 180px;
  line-height: 32px;
  padding-left: 32px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  &.active {
    font-weight: 700;
    &::after {
      background-color: #176cff;
      width: 12px;
      height: 12px;
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 18px;
    width: 2px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.06);
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 19px;
    z-index: 2;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e0e0e0;
    transform: translate(-50%, -50%);
  }
  .title {
    cursor: pointer;
  }
}
</style>
