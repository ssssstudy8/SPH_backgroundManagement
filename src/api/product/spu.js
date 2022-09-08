import request from '@/utils/request'

//获取SPU列表数据的接口  GET /admin/product/{page}/{limit}   page limit
export const reqSupList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:"get",params:{category3Id}})

//获取品牌信息  GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () =>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'}) 

//GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = ()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})

//获取Spu信息  GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

//spu图标接口  GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//修改的接口  POST /admin/product/updateSpuInfo
//保存的接口  POST /admin/product/saveSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) =>{
  //携带的参数带有id 修改spu
  if(spuInfo.id){
    return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
  }else{
    //携带的参数带有id 保存spu
    return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
  }
}

//删除Spu  DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) =>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

//获取图片的数据 GET /admin/product/spuImageList/{spuId}
export const reqSpuImage = (spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//获取销售属性数据  GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) =>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

//获取平台属性 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfo = (category1Id,category2Id,category3Id) =>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加sku  POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})


//展示sku列表数据  GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})

