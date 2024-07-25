<template>
  <div v-loading="loading" class="chart-common">
    <div class="header">
      <span>异常时段</span>
      <el-select v-model="selectHour" style="width: 120px" @change="handleChange">
        <el-option
          v-for="item in hourList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div ref="chart" class="chart-common-chart" />
    <div style="height: 20px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { debounce } from "lodash";

export default {
  props: {
    activeTab: { type: Object, default: () => ({}) },
    time: { type: Date, default: "" },
    resType: { type: String, default: "" },
    indexCode: { type: String, default: "" },
    activeName: { type: String, default: "cross" },
    currentSelectIndexCode: { type: String, default: "" },
    type: { type: String, default: "" },
    hour: { type: String, default: "" },
  },
  data() {
    return {
      loading: false,
      selectHour: "-2",
      oldSelectHour: "-2",
      hourList: [
        { label: "不限", value: "-1" },
        { label: "0时", value: "0" },
        { label: "1时", value: "1" },
        { label: "2时", value: "2" },
        { label: "3时", value: "3" },
        { label: "4时", value: "4" },
        { label: "5时", value: "5" },
        { label: "6时", value: "6" },
        { label: "7时", value: "7" },
        { label: "8时", value: "8" },
        { label: "9时", value: "9" },
        { label: "10时", value: "10" },
        { label: "11时", value: "11" },
        { label: "12时", value: "12" },
        { label: "13时", value: "13" },
        { label: "14时", value: "14" },
        { label: "15时", value: "15" },
        { label: "16时", value: "16" },
        { label: "17时", value: "17" },
        { label: "18时", value: "18" },
        { label: "19时", value: "19" },
        { label: "20时", value: "20" },
        { label: "21时", value: "21" },
        { label: "22时", value: "22" },
        { label: "23时", value: "23" },
      ],
      options: {
        color: [
          "rgb(203, 229, 255)",
          "rgb(69,153,233)",
          "rgb(244,182,63)",
          "rgb(131,45,164)",
          "rgb(59,135,123)",
          "rgb(226,93,51)",
          "rgb(60,73,165)",
          "rgb(255,73,165)",
          "rgb(69,153,233)",
        ],
        grid: {
          left: "0%",
          right: "0%",
          bottom: "0",
          top: "20%",
          containLabel: true,
        },
        legend: {
          show: false,
          right: "3%",
          top: "3%",
          icon: "roundRect",
          itemWidth: 14,
          itemHeight: 14,
        },
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: [
            "0时",
            "1时",
            "2时",
            "3时",
            "4时",
            "5时",
            "6时",
            "7时",
            "8时",
            "9时",
            "10时",
            "11时",
            "12时",
            "13时",
            "14时",
            "15时",
            "16时",
            "17时",
            "18时",
            "19时",
            "20时",
            "21时",
            "22时",
            "23时",
          ],
          axisLine: {
            lineStyle: {
              color: "#dedede",
              width: 1,
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            color: "#888888",
          },
        },
        yAxis: [
          {
            type: "value",
            show: false,
            name: "",
            splitNumber: 5,
            nameTextStyle: {
              color: "rgba(0,0,0,0.65)",
              fontSize: 18,
              align: "left",
              verticalAlign: "center",
            },
            axisLabel: {
              color: "rgba(0,0,0,0.65)",
              textStyle: {
                fontSize: 14,
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(223, 223, 223, 1)",
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top",
            },
            data: [],
          },
        ],
      },
    };
  },
  beforeDestroy() {
    if (this.lineChart) {
      this.lineChart.off("click");
      this.lineChart.dispose();
    }
    window.removeEventListener("resize", this.updateChart);
  },
  mounted() {
    this.lineChart = echarts.init(this.$refs.chart);
    this.oldSelectHour = this.hour;
    this.selectHour = this.hour;
    this.lineChart.on(
      "click",
      debounce((params) => {
        const str = String(params.name).split("时")[0];
        this.selectHour = this.selectHour === str ? "-1" : str;
      }, 300)
    );
    window.addEventListener("resize", this.updateChart);
  },
  methods: {
    updateChart() {
      this.lineChart && this.lineChart.resize();
    },
    handleChange(val) {
      if (this.oldSelectHour !== val) {
        this.$emit("updateParent", val);
      }
      this.oldSelectHour = val;
      this.updateColor();
    },
    updateOption() {
      const quest = this.type.startsWith("tim")
        ? this.$api.vehicleAlarmCapturedata
        : this.type.startsWith("face")
        ? this.$api.getFaceIndicatorData
        : this.type.startsWith("body")
        ? this.$api.getBodyIndicatorData
        : this.$api.vehicleCapturedata;
      quest({
        data: {
          indicatorCode: this.activeTab.id,
          beginDate: this.$moment(this.time).format("YYYY-MM-DD"),
          endDate: this.$moment(this.time).format("YYYY-MM-DD"),
          timeLevel: "2", // 1 日期 2 小时
          resIndexCode: this.activeName === "cross" ? this.indexCode : this.currentSelectIndexCode,
          currentHour: 24,
          resourceType: this.activeName === "cross" ? this.resType : this.activeName,
        },
      })
        .then(({ data }) => {
          this.currentData = data || [];
          this.updateColor();
        })
        .catch((_) => {
          this.currentData = [];
          this.options.series[0].data = [];
          this.lineChart && this.lineChart.setOption(this.options, true);
        });
    },
    updateColor() {
      if (!this.currentData?.length) return;
      this.options.series[0].data = this.currentData.map((v) => {
        v.value = Number(v.failedNum);
        v.itemStyle = {
          color: this.selectHour == v.mergeDate.split("时")[0] ? "#a90000" : "rgb(203, 229, 255)",
        };
        return v;
      });
      this.lineChart && this.lineChart.setOption(this.options, true);
    },
    updateDate(val) {
      this.currentData = [];
      if (val !== this.selectHour) {
        this.oldSelectHour = val;
        this.selectHour = val;
      }
      this.updateOption();
    },
  },
};
</script>

<style scoped lang="scss">
.chart-common {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .header {
    height: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    column-gap: 12px;
    font-size: 14px;
  }
  &-chart {
    flex: 1;
    width: 100%;
  }
}
</style>
