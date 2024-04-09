<template>
  <h-drawer
    show-close
    :visible="visible"
    size="1000px"
    title="预约教室"
    :append-to-body="true"
    @close="cancel"
  >
    <div class="px-4 pt-2">已根据当前时间范围自动过滤掉不可用教室</div>
    <AppointRoom
      v-if="visible"
      ref="appoint"
      class="flex-1 overflow-y-auto"
      :start-time="startTime"
      :end-time="endTime"
      :all-selected-room="allSelectedRoom"
    />
    <div class="flex-shrink-0 px-4 py-2 bg-[#f5f5f5]">
      <el-button type="primary" @click="confirm">提交</el-button>
      <el-button @click="cancel">关闭</el-button>
    </div>
  </h-drawer>
</template>

<script>
import AppointRoom from "@/pages/classroom/appoint/AppointRoom.vue";

export default {
  components: { AppointRoom },
  props: {
    visible: { type: Boolean, default: false },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    allSelectedRoom: { type: Array, default: () => [] },
  },
  methods: {
    confirm() {
      const row = this.$refs.appoint ? this.$refs.appoint.curRoomRow : {};
      this.$emit("updateRow", row);
      this.cancel();
    },
    cancel() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-drawer__header {
  margin-bottom: 0px;
  padding: 12px 20px 12px 20px;
  color: black;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #f5f5f5;
}
::v-deep .el-drawer__body {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
