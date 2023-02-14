//当前这个模块api进行统一管理
import requests from "./ajax";
import mockRequests from "./mockAjax";
//三级联动接口
///api/product/getBaseCategoryList   get   无参数
//发请求：axios发送请求返回结果Promise对象
export const reqCategoryList = () =>
  requests({ url: "/product/getBaseCategoryList", method: "get" });
//获取banner的数据
export const reqGetBannerList = () =>
  mockRequests({ url: "/banner", method: "get" });
//获取floor组件的数据
export const reqGetFloorList = () => mockRequests.get("/floor");
//获取搜索模块的数据 地址：/api/list 请求方式：post 参数：需要带参数
//当前这个函数需不需要接受外部传递的参数
//当前这个接口，给服务器传递参数params,至少是一个空对象
export const reqGetSearchInfo = (params) =>
  requests({ url: "/list", method: "post", data: params });

//获取产品详情信息
export const reqGetDetail=(skuId)=>requests({url:`/item/${skuId}`,method:"get"});
//加入购物车
///api/cart/addToCart/{ skuId }/{ skuNum }
export const reqAddOrUpdateShopCart=(skuId,skuNum)=>requests({url:`/cart/addToCart/${skuId}/${skuNum}`,method:"post"});
//获取购物车列表的数据 /api/cart/cartList
export const reqGetShopCartList=()=>requests({url:'/cart/cartList',method:"get"});
//删除商品 /api/cart/deleteCart/{skuId}  delete
export const reqDeleteShopCarListById=(skuId)=>requests({url:`/cart/deleteCart/${skuId}`,method:"delete"});
//切换购物车商品选中状态 /api/cart/checkCart/{skuId}/{isChecked}  get
export const reqUpdateCheckedById=(skuId,isChecked)=>requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:"get"});
//获取验证码 /api/user/passport/sendCode/{phone} 
export const reqGetCode=phone=>requests({url:`/user/passport/sendCode/${phone} `,method:"get"});
//注册 /api/user/passport/register phone,password,code    post
export const reqUserRegister=data=>requests({url:'/user/passport/register',data,method:'post'});
//登录 /api/user/passport/login  phone,password post
export const reqUserLogin=data=>requests({url:'/user/passport/login',data,method:'post'});
//获取用户信息【需要带token】
export const reqGetUserInfo=()=>requests({url:'/user/passport/auth/getUserInfo',method:'get'});
//退出登录 /api/user/passport/logout get
export const reqLogout=()=>requests({url:'/user/passport/logout',method:'get'});
//获取用户地址信息 /api/user/userAddress/auth/findUserAddressList  get
export const reqUserAddress=()=>requests({url:'/user/userAddress/auth/findUserAddressList',method:'get'});
//获取订单交易页信息 /api/order/auth/trade  get
export const reqOrderInfo=()=>requests({url:'/order/auth/trade',method:'get'});
//提交订单 /api/order/auth/submitOrder?tradeNo={tradeNo}  post
export const reqSublicOrder=(tradeNo,data)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'});
//获取订单支付信息 /api/payment/weixin/createNative/{orderId}  get
export const reqOrderPayInfo=(orderId)=>requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'});
//查询支付订单状态 /api/payment/weixin/queryPayStatus/{orderId}  get
export const reqPayOrderStatus=(orderId)=>requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'});
//获取我的订单列表 /api/order/auth/{page}/{limit} get
export const reqMyOrderList=(page,limit)=>requests({url:`/order/auth/${page}/${limit}`,method:'get'});