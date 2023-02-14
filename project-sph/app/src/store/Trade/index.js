import { reqUserAddress, reqOrderInfo } from "@/api";
const state = {
  address: [],
  orderInfo:{}
};
const mutations = {
  //获取用户地址信息
  GETUSERADDRESS(state, address) {
    state.address = address;
  },
  //获取订单交易页信息
  GETORDERADDRESS(state,orderInfo){
    state.orderInfo=orderInfo;
  }
};
const actions = {
  //获取用户地址信息
  async getUserAddress({ commit }) {
    let result = await reqUserAddress();
    if (result.code == 200) {
      commit("GETUSERADDRESS", result.data);
    }
  },
  //获取订单交易页信息
  async getOrderInfo({ commit }) {
    let result = await reqOrderInfo();
    if ((result.code = 200)) {
      commit("GETORDERADDRESS", result.data);
    }
  },
};
const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
