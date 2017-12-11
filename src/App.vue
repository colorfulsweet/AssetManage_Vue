<template>
<div id="app">
	<loading ></loading>
	<x-header :left-options="{showBack: $store.state.headerConf.hasbackbtn}">
		{{$store.state.headerConf.title}}
	</x-header>
	<user-info :realname="$store.state.loginInfo.userData ? $store.state.loginInfo.userData.realname : null"></user-info>
	<transition :name="mainViewTransition">
		<router-view class="main-view"/>
	</transition>
</div>
</template>

<script>
import { Actionsheet,XHeader } from 'vux'
import Loading from "./components/loading";
import UserInfo from "./components/user_info";


export default {
	name: 'app',
	data () {
		return {
			mainViewTransition: 'slide-left'
		};
	},
	created () {
		var _this = this;
		import(/* webpackChunkName: "native" */ './pages/native/init').then(Init => {
			Init.run(_this); //程序初始化需要执行的操作(相关物理按键的事件绑定)
		});
	},
	components : {
		Actionsheet, XHeader, Loading, UserInfo
	},
	watch: {
		'$route' (to, from) {
			const toDepth = to.path.split('/').length;
			const fromDepth = from.path.split('/').length;
			this.mainViewTransition = (toDepth < fromDepth ? 'slide-right' : 'slide-left');
		}
	}
}
</script>
<style>
@import "../static/fonts/font-awesome.min.css";
* {
	margin : 0;
	padding : 0;
}
html,body{
	width: 100%;
	height:100%;
	overflow-x:hidden;
	min-width: 320px;
}
#app {
	position: relative;
	height:100%;
}
.main-view {
	padding-top:2.9em;
	position: absolute;
	width: 100%;
	height : calc(100vh - 2.9em);
	transition: all .5s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
	opacity: 0;
	-webkit-transform: translate(30px, 0);
	transform: translate(30px, 0);
}
.slide-left-leave-active, .slide-right-enter {
	opacity: 0;
	-webkit-transform: translate(-30px, 0);
	transform: translate(-30px, 0);
}
.vux-header, .weui-tabbar {
	width:100%;
	position: fixed !important;
	z-index:100;
}
.vux-header {
	top:0;
}
.weui-tabbar {
	bottom: 0;
}
.btn-container {
	padding: 1em;
}
.table-body-container {
	overflow-y: auto;
	box-shadow: 0px 0px 5px #626262 inset;
}
.table-body-container td {
	word-wrap: break-word;
}
</style>
