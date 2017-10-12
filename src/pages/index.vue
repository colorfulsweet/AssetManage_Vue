<template>
<div>
	<x-header>首页</x-header>
	<group>
		<template v-for="(item,index) in menus[selectIndex]">
		<cell-box is-link :link="item.url">{{item.name}}</cell-box>
		</template>
    </group>
	<tabbar>
		<tabbar-item @on-item-click="onItemClick" selected>
			<!-- <img slot="icon" src="../assets/demo/icon_nav_button.png"> -->
			<span slot="label">首　页</span>
		</tabbar-item>
		<tabbar-item @on-item-click="onItemClick">
			<!-- <img slot="icon" src="../assets/demo/icon_nav_button.png"> -->
			<span slot="label">　我　</span>
		</tabbar-item>
	</tabbar>
</div>
</template>
<script>
import { XHeader, Group , CellBox, Tabbar, TabbarItem } from 'vux'
export default {
	name : "index",
	data () {
		return {
		menus : [[{ //===首页===
            id : "zcck",
            name : "资产出库",
            url : "/search/1",
            roles : ["MA", "MK"]
        },{
            id : "zclz",
            name : "资产流转",
            url : "/search/2",
            roles : ["MK"]
        },{
            id : "zcpd",
            name : "资产盘点",
            url : "/search/3"
        },{
            id : "zccl",
            name : "资产处理",
            url : "/search/4",
            roles : ["MK"]
        },{
            id : "qrcodeScan",
            name : "二维码扫描",
            callback : "qrcodeScan",
            roles : ["MA","MK"]
        }] , [{ //===我的===
            id : "my_info",
            name : "我的信息",
            //url : "my/my_info.html",
        },{
            id : "my_record",
            name : "我的记录",
            //url : "my/my_record.html",
        },{
            id : "my_assets",
            name : "当前资产",
            url : "my/my_assets.html",
        }]],
        selectIndex : 0
		};
	},
	components : {
		XHeader, Group, CellBox, Tabbar, TabbarItem
	},
	methods : {
		onItemClick (index) {
			this.selectIndex = index;
		}
	}
};
</script>