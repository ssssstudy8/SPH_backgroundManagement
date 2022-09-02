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
