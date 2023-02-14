import { reqGetDetail, reqAddOrUpdateShopCart } from "@/api";
//封装临时游客身份模块uuid-->成一个随机字符串（不能再变了）
import { getUUID } from "@/utils/uuid_token";
const state = {
  detailList: {},
  //游客临时身份
  uuid_token:getUUID()
};
const mutations = {
  DETAILLIST(state, detailList) {
    state.detailList = detailList;
  },
};
const actions = {
  //获取商品详情列表
  async detailList({ commit }, skuId) {
    let result = await reqGetDetail(skuId);
    if (result.code == 200) {
      commit("DETAILLIST", result.data);
    }
  },
  //加入购物车
  async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    let result = await reqAddOrUpdateShopCart(skuId, skuNum);
    if (result.code == 200) {
        //代表加入购物车成功
      return "ok";
    } else {
        //代表加入购物车失败
      return Promise.reject(new Error("faile"));
    }
  },
};
const getters = {
  //路径导航简化的数据
  categoryView(state) {
    //比如：state.goodInfo初始状态是空对象，空对象的categoryView的属性值是undefined
    //当前计算出的categoryView属性值至少是一个空对象，假的报错不会有了
    return state.detailList.categoryView || {};
  },
  //产品信息简化的数据
  skuInfo(state) {
    return state.detailList.skuInfo || {};
  },
  //产品售卖属性简化的数据
  spuSaleAttrList(state) {
    return state.detailList.spuSaleAttrList || [];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
