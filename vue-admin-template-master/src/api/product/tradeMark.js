import request from '@/utils/request';

//获取品牌列表接口
//GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList=(page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'});

//处理添加品牌
//新增品牌：/admin/product/baseTrademark/save post 携带两个参数：品牌名称、品牌logo
//修改品牌：/admin/product/baseTrademark/update put 携带三个参数：品牌ID、品牌名称、品牌logo
export const reqAddOrUpdateTradeMark=tradeMark=>{
    //带给服务器数据携带ID---修改
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',data:tradeMark,method:'put'});
    }else{
        //新增品牌
        return request({url:'/admin/product/baseTrademark/save',data:tradeMark,method:'post'});
    }
}

//删除品牌信息 /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteTradeMark=id=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});