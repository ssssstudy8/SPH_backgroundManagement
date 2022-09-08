<template>
  <div>
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="150">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片" width="140" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(kg)" width="130">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="130">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="240">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-warning-outline"
            size="mini"
            @click="skuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      class="pagination"
      :total="total"
      :current-page="1"
      :page-size="limit"
      :page-sizes="[2, 4, 6]"
      :pager-count="7"
      layout="prev,pager,next,jumper,->,sizes,total"
      @size-change="handleSizeChange"
      @current-change="getSkuInfo"
    ></el-pagination>

    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :with-header="false" size="50%">
      <el-row style="padding-top: 50px">
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuData.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuData.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuData.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              style="margin: 5px"
              type="success"
              v-for="(attr, index) in skuData.skuAttrValueList"
              :key="attr.id"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item v-for="img in skuData.skuImageList" :key="img.id">
              <img :src="img.imgUrl" style="width:100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //当前第几页
      total: 0, //总数量
      limit: 4, //每页展示多少数据
      records: [], //存储SKU列表的数据
      skuData: {}, //展示抽屉的数据
      drawer: false, //是否展示抽屉
    };
  },
  mounted() {
    this.getSkuInfo();
  },
  methods: {
    //分页
    async getSkuInfo(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuInfo();
    },
    //上架 == 1
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    //下架 == 0
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    //编辑  显示正在开发
    edit() {
      this.$message({
        message: "正在开发中",
      });
    },
    //显示信息
    async skuInfo(row) {
      //显示抽屉
      this.drawer = true;
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuData = result.data;
      }
    },
    // 抽屉关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.pagination {
  text-align: center;
  margin-top: 20px;
}

/* 抽屉 */
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

>>>.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
