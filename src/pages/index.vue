<!-- 首页/我的 -->
<template>
<div>
	<router-view class="index-view"/>
	<tabbar>
		<template v-for="(item,index) in tabs.items">
		<tabbar-item @on-item-click="tabClick" v-bind:selected="index==0" v-bind:key="index">
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
				target : "main"
			},{
				name : "我的",
				icon : "user",
				target : "my"
			}]
		}
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
	components : { Tabbar, TabbarItem },
	methods : {
		/**
		 * tab页签点击事件
		 */
		tabClick (index) {
			this.tabs.selectIndex = index;
			this.$router.replace( {name : this.tabs.items[index].target} );
		}
	}
};
</script>
<style scope>
.fa {
	font-size: 1.2em;
}

</style>
