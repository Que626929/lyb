import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'
//引入仓库
import store from '@/store';
//引入MockServe.js----mock数据
import '@/mock/mockServe.js';
//引入swiper样式
import 'swiper/css/swiper.css';
//统一接收api接口文件里面的全部请求函数
import * as API from '@/api';
import { Button,MessageBox } from 'element-ui';
//二级联动组件--全局组件
import TypeNav from "@/components/TypeNav";
import Carousel from "@/components/Carousel";
import Pagination from "@/components/Pagination";
Vue.component(Button.name, Button);
//第一个参数：全局组件的名字 第二个参数：哪一个组件
Vue.component(TypeNav.name,TypeNav);
Vue.component(Carousel.name,Carousel);
Vue.component(Pagination.name,Pagination);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

Vue.config.productionTip = false

//图片懒加载
import VueLazyload from 'vue-lazyload';
import loadimage from '@/assets/1.gif';
Vue.use(VueLazyload, {
  loading: loadimage,
})
//表单验证的插件
import '@/plugins/validate';

new Vue({
  render: h => h(App),
  //全局事件总线$bus配置
  beforeCreate(){
    Vue.prototype.$bus=this;
    Vue.prototype.$API=API;
  },
  router,
  //注册仓库：组件实例的身上会多一个属性$store属性
  store
}).$mount('#app')
