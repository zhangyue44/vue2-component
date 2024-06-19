<!-- <mobileTime label="开始时间" v-model="formData.startTime" />
<mobileTime
  label="结束时间"
  v-model="formData.endTime"
  timeType="end"
  :startTime="formData.startTime"
  :leaveDuring.sync="formData.leaveDuring"
/> -->

<template>
  <div>
    <van-field
      v-model="localValue"
      required
      readonly
      is-link
      input-align="right"
      :name="label"
      :label="label"
      placeholder="请选择"
      @click="handleFieldClick"
    />
    <van-popup v-model="showPicker" position="bottom" round :style="{ height: '50%' }">
      <van-tabs v-model="activeTab" @click="onClick">
        <van-tab :title="currentTime" name="1" />
        <van-tab :title="currentDay" name="2" />
      </van-tabs>
      <van-calendar
        v-show="activeTab === '1'"
        :poppable="false"
        :show-title="false"
        :show-confirm="false"
        :min-date="minDate"
        :max-date="maxDate"
        :default-date="defaultDate"
        @confirm="handleTimeConfirm"
      />
      <div class="day-time" v-show="activeTab === '2'">
        <div
          class="day-time-item"
          :class="{ active: currentDay === '上午' }"
          @click="dayClick('上午')"
        >
          上午
        </div>
        <div
          class="day-time-item"
          :class="{ active: currentDay === '下午' }"
          @click="dayClick('下午')"
        >
          下午
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [Number, String], default: "" },
    label: { type: String, default: "" },
    timeType: { type: String, default: "start" }, // start end
    startTime: { type: String, default: "" },
    leaveDuring: { type: [Number, String], default: 0 },
  },
  data() {
    return {
      showPicker: false,
      activeTab: "1", // 1 2
      defaultDate: new Date(),
      currentTime: "", // 选中的日期
      currentDay: "上午",
      minDate: null,
      maxDate: null,
      startDay: null, // 开始时间的上下午
    };
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {},
    },
  },
  watch: {
    showPicker(val) {
      if (!val) {
        this.activeTab = "1";
      }
    },
    startTime(val) {
      if (val) {
        const arr = val.split(" ");
        this.minDate = new Date(arr[0]);
        this.startCurrentTime = arr[0];
        this.startDay = arr[1];
        if (this.minDate.getTime() > new Date(this.currentTime).getTime()) {
          this.defaultDate = this.minDate;
          this.currentTime = this.startCurrentTime;
          this.currentDay = "上午";
          this.$emit("input", "");
          this.$emit("update:leaveDuring", 0);
        }
      }
    },
  },
  created() {
    const nowDat = new Date();
    const y = nowDat.getFullYear();
    const m = nowDat.getMonth();
    this.minDate = new Date(y, m - 1, 1);
    this.maxDate = new Date(y + 1, m - 1, 1);
    this.currentTime = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    handleFieldClick() {
      if (this.timeType === "end" && !this.startTime) {
        this.$toast("请先选择开始时间");
        return;
      }
      this.showPicker = true;
    },
    handleTimeConfirm(val) {
      this.currentTime = this.$moment(val).format("YYYY-MM-DD");
      this.currentDay = "上午";
      this.activeTab = "2";
    },
    onClick(val) {},
    dayClick(val) {
      if (
        this.timeType === "end" &&
        this.startCurrentTime === this.currentTime &&
        this.startDay === "下午" &&
        val === "上午"
      ) {
        this.$toast("结束时间不能早与开始时间");
        return;
      }
      this.currentDay = val;
      this.$emit("input", `${this.currentTime} ${this.currentDay}`);
      if (this.timeType === "end") {
        let day = Math.max(
          1,
          (new Date(this.currentTime).getTime() - new Date(this.startCurrentTime).getTime()) /
            1000 /
            60 /
            60 /
            24
        );
        if (this.startDay === "下午") day -= 0.5;
        if (this.currentDay === "上午") day -= 0.5;
        this.$emit("update:leaveDuring", day);
      }
      this.showPicker = false;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .van-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}
::v-deep .van-tabs {
  height: 44px !important;
}
::v-deep .van-tab {
  flex: 0 1 auto;
  margin-left: 6px;
}
::v-deep .van-calendar {
  height: calc(100% - 44px) !important;
}
.day-time {
  height: calc(100% - 44px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  row-gap: 16px;
  &-item {
    position: relative;
    padding: 16px 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.06);
    border: 1px solid transparent;
    &.active {
      border-color: red;
      background-color: rgba(255, 0, 0, 0.06);
      color: red;
      &::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 2;
        display: block;
        width: 0px;
        height: 0px;
        border: 12px solid transparent;
        border-right-color: red;
        border-bottom-color: red;
      }
      &::before {
        content: "✔";
        position: absolute;
        right: 1px;
        bottom: -1px;
        z-index: 3;
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
</style>
