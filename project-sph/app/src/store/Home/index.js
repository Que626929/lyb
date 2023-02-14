import { reqCategoryList, reqGetBannerList, reqGetFloorList } from "@/api";
// Home模块的仓库
const state = {
  //state中数据默认初始值别瞎写，服务器返回对象，服务器返回数组【根据接口返回值初始化】
  categoryList: [],
  bannerList: [],
  floorList:[]
};
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList;
  },
  GETBANNERLIST(state, bannerList) {
    state.bannerList = bannerList;
    // console.log("修改轮播图数据");
  },
  GETFLOORLIST(state,floorList){
    state.floorList=floorList;
  }
};
const actions = {
  //通过api里面的接口函数调用，向服务器发请求，获取服务器的数据
  async categoryList({ commit }) {
    let result = await reqCategoryList();
    if (result.code == 200) {
      commit("CATEGORYLIST", result.data);
    }
  },
  //获取首页轮播图的数据
  async getBannerList({ commit }) {
    let result = await reqGetBannerList();
    if (result.code == 200) {
      commit("GETBANNERLIST", result.data);
    }
    // console.log("获取轮播图数据");
  },
  //获取floor组件的数据
  async getFloorList({ commit }) {
    let result = await reqGetFloorList();
    if (result.code == 200) {
      commit("GETFLOORLIST", result.data);
    }
  },
};
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
