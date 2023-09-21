<template>
  <div>
    <input
      type="checkbox"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
    />复选框
  </div>
</template>

<script>
export default {
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    checked: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped></style>
