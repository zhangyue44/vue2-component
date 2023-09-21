<template>
  <div>
    <button @click="btnClick">点击</button>
  </div>
</template>

<script>
export default {
  inject: ["provideValue"],
  methods: {
    btnClick() {
      this.provideValue();
    },
  },
};
</script>
