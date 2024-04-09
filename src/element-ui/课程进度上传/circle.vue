<template>
  <div class="flex items-center flex-shrink-0">
    <span class="mr-2">{{ calcPercent(percent) }}</span>
    <h-feedback-icon v-if="percent == 1" icon-name="h-icon-feedback_success_lg" class="text-lg" />
    <div v-else class="circle">
      <div
        class="circle-content"
        :style="`background:conic-gradient(rgb(141,141,141) 0deg, rgb(141,141,141) ${gradientDeg}deg, transparent ${gradientDeg}deg)`"
      ></div>
    </div>
  </div>
</template>

<script>
import { calcPercent } from "@/pages/student-workbench/recordDetail/util.js";

export default {
  props: {
    percent: { type: Number, default: 0.65 },
  },
  computed: {
    gradientDeg() {
      return (360 * this.percent).toFixed(0);
    },
  },
  methods: {
    calcPercent,
  },
};
</script>

<style scoped lang="scss">
.circle {
  overflow: hidden;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  .circle-content {
    width: 100%;
    height: 100%;
    // background: conic-gradient(rgb(141, 141, 141) 0deg, rgb(141, 141, 141) 250deg, transparent 250deg);
  }
}
</style>
