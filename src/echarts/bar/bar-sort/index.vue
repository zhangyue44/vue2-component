<template>
  <div class="bar-chart-content" />
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    startTime: { type: Date },
    treeCode: { type: String, default: "" },
    resOrgId: { type: String, default: "" },
    tabIndex: { type: String, default: "" },
    menuType: { type: String, default: "" },
    indicatorCode: { type: String, default: "" },
    pageType: { type: String, default: "" },
    crossType: { type: String, default: "" },
    sort: { type: String, default: "" },
    unit: { type: String, default: "" },
  },
  data() {
    return {
      barChart: null,
      options: {
        color: ["rgb(75, 147, 255)"],
        grid: {
          left: "2%",
          right: "0%",
          bottom: "0%",
          top: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: (params) => {
            let res = `<div style="display:flex;justify-content:space-between">
                <span>${params[0].name}</span>
              </div>`;
            for (let i = 0; i < params.length; i++) {
              res += `<div style="margin-top:8px;display:flex;justify-content:space-between;">
                <span>${params[i].marker}</span>
                <span style="font-weight:bold;">${params[i].data.value || "0"}${
                this.unit === "num" ? "" : "%"
              }</span>
              </div>`;
            }
            return res;
          },
        },
        legend: {
          show: false,
        },
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: [],
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                opacity: 0.4,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: {
          type: "bar",
          barWidth: "50%",
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
          },
          data: [],
        },
      },
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateChart);
  },
  mounted() {
    this.barChart = echarts.init(this.$el);
    window.addEventListener("resize", this.updateChart);
  },
  methods: {
    updateChart() {
      this.barChart && this.barChart.resize();
    },
    getVeCapture() {
      const startDate = this.$moment(this.startTime).format("YYYY-MM-DD");
      this.$api
        .captureTopTen({
          data: {
            resOrgId: this.resOrgId,
            treeCode: this.treeCode,
            mergeDate: startDate,
            startDate,
            endDate: startDate,
            tabIndex: this.tabIndex,
            resType: this.menuType.startsWith("face")
              ? "face"
              : this.menuType.startsWith("vehicle")
              ? "vehicle"
              : "vehicleAlarm",
            indicatorCode: this.indicatorCode,
            pageType: this.pageType,
            crossType: this.crossType === "all" ? "" : this.crossType,
          },
        })
        .then(({ data }) => {
          const arr = data || [];
          if (this.sort === "up") {
            arr.sort((a, b) => Number(b.regionCount || 0) - Number(a.regionCount || 0));
          } else {
            arr.sort((a, b) => Number(a.regionCount || 0) - Number(b.regionCount || 0));
          }
          this.options.yAxis[0].axisLabel.formatter = this.unit === "num" ? "{value}" : "{value}%";
          this.options.series.label.formatter = this.unit === "num" ? "{c}" : "{c}%";
          this.options.xAxis.data = arr.map((v) => v.regionName);
          this.options.series.data = arr.map((v) => {
            v.value = v.regionCount ? Number(v.regionCount) : 0;
            return v;
          });
          this.barChart.setOption(this.options, true);
        })
        .catch((_) => {
          this.options.xAxis.data = [];
          this.options.series.data = [];
          this.barChart.setOption(this.options, true);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.bar-chart-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
