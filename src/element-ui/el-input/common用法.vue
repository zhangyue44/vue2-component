<template>
  <el-input
    v-model.trim="key"
    class="el-input--width"
    suffix-icon="h-icon-search"
    placeholder="搜索姓名或手机号 "
    clearable
    :on-icon-click="handleIconClick"
    @keyup.enter.native="handleIconClick"
    @clear="
      key = '';
      handleIconClick();
    "
  />
</template>
