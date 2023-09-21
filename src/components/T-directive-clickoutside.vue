<template>
  <div>
    <div v-yueClickoutside="hidden">clickoutside的使用</div>
  </div>
</template>

<script>
export default {
  methods: {
    hidden() {
      console.log("hidden");
    },
  },
};
</script>
