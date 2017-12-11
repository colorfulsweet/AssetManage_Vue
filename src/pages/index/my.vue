<!-- index中"我的"区域 -->
<template>
<div>
<group gutter="0">
	<template v-for="(item,index) in menus">
	<cell-box is-link :link="item.url" v-bind:key="index" >
		{{item.name}}
		<badge :text="item.badgeNum" v-if="item.badgeNum > 0"></badge>
	</cell-box>
	</template>
</group>
<div class="btn-container" >
	<x-button @click.native="logout" type="warn">退出登录</x-button>
</div>
</div>
</template>

<script>
import {Group, CellBox, XButton, Badge} from 'vux'

export default {
	name : "index_my",
	data () {
		return {
			menus :[{ //===我的===
				id : "my_info",
				name : "我的信息",
				url : "/my/my_info",
			},{
				id : "my_record",
				name : "我的记录",
				url : "/my/my_record",
			},{
				id : "my_assets",
				name : "当前资产",
				url : "/my/my_asset",
			},{
				id : "my_messages",
				name : "我的消息",
				url : "/my/my_message",
				badgeNum : 0
			},{
				id : "change_pwd",
				name : "修改密码",
				url : "/my/change_pwd",
			}]
		}
	},
	components : {Group, CellBox, XButton, Badge},
	created () {
		var _this = this;
		//临时功能 - 根据当前事件判断是否给予盘点提醒
		this.$http.get(this.$store.state.apiUrl + "pd/getTimestamp",
			{params:{r : Math.random()}})
		.then((response) => {
			var msgs = [];
			var timestampNum = parseInt(response.data);
			var now = new Date(timestampNum);
			if(now.getMonth() + 1 == 6 && now.getDate() >= 10) {
				msgs.push("请于<b>6月30日</b>前执行资产盘点");
				_this.menus[3].badgeNum ++;
			}
			if(now.getMonth() + 1 == 12 && now.getDate() >= 10) {
				msgs.push("请于<b>12月31日</b>前执行资产盘点");
				_this.menus[3].badgeNum ++;
			}
			localStorage.setItem("messages", JSON.stringify(msgs));
		});
	},
	methods : {
		/**
		 * 注销
		 */
		logout () {
			var _this = this;
			this.$vux.confirm.show({
				content : "确认退出登录吗?",
				onConfirm () {
					_this.$vux.toast.show({
						text : "退出登录成功",
						type : "text",
						position : "middle",
						onHide () {
							_this.$store.commit("logout");
							_this.$router.push("/");
						}
					});
				}
			});
		}
	}
}

</script>