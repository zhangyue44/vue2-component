<template>
  <div>
    <button @click="btnClick">点击</button>
    <div>{{ msg }}</div>
  </div>
</template>

<script>
export default {
  inject: ["provideValue", "msg"],
  watch: {
    msg(val) {
      console.log("val", val);
    },
  },
  methods: {
    btnClick() {
      this.provideValue();
    },
  },
};
</script>
