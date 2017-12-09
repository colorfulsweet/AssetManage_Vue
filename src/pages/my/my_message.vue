<template>
<div>
	<group gutter="0">
	<cell-box v-bind:key="index" v-for="(item,index) in msgs" v-html="item"></cell-box>
	</group>
	<divider v-if="!msgs.length">暂无任何消息</divider>
</div>
</template>

<script>
import { Divider,Group,CellBox } from 'vux'

export default {
	name : "my_message",
	data () {
		return {
			msgs : []
		}
	},
	created () {
		this.$store.commit("setHeaderConf",{hasbackbtn : true,title : "我的消息"});
		var msgStr = localStorage.getItem("messages");
		if(!msgStr) {
			return;
		}
		this.msgs = JSON.parse(msgStr);
	},
	components : { Divider,Group,CellBox },

}
</script>