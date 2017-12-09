import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/store"

// import Login from "@/pages/login"
// import Index from "@/pages/index"
//路由组件懒加载并分块打包(Webpack > 2.4提供的一种特定的注释语法)

const Login = () => import(/* webpackChunkName: "index" */"../pages/login")
const Index = () => import(/* webpackChunkName: "index" */"../pages/index")
const IndexMain = () => import(/* webpackChunkName: "index" */"../pages/index/main")
const IndexMy = () => import(/* webpackChunkName: "index" */"../pages/index/my")

const Search = () => import(/* webpackChunkName: "zichan" */"../pages/search")
const Result = () => import(/* webpackChunkName: "zichan" */"../pages/zc/result")
const List = () => import(/* webpackChunkName: "zichan" */"../pages/zc/list")
const Qrcode = () => import(/* webpackChunkName: "zichan" */"../pages/zc/qrcode")
const Inventory = () => import(/* webpackChunkName: "zichan" */"../pages/zc/inventory")
const Receive = () => import(/* webpackChunkName: "zichan" */"../pages/zc/receive")
const Confirm = () => import(/* webpackChunkName: "zichan" */"../pages/zc/confirm")
const Count = () => import(/* webpackChunkName: "zichan" */"../pages/zc/count")
const ZcTip = () => import(/* webpackChunkName: "zichan" */"../pages/zc/tip")
const ZcShow = () => import(/* webpackChunkName: "zichan" */"../pages/zc/show")

const MyAsset = () => import(/* webpackChunkName: "aboutMe" */"../pages/my/my_asset")
const MyRecord = () => import(/* webpackChunkName: "aboutMe" */"../pages/my/my_record")
const MyInfo = () => import(/* webpackChunkName: "aboutMe" */"../pages/my/my_info")
const MyMessage = () => import(/* webpackChunkName: "aboutMe" */"../pages/my/my_message")
const ChangePwd = () => import(/* webpackChunkName: "aboutMe" */"../pages/my/change_pwd")

const QrcodeScan = () => import(/* webpackChunkName: "native" */"../pages/native/qrcode_scan")

Vue.use(Router)
//将所有页面组件一次性加载是一个很浪费资源和考验用户耐心的做法，尤其在移动端。
//webpack 提供了code splitting，实现当切换到特定路由时才加载代码。
const router = new Router({
	routes: [
		{name: "login", path: '/',component: Login},
		{path: "/index",component: Index, children:[ //子路由
			{name:"index_main", path: "main", component:IndexMain},
			{name:"index_my", path: "my", component:IndexMy}
		]},
		{name:"search", path: "/search",component: Search},
		{path: "/search/result",component: Result},
		{path: "/zc/list",component: List},
		{path: "/zc/list/qrcode", component: Qrcode},
		{path: "/zc/inventory",component: Inventory},
		{path: "/zc/receive",component: Receive},
		{path: "/zc/receive/confirm",component: Confirm},
		{path: "/zc/receive/count",component: Count},
		{path: "/zc/receive/tip",component: ZcTip},
		{path: "/zc/receive/show",component: ZcShow},
		{path: "/my/my_asset",component: MyAsset},
		{path: "/my/my_record",component: MyRecord},
		{path: "/my/my_info",component: MyInfo},
		{path: "/my/my_message",component: MyMessage},
		{path: "/my/change_pwd",component: ChangePwd},
		{path: "/native/qrcode_scan",component: QrcodeScan}
	]
});
//全局路由导航前置守卫
router.beforeEach(function (to, from, next) {
	//显示加载提示框
	store.commit('setLoading', true);
	if(to.name !== "login") {
		store.state.loginInfo.userData ? next() : next("/"),store.commit('setLoading', false);
	} else {
		next();
	}
});
//全局路由导航后置守卫
router.afterEach(function (to) {
	//隐藏加载提示框
	store.commit('setLoading', false);
});

export default router
