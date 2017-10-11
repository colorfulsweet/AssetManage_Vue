<template>
<div>
	<x-header :left-options="{showBack: false}">登陆</x-header>
	<group>
		<form action="" method="post">
		<x-input type="text" v-model="username" title="用户名" placeholder="请输入" required :show-clear="true" placeholder-align="right" text-align="right"></x-input>
		<x-input type="password" v-model="password" title="密码" placeholder="请输入" required :show-clear="true" placeholder-align="right" text-align="right"></x-input>
		</form>
	</group>
	<div style="padding:15px;">
		<x-button @click.native="loginSubmit" type="primary">登陆</x-button>
		<div>测试用户 : MA1 MK1 MK2 , 密码都是123</div>
	</div>
</div>
</template>
<script>
import { XHeader, XInput, Group, XButton, Cell } from 'vux'
export default {
	name : "login",
	data () {
		return {
			username : null,
			password : null
		};
	},
	components : {
		XHeader, XInput, Group, XButton, Cell
	},
	methods : {
		loginSubmit : function(){
			//TODO 验证用户名密码
			var _this = this;
			this.$vux.toast.show({
				text : `${this.username},${this.password}`,
				type : "text",
				position : "middle",
				onHide () {
					_this.$router.push("/index");
				}
			})
			localStorage.setItem("login_user", {
				username : this.username,
				realname : "测试用户"
			});
		}
	}
};
</script>