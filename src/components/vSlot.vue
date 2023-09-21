<template>
  <div>
    <li>
      <slot name="todo" :todo="todo"> '测试文本' </slot>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    todo: { type: Object, default: () => {} },
  },
};
</script>
