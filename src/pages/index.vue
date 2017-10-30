<!-- 首页/我的 -->
<template>
<div>
	<group gutter="0">
		<template v-for="(item,index) in menus[tabs.selectIndex]" 
            v-if="!$store.state.loginInfo.userData || !item.roles || existsSameValues(item.roles, $store.state.loginInfo.userData.roles)">
		<cell-box is-link :link="item.url" v-bind:key="index">{{item.name}}</cell-box>
		</template>
    </group>
    <div class="btn-container" v-show="tabs.selectIndex == 1">
		<x-button @click.native="logout" type="warn">退出登录</x-button>
	</div>
	<tabbar>
        <template v-for="(item,index) in tabs.items">
            <tabbar-item @on-item-click="onItemClick" v-bind:selected="index==0" v-bind:key="index">
                <i :class="'fa fa-'+item.icon" slot="label"></i>
                <span class="fa" slot="label">{{item.name}}</span>
            </tabbar-item>
        </template>
	</tabbar>
</div>
</template>
<script>
import { Group , CellBox, Tabbar, TabbarItem, XButton } from 'vux'
export default {
	name : "index",
	data () {
		return {
		menus : [[{ //===首页===
            id : "zcck",
            name : "资产出库",
            url : "/search?operate=1",
            roles : ["MA", "MK"]
        },{
            id : "zclz",
            name : "资产流转",
            url : "/search?operate=2",
            roles : ["MK"]
        },{
            id : "zcpd",
            name : "资产盘点",
            url : "/zc/inventory"
        },{
            id : "zccl",
            name : "资产处理",
            url : "/search?operate=3",
            roles : ["MA","MK"]
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
            url : "my/my_record",
        },{
            id : "my_assets",
            name : "当前资产",
            url : "/my/my_asset",
        },{
            id : "change_pwd",
            name : "修改密码",
            url : "/my/change_pwd",
        }]],
        tabs : {
            selectIndex : 0,
            items : [{
                name : "首页",
                icon : "home"
            },{
                name : "我的",
                icon : "user"
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
	components : {
		Group, CellBox, Tabbar, TabbarItem, XButton
	},
	methods : {
        /**
         * tab页签点击事件
         */
		onItemClick (index) {
            this.tabs.selectIndex = index;
        },
        /**
         * 注销
         */
        logout () {
            var _this = this;
            this.$vux.toast.show({
                text : "退出登录成功",
                type : "text",
                position : "middle",
                onHide () {
                    _this.$store.commit("logout");
                    _this.$router.push("/");
                }
            });
        },
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
};
</script>
<style>
.fa {
    font-size: 1.2em;
}
</style>
