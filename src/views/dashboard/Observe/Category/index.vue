<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>销售额类别占比</span>
        <el-radio-group size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="echarts" ref="echarts"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {};
  },
  mounted() {
    let myCharts = echarts.init(this.$refs.echarts);
    myCharts.setOption({
      title: {
        text: "搜索引擎",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            normal: {
              // 各分区的提示内容
              // params: 即下面传入的data数组,通过自定义函数，展示你想要的内容和格式
              formatter: function (params) {
                return params.name;
              },
              textStyle: {
                // 提示文字的样式
                // color: '#595959',
                fontSize: 12,
              },
            },
          },
          labelLine: {
            normal: {
              length: 15, // 指示线宽度
            },
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "直接访问" },
            { value: 300, name: "搜索引擎" },
          ],
        },
      ],
    });
    //绑定事件
    myCharts.on("mouseover",(params)=>{
      //获取鼠标移上去那条数据
      const {name,value} = params.data
      myCharts.setOption({
        title:{
          text:name,
          subtext:value
        }
      })
    })
  },
};
</script>

<style scoped>
.el-radio-group {
  float: right;
}
.clearfix {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
.echarts {
  width: 100%;
  height: 337px;
}
</style>