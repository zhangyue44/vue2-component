<template>
  <div>
    <div>{{ state.count || "sdssd" }}</div>
    <div>{{ aaa }}</div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  data() {
    return {
      aaa: "xxxxxxxxx",
    };
  },
  created() {
    this.state = Vue.observable({ count: 0 }); // Vue.observable 让一个对象可响应
    setTimeout(() => {
      this.state.count = 9;
    }, 4000);
  },
};
</script>
