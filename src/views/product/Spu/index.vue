<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="scene != 0"
      ></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addSpu"
          >+添加SPU</el-button
        >
        <el-table border :data="records">
          <el-table-column
            label="序号"
            type="index"
            width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="spu名称"
            prop="spuName"
            width="200px"
          ></el-table-column>
          <el-table-column label="spu描述" prop="description"></el-table-column>
          <el-table-column label="spu操作" width="250px">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加Spu"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改Spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-warning"
                size="mini"
                title="查看当前类的所有实例"
              ></hint-button>
              <el-popconfirm title="确定删除吗" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除Spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          class="pagination"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 8]"
          :pager-count="7"
          layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="handleChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
      <!-- 添加SPU|修改SPU -->
      <SpuFrom
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuFrom>

      <!-- 添加SKU -->
      <SkuFrom v-show="scene == 2"></SkuFrom>
    </el-card>
  </div>
</template>

<script>
import SpuFrom from "./SpuFrom/index.vue";
import SkuFrom from "./SkuFrom/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 5,
      records: [],
      total: 0,
      scene: 2, // 0代表展示Spu列表数据  1添加SPU|修改SPU  2添加SKU
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //spu列表数据
    async getSpuList() {
      //携带三个参数：page第几页，limit每一页需要展示多少条数据，三级分类id
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSupList(page, limit, category3Id);
      // console.log(result)
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //分页器
    handleChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //当分页的某一页展示数据条数发生变化
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //修改某一个Spu
    updateSpu(row) {
      this.scene = 1;
      //获取子组件skuFrom
      this.$refs.spu.initSpuData(row);
    },
    //自定义回调
    changeScene(scene, flag) {
      this.scene = 0;
      if (flag == "修改") {
        this.getSpuList(this.page);
      }
      this.getSpuList();
    },
    //点击添加Spu按钮时，发的请求
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //删除spu
    async deleteSpu(row) {
      // row.imId
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
  },
  components: { SpuFrom, SkuFrom },
};
</script>

<style>
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
