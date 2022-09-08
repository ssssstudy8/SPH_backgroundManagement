<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span><i class="el-icon-paperclip"></i>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
      <slot name="charts"> </slot>
    </div>
    <div class="card-footer"><slot name="footer"></slot></div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
     
    }
  },
  props:['title','count']
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: rgb(163, 163, 163);
  font-size: 14px;
}
.card-content {
  font-size: 23px;
  padding: 6px 0;
}
.card-charts {
  height: 50px;
  line-height: 50px;
  font-size: 12px;
}
.card-footer {
  font-size: 14px;
  border-top: 1px solid rgb(227, 227, 227);
  padding-top: 10px;
}
</style>