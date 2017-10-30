<template>
  <div id="app">
    <loading ></loading>
    <x-header :left-options="{showBack: $store.state.headerConf.hasbackbtn}">
      {{$store.state.headerConf.title}}
    </x-header>
    <user-info :realname="$store.state.loginInfo.userData ? $store.state.loginInfo.userData.realname : null"></user-info>
    <transition :name="transitionName">
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
      transitionName: 'slide-left',
      isLoading : true
    };
  },
  components : {
    Actionsheet, XHeader, Loading, UserInfo
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
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
</style>
