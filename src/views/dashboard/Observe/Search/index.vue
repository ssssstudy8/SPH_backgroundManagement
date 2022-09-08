<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="peopleNumberBox">
        <div class="peopleNumber">
          搜索用户数
          <i class="el-icon-warning-outline" style="margin-left: 5px"></i>
        </div>
        <span style="font-size: 25px; padding-right: 20px">12321</span>
        <span style="color: #6a737b">17.1</span
        ><i class="el-icon-caret-top"></i>
      </div>
      <!-- echarts图 -->
      <el-row>
        <el-col :span="12">
          <LineCharts ></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts ></LineCharts>
        </el-col>
      </el-row>
      <el-table
        border
        style="width: 100%; margin: 10px 0"
        size="mini"
        :data="searchWord"
        height="225px"
      >
        <el-table-column type="index" label="排名" width="60">
        </el-table-column>
        <el-table-column prop="word" label="搜索关键字"> </el-table-column>
        <el-table-column prop="count" label="用户数" sortable>
        </el-table-column>
        <el-table-column prop="count" label="周涨幅" sortable>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import LineCharts from "./LineCharts";
export default {
  name: "Search",
  data() {
    return {};
  },
  components: { LineCharts },
  computed: {
    ...mapState({
      searchWord: (state) => state.home.list.searchWord,
    }),
  
  },
};
</script>

<style scoped>
.el-dropdown {
  float: right;
}
.clearfix {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
.peopleNumberBox {
  position: relative;
  top: -25px;
}
.peopleNumber {
  color: #a8a9a9;
  font-size: 13px;
  padding-bottom: 8px;
}
</style>