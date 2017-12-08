<!-- 操作确认提示 页面 -->
<template>
<div>
	<msg title="操作成功" description="请交接货物, 提交交接信息" :buttons="buttons" icon="success"></msg>
</div>
</template>

<script>
import { Msg } from 'vux'

export default {
	name : "confirm",
	data () {
		return {
			buttons :[{
				type: 'primary',
				text: '提交',
				onClick: this.submit.bind(this)
			},{
				type: 'default',
				text: '取消',
				onClick: this.cancel.bind(this)
			}],
			operateId : localStorage.getItem("operateId"),
			operate : localStorage.getItem("operate") || 1,
			from : localStorage.getItem("from")
		}
	},
	created () {
		this.$store.commit("setHeaderConf",{
			hasbackbtn : true,
			title : `资产${this.$store.state.operateList[this.operate-1]}`
		});
	},
	components : { Msg },
	methods : {
		/**
		 * 提交
		 */
		submit () {
			var _this = this;
			var currentUser = this.$store.state.loginInfo.userData;
			this.$http.get(this.$store.state.apiUrl+"lz/finished",
				{params:{
					operateId : this.operateId, 
					operate : this.operate,
					bgrId : currentUser.uuid
				}}).then(function(response){
					switch(_this.operate) {
					case "1" : 
						if(currentUser.roles.findIndex((item) => {return item==='MK';}) !== -1 
							&& _this.from !== 'noQrcode') {
							_this.$router.push("/zc/receive/tip");
						} else {
							_this.$vux.alert.show({
								title: '提示',
								content: '操作成功',
								onHide() {
									_this.$router.push("/zc/receive/count");
								}
							});
						}
						break;
					case "2" : 
						_this.$router.push("/zc/receive/count");
						break;
					case "3" : //TODO 回收
					}
				});
		},
		/**
		 * 取消
		 */
		cancel () {
			this.$router.go(-1);
		}
	}
}

</script>