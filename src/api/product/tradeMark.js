//品牌管理的数据
import request from '@/utils/request'

//获取品牌列表接口 GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

//添加或修改品牌信息
//更新品牌信息 url: /admin/product/baseTrademark/update PUT 带品牌名字，logo，id
//新增品牌信息 url: /admin/product/baseTrademark/save  POST 带品牌名字，logo
/* {
  "id": 0,
  "logoUrl": "string",
  "tmName": "string"
} */
export const addOrUpdateTradeMark = (tradeMark) =>{
  if(tradeMark.id){
    return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
  }else{
    return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
  }
}

//删除品牌 url: /admin/product/baseTrademark/remove/{id}  DELETE
export const reqDeleteTradeMark = (id) =>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})