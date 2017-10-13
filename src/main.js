// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store/store"
import  { ToastPlugin, AjaxPlugin, AlertPlugin } from 'vux'

Vue.config.productionTip = false

Vue.use(ToastPlugin); //Toast提示插件
Vue.use(AjaxPlugin); //发送ajax请求插件
Vue.use(AlertPlugin); //提示框

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
