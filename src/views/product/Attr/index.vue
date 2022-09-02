<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect @getCategoryId="getCategoryId" :isShow="!isShow"></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          style="margin-bottom: 15px"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表单 -->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="address" label="属性列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin-left: 5px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShow">
        <el-form
          :inline="true"
          ref="form"
          style="width: 300px"
          :model="attrInfo"
        >
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >+添加属性值</el-button
        >
        <el-button type="info" @click="isShow = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="100"
            :data="attrInfo.attrList"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="medium"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
                >{{ row }}</el-input
              >
              <span v-else="!row.flag" @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="medium"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button type="info" @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import CategorySelect from "@/components/CategorySelect";
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  components: { CategorySelect },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      //控制表格是否隐藏
      isShow: true,
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性名中的属性值，可以位多个
          /*  {
            attrId: 0, //属性id
            valueName: "",
          }, */
        ],
        categoryId: 0,
        categoryLevel: 3, //三级id
      },
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
        this.getAttrList();
      }
    },
    //获取平台属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      } else {
        return Promise.reject(new Error("file"));
      }
    },
    //增加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        //向属性值得数组里面添加元素
        //attrId 是相应得属性id
        //valueName 相应属性值得名称
        attrId: this.attrInfo.id, //添加操作时，id为undefined 修改操作时添加id
        valueName: "",
        flag: true, //用户编辑模式和查看模式得切换
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性
    addAttr() {
      //隐藏table
      this.isShow = false;
      //清除数据，收集三级分类id
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3, //三级id
      };
    },
    //修改属性
    updateAttr(row) {
      this.isShow = false;
      //由于结构中存在对像里面套数组，数组里面有对象，因此需要使用深拷贝解决问题
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        //因为vue无法探测普通的新增property,这样书写属性并非响应式属性
        this.$set(item, "flag", false);
      });
    },
    //编辑到查看页面
    toLook(row) {
      //判断属性值是否为空
      //trim 去除字符串的头尾空格
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常得属性值");
        return;
      }
      //新增的属性值不能与前面重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // .some返回一个布尔值
        // 比较重复的属性值时，需要把row去掉,row表示最新添加的属性值
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });

      if (isRepeat) {
        alert("属性值不能重复");
        return;
      }

      row.flag = false;
    },
    //查看到编辑
    toEdit(row, index) {
      row.flag = true;
      //获取节点，实现自动聚焦
      //点击span的时候，切换成input，浏览器（回流重绘）需要时间，所以不能立马获取到input
      this.$nextTick(() => {
        //确保input已经存在
        this.$refs[index].focus();
      });
    },
    //删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index,1)
    },
    //保存按钮
    async addOrUpdateAttr(){
      //整理参数  属性值为空不能提交  不用提交flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item =>{
        //过滤掉不是空的
        if(item.valueName != ''){
          //删除flag字段
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShow = true
        //提示成功
        this.$message({type:'success',message:'保存成功'})
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    }
  },
};
</script>

<style>
</style>
