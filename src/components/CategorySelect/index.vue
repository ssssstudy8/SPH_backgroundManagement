<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :module="cForm">
      <el-form-item label="一级分类">
        <el-select
          :disabled="isShow"
          placeholder="请选择"
          @change="handler1"
          v-model="cForm.category1Id"
        >
          <el-option
            :label="item1.name"
            :value="item1.id"
            v-for="(item1, index) in list1"
            :key="item1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="isShow"
          placeholder="请选择"
          @change="handler2"
          v-model="cForm.category2Id"
        >
          <el-option
            :label="item2.name"
            :value="item2.id"
            v-for="(item2, index) in list2"
            :key="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="isShow"
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
        >
          <el-option
            :label="item3.name"
            :value="item3.id"
            v-for="(item3, index) in list3"
            :key="item3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //请求一级分类数据
    this.getCategory1List();
  },
  methods: {
    //请求一级分类数据
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      } else {
        return Promise.reject(new Error("file"));
      }
    },
    async handler1() {
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category1Id,
        level: 1,
      });
      let result = await this.$API.attr.reqCategory2List(
        this.cForm.category1Id
      );
      if (result.code == 200) {
        this.list2 = result.data;
      } else {
        return Promise.reject(new Error("file"));
      }
    },
    async handler2() {
      this.list3 = [];
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category2Id,
        level: 2,
      });
      let result = await this.$API.attr.reqCategory3List(
        this.cForm.category2Id
      );
      if (result.code == 200) {
        this.list3 = result.data;
      } else {
        return Promise.reject(new Error("file"));
      }
    },
    handler3() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category3Id,
        level: 3,
      });
    },
  },
  props: ["isShow"],
};
</script>

<style>
</style>