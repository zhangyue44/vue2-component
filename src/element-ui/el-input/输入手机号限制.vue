<!-- 将非number数值变为空字符 -->
<template>
  <el-input
    ref="inp"
    v-model="verification"
    placeholder="请输入6位验证码"
    :minlength="6"
    :maxlength="6"
    onkeyup="value=value.replace(/[^\d]/g,'')"
  />
</template>

<script>
export default {
  methods: {
    num() {
      // 153 2863 3746
      return this.phoneNum.replace(/^(.{3})(.*)(.{4})$/, "$1 $2 $3");
    },
  },
};
</script>
