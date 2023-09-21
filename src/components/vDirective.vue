<template>
  <div>
    <input type="text" value="jksgsh" v-focus />
    <div v-title="masg">{{ masg }}</div>
  </div>
</template>

<script>
export default {
  /**
   * 1.bind unbind  只调用一次，指令第一次绑定到元素时调用/指令与元素解绑时调用
   * 2.inserted 被绑定元素插入父节点时调用
   * 3.update 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有
   * 4.componentUpdated 指令所在组件的 VNode 及其子 VNode 全部更新后调用
   */
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
    title: {
      bind(el, binding, vnode) {
        el.title = binding.value;
      },
      componentUpdated(el, binding) {
        el.title = binding.value;
      },
    },
  },
  data() {
    return {
      masg: "测试title1",
    };
  },
  created() {
    setTimeout(() => {
      this.masg = "测试title2";
    }, 4000);
  },
};
</script>
