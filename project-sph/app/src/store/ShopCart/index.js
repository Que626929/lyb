import {
  reqGetShopCartList,
  reqDeleteShopCarListById,
  reqUpdateCheckedById,
} from "@/api";
const state = {
  cartList: [],
};
const mutations = {
  GETSHOPCARTLIST(state, cartList) {
    state.cartList = cartList;
  },
};
const actions = {
  //获取购物车列表
  async getShopCartList({ commit }) {
    let result = await reqGetShopCartList();
    if (result.code == 200) {
      commit("GETSHOPCARTLIST", result.data);
    }
  },
  //删除购物车商品
  async deleteShopCartById({ commit }, skuId) {
    let result = await reqDeleteShopCarListById(skuId);
    if (result.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  //修改购物车商品选中的状态
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCheckedById(skuId, isChecked);
    if (result.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  //删除所以选中商品
  deleteAllCheckedCart({ dispatch, getters }) {
    //context:小仓库，commit【提交mutations修改state】 getter、dispatch、state
    //获取购物车中全部的产品（是一个数组）
    let PromiseAll = [];
    getters.cartList.cartInfoList.forEach((item) => {
      let Promise =
        item.isChecked == 1 ? dispatch("deleteShopCartById", item.skuId) : "";
      //将每一个返回的Promise添加到数组中
      PromiseAll.push(Promise);
    });
    //只要全部的Promise都成功，返回结果即为成功
    //如果有一个失败，返回即为失败结果
    return Promise.all(PromiseAll);
  },
  //修改全部产品的状态
  updateAllCartIsChecked({ dispatch, state }, isChecked) {
    let PromiseAll = [];
    state.cartList[0].cartInfoList.forEach((item) => {
      let Promise = dispatch("updateCheckedById", {
        skuId: item.skuId,
        isChecked,
      });
      PromiseAll.push(Promise);
    });
    return Promise.all(PromiseAll);
  },
};
const getters = {
  cartList(state) {
    return state.cartList[0] || {};
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
