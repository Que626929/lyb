//将四个模块请求的接口函数统一暴露
import * as tradeMark from '@/api/product/tradeMark';
import * as spu from '@/api/product/spu';
import * as sku from '@/api/product/sku';
import * as attr from '@/api/product/attr';

//对外暴露
export default{
    tradeMark,
    spu,
    sku,
    attr
}