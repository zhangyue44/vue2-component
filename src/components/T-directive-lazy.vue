<template>
  <div class="scroll-record h-full overflow-y-auto" @scroll="mainScroll">
    <div v-for="i in n" :key="i" class="h-52">
      <img v-yueLazy="url" alt="" class="h-full" />
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/EventBus.js";
import testPng from "@/assets/test.jpg";

export default {
  data() {
    return {
      n: 16,
      url: testPng,
    };
  },
  methods: {
    mainScroll() {
      EventBus.$emit("mainScroll");
    },
  },
};
</script>
