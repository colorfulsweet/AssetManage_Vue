<!-- 个人信息 页面 -->
<template>
<div>
	<group>
		<template v-if="modify">
			<x-input title="用户名" v-model="currentUser.user" required="true" ></x-input>
			<x-input title="姓名" v-model="currentUser.realname" required="true" ></x-input>
			<x-input title="职务" v-model="currentUser.title"></x-input>
			<!-- mask="999 9999 9999" 可以格式化手机号码, 实际值也是格式化之后的值, 包含空格 -->
			<x-input title="联系电话" v-model="currentUser.lxdh" is-type="china-mobile"></x-input>
			<x-input title="电子邮箱" v-model="currentUser.dzyx" is-type="email"></x-input>
		</template>
		<template v-else>
			<cell title="用户名" :value="currentUser.user"></cell>
			<cell title="姓名" :value="currentUser.realname"></cell>
			<cell title="职务" :value="currentUser.title"></cell>
			<cell title="联系电话" :value="currentUser.lxdh"></cell>
			<cell title="电子邮箱" :value="currentUser.dzyx"></cell>
		</template>
  </group>
	<div class="btn-container">
		<x-button @click.native="modifyAndSave" type="primary">{{modify?'保存':'修改'}}</x-button>
	</div>
</div>
</template>
<script>
import { XInput, Group, XButton, Cell } from 'vux'

export default {
    name : "my_info",
    data () {
			return {
				currentUser : {},
				modify : false
			};
    },
    created () {
			this.$store.commit("setHeaderConf",
				{
					hasbackbtn : true,
					title : "我的信息"
				});
			this.currentUser = this.$store.state.loginInfo.userData;
    },
    components : { XInput, Group, XButton, Cell },
    methods : {
			modifyAndSave () : {
				if(this.modify) {
					if(!this.currentUser.user) {
						this.$vux.toast.text('用户名不能为空', 'middle');
						return;
					}
					if(!this.currentUser.realname) {
						this.$vux.toast.text('姓名不能为空', 'middle');
						return;
					}
					var _this = this;
					// 保存个人信息
					this.$http.post(this.$store.state.apiUrl + "bgr/save", this.currentUser)
					.then(function(response){
						_this.$vux.toast.text(response.data.msg, "middle");
						//切换到查看状态
						_this.modify = false;
					});
				} else {
					//切换到编辑状态
					this.modify = true;
				}
			}
    }
}
</script>
