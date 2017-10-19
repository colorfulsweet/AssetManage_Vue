<!-- 首页/我的 -->
<template>
<div>
	<group gutter="0">
		<template v-for="(item,index) in menus[tabs.selectIndex]">
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
            url : "/search?operate=3"
        },{
            id : "zccl",
            name : "资产处理",
            url : "/search?operate=4",
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
        },{
            id : "change_pwd",
            name : "修改密码",
            url : "my/change_pwd.html",
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
                    hasbackbtn : true,
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
        }
	}
};
</script>
<style>
.fa {
    font-size: 1.2em;
}
</style>
