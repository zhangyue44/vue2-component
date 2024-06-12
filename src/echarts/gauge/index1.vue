```javascript
<template>
  <div class="pie">
    <div id="pieId"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    onlineRate: { type: [Number, String], default: 0 },
  },
  data() {
    return {
      options: {
        color: ["#1DB84C", "#dae6f0"],
        series: [
          {
            type: "gauge",
            radius: "90%",
            center: ["50%", "56%"],
            progress: {
              show: true,
              width: 8,
            },
            axisLine: {
              lineStyle: {
                width: 8,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              // 指针展示
              show: false,
            },
            anchor: {
              show: false,
            },
            title: {
              // 标题展示
              offsetCenter: [0, "-20%"],
            },
            detail: {
              // 数据展示
              valueAnimation: true,
              fontSize: 20,
              offsetCenter: [0, "28%"],
              formatter: "{value}%",
            },
            data: [
              // 数据
              {
                value: 70,
                name: "在线率",
              },
            ],
          },
        ],
      },
    };
  },
  watch: {
    onlineRate: {
      handler(val) {
        this.options.series[0].data[0].value = val;
        this.initChart();
      },
      immediate: true,
    },
  },
  mounted() {
    this.chart = echarts.init(document.getElementById("pieId"));
  },
  methods: {
    initChart() {
      if (!this.chart) {
        setTimeout(() => {
          this.initChart();
        }, 1000);
        return;
      }
      this.chart.setOption(this.options);
    },
  },
};
</script>

<style scoped lang="scss">
.pie {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  #pieId {
    width: 160px;
    height: 112px;
  }
}
</style>

```
