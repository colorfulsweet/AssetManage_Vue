<template>
<div>
	<x-header>首页</x-header>
	<group>
		<template v-for="(item,index) in menus[tabs.selectIndex]">
		<cell-box is-link>{{item.name}}</cell-box>
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
            url : "zc/zcck.html",
            callback : "openUrl",
            roles : ["MA", "MK"]
        },{
            id : "zclz",
            name : "资产流转",
            url : "zc/zclz.html",
            callback : "openUrl",
            roles : ["MK"]
        },{
            id : "zcpd",
            name : "资产盘点",
            url : "zc/zcpd.html",
            callback : "openUrl"
        },{
            id : "zccl",
            name : "资产处理",
            url : "zc/zcpd.html",
            callback : "openUrl"
        },{
            id : "qrcodeScan",
            name : "二维码扫描",
            callback : "qrcodeScan",
            oles : ["MA","MK"]
        }] , [{ //===我的===
            id : "my_info",
            name : "我的信息",
            //url : "my/my_info.html",
            callback : "openUrl"
        },{
            id : "my_record",
            name : "我的记录",
            //url : "my/my_record.html",
            callback : "openUrl"
        },{
            id : "my_assets",
            name : "当前资产",
            url : "my/my_assets.html",
            callback : "openUrl"
        }]],
        tabs : {
            selectIndex : 0
        }
		};
	},
	components : {
		XHeader, Group, CellBox, Tabbar, TabbarItem
	},
	methods : {
		onItemClick (index) {
			this.tabs.selectIndex = index;
		}
	}
};
</script>