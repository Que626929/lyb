import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store";
//使用插件
Vue.use(VueRouter);

// 备份push和replace方法
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

//重写push|replace
//第一个参数，往哪跳
//第二个参数，成功的回调
//第三个参数，失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
//配置路由
let router = new VueRouter({
  routes,
  //滚动行为
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 };
  },
});
//全局守卫：前置守卫（在路由跳转之前）
router.beforeEach(async (to, from, next) => {
  //to:可以获取到你要跳转到哪个路由信息
  //from:可以获取到你从哪个路由而来的信息
  //next：放行函数 next()放行 next(path)放行到指定路由
  let token = store.state.User.token;
  let name = store.state.User.userInfo.name;
  //用户已经登录
  if (token) {
    //用户已经登录，不能去login
    if (to.path == "/login" || to.path=="/register") {
      next("/hone");
    } else {
      //用户已经登录，去的不是login
      //判断是否有用户名，如果有就放行，没有就发放action获取用户信息
      if (name) {
        next();
      } else {
        try {
          //获取用户信息
          await store.dispatch("getUserInfo");
          next();
        } catch (error) {
          //token失效了，获取不到用户信息，重新登录
          //清空用户信息
         await store.dispatch('userLogout');
          next('/login');
        }
      }
    }
  } else {
    //用户没有登录
    let toPath=to.path;
    if(toPath.indexOf('/trade')!=-1 || toPath.indexOf('pay')!=-1 || toPath.indexOf('center')!=-1 || toPath.indexOf('shopcart')!=-1){
      next('/login?redirect='+toPath);
    }else{
      next();
    }
  }
});
export default router;
