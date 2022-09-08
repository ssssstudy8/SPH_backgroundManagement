<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "charts",
  mounted() {
    let barCharts = echarts.init(this.$refs.charts);

    //写入你想要执行的代码
    barCharts.setOption({
      xAxis: {
        data: [
          410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290, 330, 150,
        ],
      },
      yAxis: {
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false, //不显示坐标轴上的文字
        },
      },
      series: [
        {
          name: "销量",
          type: "bar",
          data: [
            410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290, 330, 150,
          ],
        },
      ],
      //布局
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