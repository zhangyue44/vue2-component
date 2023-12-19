<template>
  <div>
    <div class="custom--tree--item">
      <el-input
        v-model.trim="localValue"
        :class="{ 'ip-error': showError }"
        @blur="valueChange"
      ></el-input>
      <span v-if="showError" class="ip-config-error">请对比提示调整规则！</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, default: "" },
    msg: { type: String, default: "" },
  },
  data() {
    return {
      showError: false,
    };
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    valueChange() {
      if (!this.localValue) {
        this.showError = false;
        return;
      }
      const reg = /^[1-9]\d*((、\d+)*|((-\d+){0,1}))$/.test(this.localValue);
      if (!reg) {
        this.showError = true;
        return;
      }
      if (this.localValue.includes("-")) {
        const arr = this.localValue.split("-");
        if (
          arr[0] &&
          arr[1] &&
          Number(arr[0]) < Number(arr[1]) &&
          this.commonUtil(arr[0]) &&
          this.commonUtil(arr[1])
        ) {
          this.showError = false;
        } else {
          this.showError = true;
        }
      } else if (this.localValue.includes("、")) {
        const arr = this.localValue.split("、");
        this.showError = arr.some(
          (v) => Number(v) < (this.msg === "asegment" ? 1 : 0) || Number(v) > 255
        );
      } else {
        this.showError = !this.commonUtil(this.localValue);
      }
    },
    commonUtil(val) {
      return Number(val) >= (this.msg === "asegment" ? 1 : 0) && Number(val) <= 255;
    },
  },
};
</script>

<style scoped lang="scss">
.custom--tree--item {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px;
  .ip-config-error {
    font-size: 12px;
    color: red;
  }
  .ip-error ::v-deep {
    input {
      border-color: #fa3239;
    }
  }
}
</style>
