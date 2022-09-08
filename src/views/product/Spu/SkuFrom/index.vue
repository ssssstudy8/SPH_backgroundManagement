<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input
          placeholder="价格（元）"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input
          placeholder="重量（千克）"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          rows="5"
          placeholder="描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="from" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfo"
            :key="attr.id"
            style="margin: 10px"
          >
            <el-select
              placeholder="请选择"
              v-model="attr.attrIdAndValueId"
              value="value"
            >
              <el-option
                :label="item.valueName"
                :value="`${attr.id}:${item.id}`"
                v-for="(item, index) in attr.attrValueList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="from" label-width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="(sale, index) in saleAttrList"
            :key="sale.id"
          >
            <el-select placeholder="请选择" v-model="sale.attrIdAndValueId">
              <el-option
                :label="saleItem.saleAttrValueName"
                :value="`${sale.id}:${saleItem.id}`"
                v-for="(saleItem, index) in sale.spuSaleAttrValueList"
                :key="saleItem.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="spuImageList">
          <el-table-column
            type="selection"
            prop="prop"
            width="80"
            @selection-change="handleSelectionChange(params)"
          ></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row, spuImageList)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuFrom",
  data() {
    return {
      //图片的数据
      spuImageList: [],
      //销售属性数据
      saleAttrList: [],
      //平台属性
      attrInfo: [],
      skuInfo: {
        //父组件传的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //数据双向绑定
        price: 0,
        skuName: "",
        skuDesc: "",
        weight: "",
        //第三类
        //平台属性
        skuAttrValueList: [
          /*   {
            attrId: 0,
            valueId: 0,
          }, */
        ],
        //默认图片
        skuDefaultImg: "",
        //收集图片字段
        skuImageList: [
          /* {
            id: 0,
            imgName: "",
            imgUrl: "",
            isDefault: "",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      //收集图片数据字段
      imageList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, row) {
      //收集父组件的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      //获取图片的数据
      let imageResult = await this.$API.spu.reqSpuImage(row.id);
      if (imageResult.code == 200) {
        let list = imageResult.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }

      //获取销售属性数据
      let saleResult = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }

      // 获取平台属性
      let attrInfoResult = await this.$API.spu.reqAttrInfo(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (attrInfoResult.code == 200) {
        this.attrInfo = attrInfoResult.data;
      }
    },
    //单选框
    handleSelectionChange(params) {
      this.imageList = params;
    },
    //排他操作
    changeDefault(row, spuImageList) {
      spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消的回调
    cancel() {
      //父组件切换场景为0
      this.$emit("changeScenes", 0);
    },
    //保存的回调
    async save() {
      //整理参数 平台属性
      const { attrInfo, skuInfo, saleAttrList, imageList } = this;
      let arr = [];
      attrInfo.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          let obj = { valueId, attrId };
          arr.push(obj);
        }
      });
      skuInfo.skuAttrValueList = arr;

      //销售属性
      this.skuInfo.skuSaleAttrValueList = saleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':');
           prev.push({saleAttrId,saleAttrValueId});
        }
        return prev;
      }, []);

      //图片数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imageName: item.imageName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      let result  = await this.$API.spu.reqAddSku(skuInfo);
     if(result.code==200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit('changeScenes',0);
     }
    }
  },
};
</script>

<style>
</style>