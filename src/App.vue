<template>
  <div id="app">
    <x-header :left-options="{showBack: $store.state.headerConf.hasbackbtn}">
      {{$store.state.headerConf.title}}
    </x-header>
    <!--
    <div v-transfer-dom>
      <loading :show="isLoading" ></loading>
    </div>
    -->
    <transition :name="transitionName">
      <router-view class="main-view"/>
    </transition>
  </div>
</template>

<script>
import Actionsheet from 'vux/src/components/actionsheet/index';
import Loading from 'vux/src/components/loading/index';
import XHeader from 'vux/src/components/x-header/index';
//import { TransferDomDirective as TransferDom} from "vux";
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'slide-left',
      isLoading : true
    };
  },
  components : {
    Actionsheet,
    Loading,
    XHeader
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
</style>
