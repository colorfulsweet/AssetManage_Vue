<!-- 操作等待提示 -->
<template>
<div>
	<msg title="操作成功" description="请等待对方上传资产照片完成" :buttons="buttons" icon="info"></msg>
</div>

</template>
<script>
import { Msg } from 'vux'

export default {
	name : "zc_tip",
	data () {
		return {
			buttons :[{
				type: 'primary',
				text: '确认',
				onClick: this.submit.bind(this)
			}],
			operateId : localStorage.getItem("operateId"),
			operate : localStorage.getItem("operate") || 1
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
		 * 确认
		 */
		submit () {
			var _this = this;
			this.$http.get(this.$store.state.apiUrl+"lz/checkUpload",
				{params:{operateId : this.operateId}})
			.then((response) => {
				if(response.data.status) {
					this.$vux.alert.show({
						title: '提示',
						content: '操作成功',
						onHide() {
							_this.$router.push("/zc/receive/count");
						}
					});
				} else {
					this.$vux.toast.text('请等待对方上传照片完成', 'middle');
				}
			});
		}
	}
}

</script>