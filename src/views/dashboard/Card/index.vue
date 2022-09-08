<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-card style="margin: 0 5px">
          <Detail title="总销售额" :count=stateInfo.salesTotal>
            <template slot="charts">
              <span>
                周同比&nbsp;56.67%
                <i class="el-icon-caret-top"></i>&nbsp;日同比&nbsp;19.16%
                <i class="el-icon-caret-bottom"></i>
              </span>
            </template>
            <template slot="footer">
              <span>日销量额￥{{stateInfo.salesToday}}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="margin: 0 5px">
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="margin: 0 5px">
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarChart></BarChart>
            </template>
            <template slot="footer">
              <span>转化率65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="margin: 0 5px">
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressBar></ProgressBar>
            </template>
            <template slot="footer">
              <span>
                周同比&nbsp;12%
                <i class="el-icon-caret-top"></i>&nbsp;日同比&nbsp;11%
                <i class="el-icon-caret-bottom"></i>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail/index.vue";
import LineChart from "./lineChart/index.vue";
import BarChart from "./BarChart/index.vue";
import ProgressBar from "./ProgressBar/index.vue";
import { mapState } from 'vuex';
export default {
  name: "Card",
  components: { Detail, LineChart, BarChart, ProgressBar },
  computed:{
    ...mapState({
      stateInfo:(state)=>state.home.list
    })
  }
};
</script>

<style>
</style>