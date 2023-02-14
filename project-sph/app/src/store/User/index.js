import {
  reqGetCode,
  reqUserRegister,
  reqUserLogin,
  reqGetUserInfo,
  reqLogout,
} from "@/api";
import { setToken, getToken, removeToken } from "@/utils/token";
const state = {
  code: "",
  token: getToken(),
  userInfo: {},
};
const mutations = {
  //获取验证码
  GETCODE(state, code) {
    state.code = code;
  },
  //登录
  USERLOGIN(state, token) {
    state.token = token;
  },
  //获取用户信息
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  //退出登录
  LOGOUT(state) {
    //清空仓库中用户信息
    state.token = "";
    state.userInfo = "";
    //清空本地存储数据
    removeToken();
  },
};
const actions = {
  //获取验证码
  async getCode({ commit }, phone) {
    //获取验证码的这个接口，把验证码返回，但是正常情况，后台把验证码发到用户的手机上【省钱】
    let result = await reqGetCode(phone);
    if (result.code == 200) {
      commit("GETCODE", result.data);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  //注册
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user);
    if (result.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  //登录
  async userLogin({ commit }, user) {
    let result = await reqUserLogin(user);
    //服务器下发token，用户唯一标识符
    //将来经常通过带token找服务器要用户信息进行展示
    if (result.code == 200) {
      commit("USERLOGIN", result.data.token);
      //持久化token
      setToken(result.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  //获取用户信息
  async getUserInfo({ commit }) {
    let result = await reqGetUserInfo();
    if (result.code == 200) {
      commit("GETUSERINFO", result.data);
      return 'ok';
    }else{
      return Promise.reject(new Error('faile'));
    }
  },
  //退出登录
  async userLogout({ commit }) {
    let result = await reqLogout();
    if (result.code == 200) {
      commit("LOGOUT");
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
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
