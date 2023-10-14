<template>
  <div>event bus page</div>
</template>

<script>
import { EventBus } from "@/EventBus.js";

export default {
  created() {
    EventBus.$on("test", this.eventCallback);
  },
  mounted() {
    EventBus.$emit("test", "aas", "sdsd");
  },
  beforeDestroy() {
    // EventBus.$off() // 移除项目内所有事件监听
    // EventBus.$off('test'); // 移除项目内所有对此事件的监听
    EventBus.$off("test", this.eventCallback); // 移除此页面对此事件的监听
  },
  methods: {
    eventCallback(params1, params2) {
      console.log("hahha", params1, params2);
    },
  },
};
</script>
