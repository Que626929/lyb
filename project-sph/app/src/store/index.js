import Vue from "vue";
import Vuex from "vuex";
//需要使用插件一次
Vue.use(Vuex);

import Home from "./Home";
import Search from "./Search";
import Detail from "./Detail";
import ShopCart from "./ShopCart";
import User from "./User";
import Trade from "./Trade";
//对外暴露store类的一个实例
export default new Vuex.Store({
  //实现Vuex仓库模块化开发存储数据
  modules: {
    Home,
    Search,
    Detail,
    ShopCart,
    User,
    Trade
  },
});
