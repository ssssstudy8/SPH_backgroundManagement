<template>
  <div>
    <el-form ref="from" label-width="80px" :module="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="(trademark, index) in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          rows="5"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttract.length}未选择`"
          v-model="attr"
        >
          <el-option
            :label="attr.name"
            :value="`${attr.id}:${attr.name}`"
            v-for="(attr, index) in unSelectSaleAttract"
            :key="attr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attr"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table border style="margin-top: 15px" :data="spu.spuSaleAttrList">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            label="属性名"
            prop="saleAttrName"
            width="120px"
          ></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                @click="spu.spuSaleAttrList.splice($index, 1)"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqAddOrUpdateSpu } from "@/api/product/spu";
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类id
        category3Id: 0,
        //描述
        description: "",
        //spu图片
        spuImageList: [
          /* {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          }, */
        ],
        //spu名称
        spuName: "",
        //平台属性和属性值
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0,
              },
            ],
          }, */
        ],
        //品牌id
        tmId: 0,
      },
      trademarkList: [], //存储品牌信息
      spuImageList: [], //spu图片信息
      saleAttrList: [], //销售属性列表
      attr: "", //收集未选择的销售属性的id
    };
  },
  methods: {
    //照片墙删除某一个图片时
    handleRemove(file, fileList) {
      //file 代表删除的照片
      //fileList 照片墙剩余的图片
      // console.log(file, fileList);
      this.spuImageList = fileList;
    },
    //照片墙预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spu数据
    async initSpuData(spu) {
      //获取Spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取图片信息
      let spuImageListResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageListResult.code == 200) {
        let listArr = spuImageListResult.data;
        listArr.forEach((item) => {
          //element照片墙需要name和url属性
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handlerSuccess(response, file, fileList) {
      /*  
      response  服务器返回的信息
      file  上传成功的图片
      fileList 上传成功的所以图片
      */
      this.spuImageList = fileList;
    },
    //添加属性
    addSaleAttr() {
      //baseSaleAttrId   id
      //saleAttrName     name
      const [baseSaleAttrId, saleAttrName] = this.attr.split(":");
      const newSpuSaleAttrList = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSpuSaleAttrList);
    },
    //添加属性值
    addSaleAttrValue(row) {
      //控制button和input的属性
      this.$set(row, "inputVisible", true);
      //增加响应式数据inputValue
      this.$set(row, "inputValue", "");
    },
    //input失焦
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message("属性不能为空");
        return;
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      //没有重复是true
      if (!result) return;

      let newSpuSaleAttrValueList = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSpuSaleAttrValueList);
      row.inputVisible = false;
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数  对于图片 需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
      }
      //返回scene = 0
      this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'})
      //清除数据
      Object.assign(this._data,this.$options.data())
    },
    //点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      //添加SPU的时候收集三级分类的id
      this.spu.category3Id = category3Id;
      //获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮的回调
    cancel(){
      this.$emit('changeScene',{scene:0,flag:''})
      //清除数据
      //组件实例this._data,可以操作data当中的响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data,this.$options.data())
    }
  },
  computed: {
    //计算出还未选择的
    unSelectSaleAttract() {
      //平台的属性一共三个：尺寸、颜色、版本
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>