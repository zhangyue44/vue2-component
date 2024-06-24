<template>
  <div v-loading="loading" class="chart-common">
    <div ref="chart" class="chart-common-chart" />
    <div class="x-legend">
      <el-date-picker v-model="value1" type="date" placeholder="请选择日期" :clearable="false" />
      <el-button slot="reference" class="btn-add"
        ><span style="cursor: pointer">+ 新增对比</span></el-button
      >
      <div v-for="(item, index) in arrList" :key="item.time" class="item">
        <div class="line" :style="{ background: options.color[index] }"></div>
        <span>{{ item.label }}</span>
        <span v-if="item.close" class="close" @click="handleClose(item.time, false)">Χ</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    time: { type: String, default: "" },
    resType: { type: String, default: "" },
    indexCode: { type: String, default: "" },
    activeTab: { type: Object, default: () => ({}) },
    configData: { type: Object, default: () => ({}) },
    menuType: { type: String, default: "" },
    resize: { type: Boolean, default: true },
  },
  data() {
    return {
      loading: false,
      value1: new Date(),
      arrList: [],
      options: {
        color: [
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
          left: "80",
          right: "0%",
          containLabel: false,
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const { id } = this.activeTab;
            let res = `<div style="display:flex;justify-content:space-between;min-width:180px">
                <span>${this.activeTab.label}</span>
              </div>`;
            for (let i = 0; i < params.length; i++) {
              res += `<div style="margin-top:8px;display:flex;justify-content:space-between;">
                <span>${params[i].marker}${params[i].seriesName}</span>
                <span>${params[i].name}</span>
                <span style="font-weight:bold;">${params[i].data.value}${
                ["captureData"].includes(id) ? "" : "%"
              }</span>
              </div>`;
            }
            return res;
          },
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
            "24:00",
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
            name: "时段分析",
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
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [],
      },
    };
  },
  watch: {
    value1(val) {
      const time = this.$moment(val).format("YYYY-MM-DD");
      const node = this.arrList.find((it) => it.time === time);
      if (!node) {
        this.getVeCapture(time);
        this.handleClose(time, true);
      }
    },
    activeTab(val) {
      this.arrList = [
        {
          label: this.$moment(this.time).format("MM/DD"),
          time: this.time,
          close: false,
        },
      ];
      this.options.series = [];
      this.getVeCapture(this.time);
    },
  },
  beforeDestroy() {
    if (this.resize) {
      window.removeEventListener("resize", this.updateChart);
    }
  },
  mounted() {
    this.chartData = [];
    this.arrList = [
      {
        label: this.$moment(this.time).format("MM/DD"),
        time: this.time,
        close: false,
      },
    ];
    if (this.resize) {
      window.addEventListener("resize", this.updateChart);
    }
    this.getVeCapture(this.time);
    this.lineChart = echarts.init(this.$refs.chart);
  },
  methods: {
    updateChart() {
      this.lineChart && this.lineChart.resize();
    },
    getVeCapture(time) {
      this.loading = true;
      const quest = this.menuType.startsWith("tim")
        ? this.$api.vehicleAlarmCapturedata
        : this.menuType.startsWith("face")
        ? this.$api.getFaceIndicatorData
        : this.menuType.startsWith("body")
        ? this.$api.getBodyIndicatorData
        : this.$api.vehicleCapturedata;
      quest({
        data: {
          indicatorCode: this.activeTab.id,
          beginDate: time,
          endDate: time,
          resourceType: this.resType,
          resIndexCode: this.indexCode,
          timeLevel: "2", // 1 日期 2 小时
        },
      })
        .then(({ data }) => {
          this.loading = false;
          const node = this.arrList.find((it) => it.time === time);
          if (!node) {
            this.arrList.unshift({
              label: this.$moment(time).format("MM/DD"),
              time,
              close: true,
            });
          }
          this.chartData = data || [];
          const arr = [
            {
              name: time,
              type: "line",
              data: this.chartData.map((v) => {
                v.value = v[this.activeTab.show];
                return v;
              }),
              markLine:
                this.activeTab.yu === "no"
                  ? {}
                  : {
                      name: "阈值",
                      silent: true,
                      data: [
                        {
                          yAxis: this.configData[this.activeTab.yu],
                          label: {
                            formatter: "阈值{c}%",
                            color: "rgba(0, 0, 0, 0.5)",
                            fontSize: 12,
                            position: "insideStartTop",
                          },
                        },
                      ],
                      lineStyle: {
                        color: "#f5a6a8",
                      },
                      symbol: "none",
                    },
            },
          ];
          this.options.series.push(...arr);
          this.lineChart.setOption(this.options, true);
        })
        .catch((_) => {
          this.loading = false;
        });
    },
    updateCapture(info) {
      if (info.show) {
        this.getVeCapture(info.time);
      } else {
        const nodeIndex = this.arrList.findIndex((it) => it.time === info.time);
        if (nodeIndex !== -1) {
          this.arrList.splice(nodeIndex, 1);
          this.options.series = this.options.series.filter((it) => it.name !== info.time);
          this.lineChart.setOption(this.options, true);
        }
      }
    },
    handleClose(time, show) {
      this.updateCapture({ show: false, time });
      this.$emit("hourClose", time, show);
    },
  },
};
</script>

<style scoped lang="scss">
.chart-common {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-chart {
    width: 100%;
    height: 100%;
  }
  .x-legend {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 8px;
      .line {
        width: 8px;
        height: 2px;
      }
      .close {
        font-size: 14px;
        cursor: pointer;
        margin-left: 2px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.1);
        padding: 0 4px;
      }
    }
    .btn-add {
      margin-right: 12px;
      border-style: dashed;
      cursor: pointer;
      pointer-events: none;
    }
  }
}
::v-deep .el-date-editor {
  position: absolute;
  width: 100px;
  z-index: 1;
  opacity: 0;
  input {
    cursor: pointer;
  }
}
</style>
