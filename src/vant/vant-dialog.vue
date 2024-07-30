<template>
  <van-dialog
    v-model="show"
    :title="dialogTitle"
    show-cancel-button
    :beforeClose="beforeClose"
    @confirm="confirm"
    @cancel="cancel"
  >
    <van-field
      v-model.trim="changeReason"
      required
      class="reason-field"
      type="textarea"
      rows="6"
      name="reason"
      :label="formLabel"
      placeholder="请输入"
    />
  </van-dialog>
</template>

<script>
export default {
  props: {
    visible: { type: Boolean, default: false },
    dialogTitle: { type: String, default: "修改" },
    formLabel: { type: String, default: "修改原因" },
    mode: { type: String, default: "" },
  },
  data() {
    return {
      changeReason: "",
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  watch: {
    show(val) {
      if (!val) {
        this.changeReason = "";
      }
    },
  },
  methods: {
    beforeClose(val, done) {
      if (val === "cancel") {
        done();
      } else if (val === "confirm") {
        if (this.changeReason) {
          done();
        } else {
          this.$toast(`请输入${this.formLabel}`);
          done(false);
        }
      }
    },
    confirm() {
      if (!this.changeReason) return;
      this.$emit("updateReason", this.changeReason, this.mode);
    },
    cancel() {
      this.$emit("updateLoading");
    },
  },
};
</script>

<style scoped lang="scss">
.reason-field {
  flex-direction: column;
  row-gap: 4px;
  ::v-deep .van-cell__value {
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 2px;
  }
}
</style>
