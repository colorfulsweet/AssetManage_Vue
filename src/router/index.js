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
    {path: "/my/my_record",component: MyRecord}
  ]
});

router.beforeEach(function (to, from, next) {
  store.commit('setLoading', true)
  next()
})

router.afterEach(function (to) {
  store.commit('setLoading', false)
})

export default router
