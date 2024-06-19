<template>
  <div class="tag" :style="`color:${tagObj[tagValue].tc}`">
    <span :style="`padding:6px 6px;border-radius:12px;background:${tagObj[tagValue].bc}`">
      {{ tagObj[tagValue].label }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    tagValue: { type: [Number, String], default: "0" },
  },
  data() {
    return {
      tagObj: {
        0: { label: "审批中", bc: "#CBE5FF", tc: "#0E50D2" },
        1: { label: "已撤回", bc: "#EBEBEB", tc: "#4D4D4D" },
        2: { label: "已通过", bc: "#C5F4CD", tc: "#139D41" },
        3: { label: "被退回", bc: "#FFE9CE", tc: "#D2611B" },
        4: { label: "待上传请假单", bc: "#cdf1ff", tc: "#1380D2" },
      },
    };
  },
};
</script>

<style scoped lang="scss">
.tag {
  font-size: 12px;
}
</style>
