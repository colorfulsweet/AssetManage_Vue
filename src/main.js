// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import qs from 'qs'
import App from './App'
import router from './router'
import store from "./store/store"
import  { ToastPlugin, AjaxPlugin, AlertPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(ToastPlugin); //Toast提示插件
Vue.use(AjaxPlugin); //发送ajax请求插件
Vue.use(AlertPlugin); //提示框

Vue.http.interceptors.request.use(function (config) {
  // 请求发送前的处理逻辑
  var _token = vm.$store.state.loginInfo.token;
  //将_token添加到请求参数
  switch(config.method) {
    case "get" :
      if(typeof config.params === "object") {
        config.params._token = _token;
      } else {
        config.params = { _token };
      }
      break;
    case "post" :
      if(typeof config.data === "object") {
        config.data._token = _token ? _token : "";
      } else {
        config.data = { _token };
      }
      //post请求对参数进行序列化
      config.data = qs.stringify(config.data);
      break;
  }
  return config;
}, function (error) {
  // Do something with request error 
  return Promise.reject(error);
});

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
