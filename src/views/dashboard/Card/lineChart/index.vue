<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "lineChart",
  mounted() {
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          data: [610, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 530,220, 620,],
          smooth: true,
          symbol: "none",
          //线条颜色
          lineStyle: {
            color: "#ae63e4",
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#ae63e4" },
                { offset: 0.5, color: "#a26eea" },
                { offset: 1, color: "#ddd" },
              ]),
            },
          },
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>