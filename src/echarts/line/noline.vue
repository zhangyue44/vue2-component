<template>
  <div class="line"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    time: { type: Date },
    indexCode: { type: String, default: "" },
    menuType: { type: String, default: "" },
  },
  data() {
    return {
      options: {
        color: [
          "rgb(15, 98, 254)",
          "rgb(155, 15, 254)",
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
          containLabel: false,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          show: false,
        },
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: [
            "0:00",
            "1:00",
            "2:00",
            "3:00",
            "4:00",
            "5:00",
            "6:00",
            "7:00",
            "8:00",
            "9:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00",
          ],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "value",
            name: "",
            splitNumber: 5,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [],
      },
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateChart);
  },
  mounted() {
    this.lineChart = echarts.init(this.$el);
    window.addEventListener("resize", this.updateChart);
  },
  methods: {
    updateChart() {
      this.lineChart && this.lineChart.resize();
    },
    init() {
      this.options.series = [];
      const lastTime = new Date(this.time.getTime() - 1000 * 60 * 60 * 24 * 7);
      this.today = this.$moment(new Date()).format("YYYY-MM-DD");
      this.getVeCapture(this.time, "1");
      this.getVeCapture(lastTime, "2");
    },
    getVeCapture(time, index) {
      const timeDate = this.$moment(time).format("YYYY-MM-DD");
      const quest = this.menuType.startsWith("tim")
        ? this.$api.vehicleAlarmCapturedata
        : this.menuType.startsWith("face")
        ? this.$api.getFaceIndicatorData
        : this.menuType.startsWith("body")
        ? this.$api.getBodyIndicatorData
        : this.$api.vehicleCapturedata;
      quest({
        data: {
          indicatorCode: "captureData",
          beginDate: timeDate,
          endDate: timeDate,
          resourceType: "region",
          resIndexCode: this.indexCode,
          currentHour: timeDate === this.today ? new Date().getHours() : 24,
          timeLevel: "2", // 1 日期 2 小时
        },
      })
        .then(({ data }) => {
          const arr = [
            {
              name: `${this.$moment(time).format("YYYY-MM-DD")}`,
              type: "line",
              data: (data || []).map((v) => {
                v.value = v.totalNum;
                return v;
              }),
              showSymbol: false,
              areaStyle:
                index === "1"
                  ? {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "rgba(15, 98, 254, 0.4)",
                        },
                        {
                          offset: 1,
                          color: "rgba(15, 98, 254, 0)",
                        },
                      ]),
                    }
                  : {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "rgba(155, 15, 254, 0.4)",
                        },
                        {
                          offset: 1,
                          color: "rgba(155, 15, 254, 0)",
                        },
                      ]),
                    },
            },
          ];
          this.options.series.push(...arr);
          this.lineChart.setOption(this.options, true);
        })
        .catch((_) => {
          this.lineChart.setOption(this.options, true);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.line {
  width: 100%;
  height: 100%;
}
</style>
