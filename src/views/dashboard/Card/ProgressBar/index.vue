<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "ProgressBar",
  computed: {
    ...mapState({
      activityRate: (state) => state.home.list.activityRate,
    }),
  },
  mounted() {
    let ProgressBar = echarts.init(this.$refs.charts);
    ProgressBar.setOption({
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [70],
          itemStyle: {
            normal: {
              color: "#555555", // 定义柱形的背景色
              // barBorderRadius: [5, 5, 5, 5], // 定义背景柱形的圆角
            },
          },
          barWidth: 10, // 设置柱形宽度
          showBackground: true,
          backgroundStyle: {
            color: "#c4c9cc",
          },
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
        },
      ],
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