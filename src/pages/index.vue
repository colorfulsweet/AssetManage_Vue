<!-- 首页/我的 -->
<template>
<div>
	<transition :name="indexViewTransition">
		<keep-alive><router-view class="index-view"/></keep-alive>
	</transition>
	<tabbar>
		<template v-for="(item,index) in tabs.items">
		<tabbar-item @on-item-click="tabClick" v-bind:selected="index==tabs.selectIndex" v-bind:key="index">
			<i :class="'fa fa-'+item.icon" slot="label"></i>
			<span class="fa" slot="label">{{item.name}}</span>
		</tabbar-item>
		</template>
	</tabbar>
</div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
	name : "index",
	data () {
		return {
		tabs : {
			selectIndex : 0,
			items : [{
				name : "首页",
				icon : "home",
				target : "index_main"
			},{
				name : "我的",
				icon : "user",
				target : "index_my"
			}]
		},
		indexViewTransition : 'index-left'
		};
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : false,title : "首页"});
	},
	watch : {
		tabs : {
			deep : true,
			handler (newVal, oldVal) {
				this.$store.commit("setHeaderConf", {
					hasbackbtn : false,
					title : this.tabs.items[newVal.selectIndex].name
				});
			}
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			//根据路由的名称确定要选中哪个tab
			vm.tabs.selectIndex = vm.tabs.items.findIndex((item)=>{return item.target===to.name});
		});
	},
	components : { Tabbar, TabbarItem },
	methods : {
		/**
		 * tab页签点击事件
		 */
		tabClick (index) {
			if(this.tabs.selectIndex == index) {
				return;
			}
			this.indexViewTransition = (this.tabs.selectIndex > index ? "index-right" : "index-left");
			this.tabs.selectIndex = index;
			this.$router.replace( {name : this.tabs.items[index].target} );
		}
	}
};
</script>
<style scoped>
.fa {
	font-size: 1.3em;
}
.index-view {
	position: absolute;
	width: 100%;
	height : calc(100vh - 2.9em - 3em);
	transition: all .5s ease-in-out;
}
.index-left-enter, .index-right-leave-active {
	-webkit-transform: translate(100vw, 0);
	transform: translate(100vw, 0);
}
.index-left-leave-active, .index-right-enter {
	-webkit-transform: translate(-100vw, 0);
	transform: translate(-100vw, 0);
}
</style>
