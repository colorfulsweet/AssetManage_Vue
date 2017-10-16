<!-- 登陆页面 -->
<template>
<div>
	<group gutter="0">
		<form action="" method="post">
		<x-input type="text" v-model="username" title="用户名" placeholder="请输入" required :show-clear="true" placeholder-align="right" text-align="right"></x-input>
		<x-input type="password" v-model="password" title="密码" placeholder="请输入" required :show-clear="true" placeholder-align="right" text-align="right"></x-input>
		</form>
	</group>
	<div class="btn-container">
		<x-button @click.native="loginSubmit" type="primary">登陆</x-button>
		<div>测试用户 : MA1 MK1 MK2 , 密码都是123</div>
	</div>
</div>
</template>
<script>
import { XInput, Group, XButton, Cell } from 'vux'
export default {
	name : "login",
	data () {
		return {
			username : null,
			password : null
		};
	},
	components : {
		XInput, Group, XButton, Cell
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : false,title : "登录"});
	},
	methods : {
		loginSubmit () {
			if (!this.username) {
				this.$vux.toast.text('用户名不能为空', 'middle');
                return;
            } 
            if (!this.password) {
				this.$vux.toast.text('密码不能为空', 'middle');
                return;
            } 
			//TODO 验证用户名密码
			var _this = this;
			this.$vux.toast.show({
				text : "登陆成功",
				type : "text",
				position : "middle",
				onHide () {
					_this.$router.push("/index");
				}
			})
			this.$store.commit("login", {
				username : this.username,
				realname : "测试用户"
			});
		}
	}
};
</script>