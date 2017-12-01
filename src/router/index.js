import Vue from 'vue'
import Router from 'vue-router'
import Login from  "@/pages/login"
import Index from  "@/pages/index"
import Search from "@/pages/search"
import Result from "@/pages/zc/result"
import List from "@/pages/zc/list"
import Inventory from "@/pages/zc/inventory"

import MyAsset from "@/pages/my/my_asset"
import MyRecord from "@/pages/my/my_record"
import MyInfo from "@/pages/my/my_info"

import store from "../store/store"

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/',component: Login},
    {path: "/index",component: Index},
    {path: "/search",component: Search},
    {path: "/search/result",component: Result},
    {path: "/zc/list",component: List},
    {path: "/zc/inventory",component: Inventory},
    {path: "/my/my_asset",component: MyAsset},
    {path: "/my/my_record",component: MyRecord},
    {path: "/my/my_info",component: MyInfo}
  ]
});
//全局路由导航前置守卫
router.beforeEach(function (to, from, next) {
  //显示加载提示框
  store.commit('setLoading', true)
  next()
})
//全局路由导航后置守卫
router.afterEach(function (to) {
  //隐藏加载提示框
  store.commit('setLoading', false)
})

export default router
