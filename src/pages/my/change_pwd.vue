<!-- 修改密码 页面 -->
<template>
<div>
	<group gutter="0">
		<form action="" method="post">
		<!-- 限制密码长度最大18位 -->
		<x-input type="password" v-model="oldPwd" title="原密码" placeholder="请输入" required :max="18"
			:show-clear="true" placeholder-align="right" text-align="right"></x-input>
		<x-input type="password" v-model="newPwd" title="新密码" placeholder="请输入" required :max="18"
			:show-clear="true" placeholder-align="right" text-align="right"></x-input>
		<x-input type="password" v-model="confirmPwd" title="确认新密码" placeholder="请输入" required :max="18"
			:show-clear="true" placeholder-align="right" text-align="right"></x-input>
		</form>
	</group>
	<div class="btn-container">
		<x-button @click.native="changePwd" type="primary">提交</x-button>
	</div>
</div>
</template>
<script>
import { XInput, Group, XButton, Cell } from 'vux'

export default {
	name : "change_pwd",
	data () {
		return {
			loginUserId : null, //当前登录用户的id
			oldPwd : null, //原密码
			newPwd : null, //新密码
			confirmPwd : null //确认新密码
		};
	},
	components : {
		XInput, Group, XButton, Cell
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : true,title : "修改密码"});
		this.loginUserId = this.$store.state.loginInfo.userData.uuid;
	},
	methods : {
		/**
		 * 执行修改密码操作
		 */
		changePwd () {
            if(!this.oldPwd) {
				this.$vux.toast.text('请输入原密码', 'middle');
                return;
            }
            if(!this.newPwd) {
				this.$vux.toast.text('请输入新密码', 'middle');
                return;
            }
            if(this.newPwd !== this.confirmPwd) {
				this.$vux.toast.text('两次输入的新密码不一致', 'middle');
                return;
			}
			var _this = this;
			this.$http.post(this.$store.state.apiUrl + "changePwd", 
				{bgrId : this.loginUserId, oldPwd : this.oldPwd,newPwd : this.newPwd })
			.then((response) => {
				_this.$vux.toast.show({
					text : response.data.msg,
					type : "text",
					position : "middle",
					onHide () {
						history.go(-1);
					}
				});
			});
        }
	}
};
</script>