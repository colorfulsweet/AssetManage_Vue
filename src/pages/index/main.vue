<!-- index的首页区域 -->
<template>
<div>
<group gutter="0">
	<template v-for="(item,index) in menus"
		v-if="!$store.state.loginInfo.userData || !item.roles || existsSameValues(item.roles, $store.state.loginInfo.userData.roles)">
	<cell-box is-link :link="item.url" v-bind:key="index">{{item.name}}</cell-box>
	</template>
</group>
</div>
</template>

<script>
import { Group, CellBox } from 'vux'

export default {
	name : "index_main",
	data () {
		return {
			menus : [{ //===首页===
				name : "资产出库",
				url : "/search?operate=1"
			},{
				name : "资产流转",
				url : "/search?operate=2",
				roles : ["MK","XM_MK","XMLS_MK","FB_MK"]
			},{
				name : "资产入库",
				url : "/zc/storage",
				roles : ["MA","MK"]
			},{
				name : "资产盘点",
				url : "/zc/inventory"
			},{
				name : "资产处理",
				url : "/search?operate=3&target=/zc/inventory"
			},{
				name : "资产维保",
				url : "/search?operate=4&target=/zc/inventory"
			},{
				name : "二维码扫描",
				url : "/native/qrcode_scan"
			}]
		}
	},
	components : { Group, CellBox },
	methods : {
		/**
		 * 判断两个数组是否包含重复的元素
		 */
		existsSameValues (arr1, arr2) {
			if(!Array.isArray(arr1) || !Array.isArray(arr2)) {
				return false;
			}
			for(let index1 in arr1) {
				for(let index2 in arr2) {
					if(arr1[index1] === arr2[index2]) {
						return true;
					}
				}
			}
			return false;
		}
	}
}

</script>