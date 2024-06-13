<template>
  <div></div>
</template>

<script>
export default {
  props: {
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      lineChart: null,
      isSetOptions: false,
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
          left: "2%",
          right: "4%",
          bottom: "0%",
          top: "20%",
          containLabel: true, // 区域包含进 x y 轴标签
        },
        legend: {
          show: true,
          right: "2%",
        },
        tooltip: {
          trigger: "axis",
          formatter(params) {
            let result = `${params[0].name}<br />`;
            params.forEach((v) => {
              result +=
                `${v.marker} ${v.seriesName}<span style="font-weight:700;padding-left:20px">${v.value}%</span>` +
                `<br />`;
            });
            return result;
          },
        },
        xAxis: {
          boundaryGap: false, // 坐标轴两边留白策略
          type: "category",
          data: [],
          axisLabel: {
            formatter(value, index) {
              const arr = value.split("年");
              return `${arr[0]}年` + `\n${arr[1]}`; // 换行
            },
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
            axisLabel: {
              formatter: "{value} %",
            },
            splitLine: {
              show: true,
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
    list: {
      handler(val) {
        if (val?.length) this.init(val);
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateResize);
  },
  mounted() {
    this.lineChart = this.$echarts.init(this.$el);
    if (this.isSetOptions) {
      this.lineChart.setOption(this.options, true);
      this.isSetOptions = false;
    }
    window.addEventListener("resize", this.updateResize);
  },
  methods: {
    init(list) {
      this.options.xAxis.data = list[0].trendRateList.map((v) => v.date);
      this.options.series = list.map((v) => {
        v.name = v.regionName;
        v.type = "line";
        v.showSymbol = false; // 是否显示 symbol, 如果false则只有在tooltip hover的时候显示
        v.data = v.trendRateList.map((v) => {
          v.showRate = v.rate.slice(0, v.rate.length - 1);
          return v.showRate;
        });
        return v;
      });
      if (!this.lineChart) {
        this.isSetOptions = true;
      } else {
        this.lineChart.setOption(this.options, true);
      }
    },
    updateResize() {
      this.lineChart && this.lineChart.resize();
    },
  },
};
</script>
