<template>
  <div v-loading="loading" class="chart-common">
    <div ref="chart" class="chart-common-chart" />
    <div class="x-class">
      <div v-for="(item, index) in arrList" :key="item.label" class="item">
        <span
          class="item-label"
          :class="{
            'border-l': index === 0 || item.week === '一',
            'border-r': index === arrList.length - 1 || item.week === '日',
            active: !!selectMap[item.time],
          }"
          @click="itemClick(item)"
        >
          {{ item.label }}
        </span>
        <span>{{ item.week }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { debounce } from "lodash";

export default {
  props: {
    beginTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
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
      weekMap: {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        0: "日",
      },
      arrList: [], // 日期列表
      selectMap: {}, // 选中的日期
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
          enterable: true, // 鼠标可以进入提示框
          hideDelay: 300,
          confine: true, // 将tooltip框限制在图表的区域内
          position(point, params, dom, rect, size) {
            return [point[0] - 20, point[1]];
          },
          formatter: (params) => {
            const val = String(params[0].data.mergeDate).split("-");
            const val1 = val[0];
            const val2 = val[1];
            const val3 = val[2];
            const { id, add } = this.activeTab;
            let res = `<div style="display:flex;justify-content:space-between;min-width:140px">
                <span>${["plate"].includes(id) ? params[0].name : params[0].seriesName}</span>
                ${
                  add
                    ? `<div style="color:#2080f7;cursor:pointer;" onclick="_chartClick(${val1}, ${val2}, ${val3})">+对比</div>`
                    : ""
                }
              </div>`;
            for (let i = 0; i < params.length; i++) {
              res += `<div style="margin-top:8px;display:flex;justify-content:space-between;">
                <span>${params[i].marker}${
                ["plate"].includes(id) ? params[i].seriesName : params[i].name
              }</span>
                <span style="font-weight:bold;">${params[i].data.value}${
                ["captureData"].includes(id) ? "" : "%"
              }</span>
              </div>`;
            }
            if (
              [
                "stable",
                "vqd",
                "bigPicture",
                "smallPicture",
                "picStandard",
                "picEffective",
                "timely",
                "clock",
                "dataComplete",
                "dataAccuracy",
                "dataUnique",
                "uploadOk",
                "reUploadOk",
              ].includes(id)
            ) {
              res += '<div style="height:1px;background:rgba(0,0,0,0.1);margin: 8px 0"></div>';
              res += `<div style="display:flex;justify-content:space-between;margin-bottom:6px">
                  <span style="color:rgba(0,0,0,0.5)">${this.activeTab.title1}</span>
                  <span style="font-weight:bold;">${params[0].data.totalNum}</span>
                </div>`;
              res += `<div style="display:flex;justify-content:space-between;">
                  <span style="color:rgba(0,0,0,0.5)">${this.activeTab.title2}</span>
                  <span style="font-weight:bold;color:#E6202A">${params[0].data.failedNum}</span>
                </div>`;
            }
            return res;
          },
        },
        legend: {
          right: "3%",
          top: "3%",
          icon: "roundRect",
          itemWidth: 14,
          itemHeight: 14,
        },
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: [],
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
            show: false,
            color: "#888888",
          },
        },
        yAxis: [
          {
            type: "value",
            name: "近30天趋势",
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
        series: [
          // {
          //   name: '抓拍量',
          //   type: 'line',
          //   data: [100,300,200,650,34,45,452, 3434],
          //   markLine: {
          //     name: '阈值',
          //     silent: true,
          //     data: [{
          //       yAxis: 660,
          //       label: {
          //         formatter:'阈值{c}个',
          //         color: 'rgba(0, 0, 0, 0.5)',
          //         fontSize: 12,
          //         position: 'insideStartTop'
          //       }
          //     }],
          //     lineStyle: {
          //       color: '#f5a6a8'
          //     },
          //     symbol: 'none'
          //   },
          // },
        ],
      },
    };
  },
  watch: {
    activeTab(val) {
      this.selectMap = {};
      this.$set(this.selectMap, this.endTime, true);
      this.getVeCapture();
    },
  },
  beforeDestroy() {
    window._chartClick = null;
    if (this.resize) {
      window.removeEventListener("resize", this.updateChart);
    }
  },
  mounted() {
    this.chartData = [];
    this.$set(this.selectMap, this.endTime, true);
    this.getVeCapture();
    window._chartClick = (value1, value2, value3) => {
      this.handleChartClick(value1, value2, value3);
    };
    if (this.resize) {
      window.addEventListener("resize", this.updateChart);
    }
    const nowTime = new Date();
    const year = nowTime.getFullYear();
    const day = nowTime.getDate() > 30 ? 30 : nowTime.getDate();
    const lastday = 30 - day <= 0 ? 0 : 30 - day;
    const a = new Date();
    a.setDate(0);
    const lasttime = a.getDate();
    const lastMonth = a.getMonth() + 1;
    const lastYear = a.getFullYear();
    let lastWeek = a.getDay();
    let curWeek = lastWeek;
    const lastArr = new Array(lastday).fill("").map((_, index) => {
      if (Number(index) !== 0) {
        lastWeek = lastWeek - 1 < 0 ? 6 : lastWeek - 1;
      }
      return {
        label: `${lastMonth}/${lasttime - index}`,
        week: this.weekMap[lastWeek],
        year: lastYear,
        time: `${lastYear}-${String(lastMonth).padStart(2, "0")}-${String(
          lasttime - index
        ).padStart(2, "0")}`,
      };
    });
    const curArr = new Array(day).fill("").map((_, index) => {
      curWeek = curWeek + 1 > 6 ? 0 : curWeek + 1;
      return {
        label: `${lastMonth + 1}/${index + 1}`,
        week: this.weekMap[curWeek],
        year,
        time: `${year}-${String(lastMonth + 1).padStart(2, "0")}-${String(index + 1).padStart(
          2,
          "0"
        )}`,
      };
    });
    this.arrList = [...lastArr.reverse(), ...curArr];
    this.options.xAxis.data = this.arrList.map((v) => {
      v.value = v.label;
      return v;
    });
    this.lineChart = echarts.init(this.$refs.chart);
  },
  methods: {
    updateChart() {
      this.lineChart && this.lineChart.resize();
    },
    getVeCapture() {
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
          beginDate: this.beginTime,
          endDate: this.endTime,
          resourceType: this.resType,
          resIndexCode: this.indexCode,
          timeLevel: "1", // 1 日期 2 小时
        },
      })
        .then(({ data }) => {
          this.loading = false;
          this.chartData = data || [];
          const arr = [
            {
              name: this.activeTab.label,
              type: "line",
              data: this.chartData.map((v) => {
                v.value = v[this.activeTab.show];
                return v;
              }),
              showSymbol: false,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(15, 98, 254, 0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(15, 98, 254, 0)",
                  },
                ]),
              },
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
          if (["plate"].includes(this.activeTab.id)) {
            arr.push({
              name: "白天车牌识别率",
              type: "line",
              data: this.chartData.map((v) => {
                v.value = v.dayRate;
                return v;
              }),
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(255, 174, 74, 0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(254, 163, 15, 0)",
                  },
                ]),
              },
            });
            arr.push({
              name: "夜晚车牌识别率",
              type: "line",
              data: this.chartData.map((v) => {
                v.value = v.nightRate;
                return v;
              }),
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(29, 184, 76, 0.2)",
                  },
                  {
                    offset: 1,
                    color: "rgba(29, 184, 76, 0)",
                  },
                ]),
              },
            });
          }
          this.options.series = arr;
          this.lineChart.setOption(this.options, true);
        })
        .catch((_) => {
          this.loading = false;
          this.chartData = [];
          this.options.series = [];
          this.lineChart.setOption(this.options, true);
        });
    },
    itemClick(item) {
      const { time } = item;
      if (item.time === this.endTime) {
        this.$message.warning("今日时段不可删除");
        return;
      }
      const value = this.handleClose(time);
      this.$emit("updateHourLine", {
        time,
        show: value,
      });
    },
    handleChartClick: debounce(function (value1, value2, value3) {
      const time = `${value1}-${String(value2).padStart(2, "0")}-${String(value3).padStart(
        2,
        "0"
      )}`;
      if (time === this.endTime) {
        this.$message.warning("今日时段不可删除");
        return;
      }
      const value = this.handleClose(time);
      this.$emit("updateHourLine", {
        time,
        show: value,
      });
    }, 200),
    handleClose(time) {
      const value = !this.selectMap[time];
      this.$set(this.selectMap, time, value);
      if (!value) delete this.selectMap[time];
      return value;
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
  .x-class {
    position: absolute;
    bottom: 16px;
    display: flex;
    flex-wrap: nowrap;
    font-size: 14px;
    width: 100%;
    padding-left: 78px;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
      row-gap: 4px;
      &-label {
        cursor: pointer;
        background: #f5f5f5;
        padding: 2px 0px;
        &.border-l {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        &.border-r {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        &.active {
          color: #fff;
          background: #176cff;
          border-radius: 12px;
        }
      }
    }
  }
}
</style>
