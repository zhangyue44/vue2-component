<script>
export default {
  methods: {
    // 1.在一个form表单中，若只有一个input，按回车键表单会自动提交，但是当表单中存在多个input时，按回车键不会执行任何操作，这是form表单的一个特性
    // <el-form :model="form" ref="formRef" @submit.native.prevent>...</el-form>
  },
};
</script>
