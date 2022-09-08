<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="sale"></el-tab-pane>
        <el-tab-pane label="配置管理" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">今周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          size="mini"
          class="data"
          v-model="data"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>

    <div>
      <el-row>
        <el-col :span="18">
          <div class="echarts" ref="echarts"></div>
        </el-col>

        <el-col :span="6">
          <span class="title">门店{{ title }}排名</span>
          <ul class="list" v-if="title == '销售额'">
            <li v-for="(orderRank, index) in orderRank" :key="orderRank.no">
              <span :class="orderRank.no < 4 ? 'top' : ''">{{ orderRank.no }}</span>
              <span class="brand">{{ orderRank.name }}</span>
              <span class="saleValue">{{ orderRank.money }}</span>
            </li>
          </ul>
          <ul class="list" v-else>
            <li v-for="(userRank, index) in userRank" :key="userRank.no">
              <span :class="userRank.no < 4 ? 'top' : ''">{{ userRank.no }}</span>
              <span class="brand">{{ userRank.name }}</span>
              <span class="saleValue">{{ userRank.money }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myCharts: null,
      data: [],
    };
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.echarts);
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 0,
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
      orderRank: (state) => state.home.list.orderRank,
      userRank: (state) => state.home.list.userRank,
    }),
  },
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
          },
        ],
      });
    },
    //监听listState
    listState() {
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listState.orderFullYear,
          },
        ],
      });
    },
  },
  methods: {
    //本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.data = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.data = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.data = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.data = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.box-card {
  margin: 15px 5px;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  font-size: 14px;
  margin: 0 5px;
}
.data {
  width: 220px;
  margin-left: 5px;
}
.echarts {
  width: 100%;
  height: 300px;
}
.title {
  margin-left: 10px;
  font-weight: 600;
  font-size: 18px;
}

.list li {
  list-style-type: none;
  margin: 20px 0;
  display: flex;
}
.top {
  float: left;
  width: 20px;
  height: 20px;
  background-color: black;
  color: aliceblue;
  border-radius: 50%;
  text-align: center;
}
.brand {
  position: absolute;
  left: 82%;
}
.saleValue {
  position: absolute;
  right: 10px;
}
</style>