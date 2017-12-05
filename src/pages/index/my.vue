<!-- index中"我的"区域 -->
<template>
<div>
<group gutter="0">
	<template v-for="(item,index) in menus">
	<cell-box is-link :link="item.url" v-bind:key="index">{{item.name}}</cell-box>
	</template>
</group>
<div class="btn-container" >
	<x-button @click.native="logout" type="warn">退出登录</x-button>
</div>
</div>
</template>

<script>
import {Group , CellBox, XButton} from 'vux'

export default {
	name : "index_my",
	data () {
		return {
			menus :[{ //===我的===
				id : "my_info",
				name : "我的信息",
				url : "my/my_info",
			},{
				id : "my_record",
				name : "我的记录",
				url : "my/my_record",
			},{
				id : "my_assets",
				name : "当前资产",
				url : "/my/my_asset",
			},{
				id : "my_messages",
				name : "我的消息",
				url : "/my/my_message",
			},{
				id : "change_pwd",
				name : "修改密码",
				url : "/my/change_pwd",
			}]
		}
	},
	components : {Group , CellBox, XButton},
	methods : {
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
}

</script>