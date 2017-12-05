import Vue from 'vue'
import Router from 'vue-router'
import Login from	"@/pages/login"
import Index from	"@/pages/index"
import IndexMain from "@/pages/index/main"
import IndexMy from "@/pages/index/my"

import Search from "@/pages/search"
import Result from "@/pages/zc/result"
import List from "@/pages/zc/list"
import Qrcode from "@/pages/zc/qrcode"
import Inventory from "@/pages/zc/inventory"
import Receive from "@/pages/zc/receive"
import Confirm from "@/pages/zc/confirm"
import Count from "@/pages/zc/count"

import MyAsset from "@/pages/my/my_asset"
import MyRecord from "@/pages/my/my_record"
import MyInfo from "@/pages/my/my_info"
import ChangePwd from "@/pages/my/change_pwd"

import QrcodeScan from "@/pages/native/qrcode_scan"

import store from "../store/store"

Vue.use(Router)

const router = new Router({
	routes: [
		{path: '/',component: Login},
		{path: "/index",component: Index, children:[ //子路由
			{name:"index_main", path: "main", component:IndexMain},
			{name:"index_my", path: "my", component:IndexMy}
		]},
		{path: "/search",component: Search},
		{path: "/search/result",component: Result},
		{path: "/zc/list",component: List},
		{path: "/zc/list/qrcode", component: Qrcode},
		{path: "/zc/inventory",component: Inventory},
		{path: "/zc/receive",component: Receive},
		{path: "/zc/receive/confirm",component: Confirm},
		{path: "/zc/receive/count",component: Count},
		{path: "/my/my_asset",component: MyAsset},
		{path: "/my/my_record",component: MyRecord},
		{path: "/my/my_info",component: MyInfo},
		{path: "/my/change_pwd",component: ChangePwd},
		{path: "/native/qrcode_scan",component: QrcodeScan}
	]
});
//全局路由导航前置守卫
router.beforeEach(function (to, from, next) {
	//显示加载提示框
	store.commit('setLoading', true)
	next()
});
//全局路由导航后置守卫
router.afterEach(function (to) {
	//隐藏加载提示框
	store.commit('setLoading', false)
});

export default router
