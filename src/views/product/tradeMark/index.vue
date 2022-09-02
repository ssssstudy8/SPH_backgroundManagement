<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" style="margin-bottom: 10px" @click="addTradeMark"
      >+添加</el-button
    >

    <!-- 表格
    prop对应列内容的字段名 -->
    <el-table border style="width: 100%" :data="list">
      <el-table-column
        type="index"
        label="序号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="medium"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="medium"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 
    分页器
    total总页数
    current-page当前页
    page-size每页展示的数据条数
    page-sizes每页展示数据条数的选择
    layout分页布局
    pager-count按钮数量
    -->

    <el-pagination
      class="pagination"
      :total="total"
      :current-page="7"
      :page-size="limit"
      :page-sizes="[2, 4, 6]"
      :pager-count="7"
      layout="prev,pager,next,jumper,->,sizes,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 添加修改的dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    var validateTmName = (rule, value, callback) => {
      //自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      //当前页展示的条数
      limit: 4,
      //代表分页器的第几页
      page: 1,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //dialog的标题
      dialogTitle: "",
      //是否展示dialog
      dialogFormVisible: false,
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      //验证规则
      rules: {
        //blur失焦  change改变
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌logo" }],
      },
    };
  },
  mounted() {
    //获取列表数据方法
    this.getPageList();
  },
  methods: {
    //品牌列表数据
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      // console.log(result)
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //分页
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加品牌信息
    addTradeMark() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加品牌信息";
      //将残留的内容置空
      this.tmForm = {
        logoUrl: "",
        tmName: "",
      };
    },
    //修改品牌信息
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.dialogTitle = "修改品牌信息";
      this.tmForm = { ...row };
    },
    //上传成功的回调
    handleAvatarSuccess(res, file) {
      //res上传成功之后返回前端数据
      //file上传成功之后服务器返给前端的图片的信息
      // console.log(res, file);
      //收集品牌图片数据
      this.tmForm.logoUrl = res.data;
    },
    //判断图片的规范
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark() {
      //当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          //发请求（添加品牌|修改品牌）
          let result = await this.$API.trademark.addOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息:添加品牌成功、修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            //添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            //如果添加品牌： 停留在第一页，修改品牌应该留在当前页面
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌信息
    deleteTradeMark(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户确认删除时发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          //再次发请求刷新数据列表
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
