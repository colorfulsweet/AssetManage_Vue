<!-- 二维码展示 页面 -->
<template>
<div>
	<divider>请展示给交接方进行扫码</divider>
	<div class="qrcode-panel" >
		<img id="qrcode_img" :src="imgSrc" title="资产流转二维码"/>
	</div>
</div>
</template>
<script>
import { Divider } from 'vux'
export default {
	name : "qrcode",
	data () {
		return {
			operateId : localStorage.getItem("operateId"), //操作ID
			operate : localStorage.getItem("operate"), //操作类型
			imgSrc : null
		};
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : false,title : "二维码"});
		this.imgSrc = this.$store.state.apiUrl+'lz/outputQrcode/'+localStorage.getItem('operateId');
		this.checkFinished();
	},
	components : { Divider },
	methods : {
		/**
		 * 验证对方是否确认完成
		 */
		checkFinished () {
			var _this = this;
			// 对后台执行轮询, 等待对方扫码之后确认完成, 显示出库清单
			this.$http.get(this.$store.state.apiUrl+"lz/checkFinished",
				{params:{
					operateId: this.operateId, 
					r: Math.random() //添加随机数防止缓存
				}}).then(function(response){
					if(response.data.msg !== "finished") {
						setTimeout(() => {
							_this.checkFinished();
						}, 3000);
					} else {
						_this.openNextView(); //根据角色与操作类型进行页面跳转
					}
				});
		},
		/**
		 * 自动触发的页面跳转
		 */
		openNextView () {
			localStorage.setItem("from", "qrcode"); //来自于二维码展示页面
			var currentUser = this.$store.state.loginInfo.userData;
			switch (this.operate) {
			case "1" : //出库 
				//当前用户为MA,则跳转到上传照片, 为MK则跳转到清单
				if(currentUser.roles.findIndex((item)=>{return item === "MA";}) !== -1) {
					this.$router.push("/zc/receive");
				} else if(currentUser.roles.findIndex((item)=>{return item === "MK";}) !== -1) {
					this.$router.push("/zc/receive/show");
				}
				break;
			case "2" : //流转
				this.$router.push("/zc/receive/show");
				break;
			case "3" : //TODO 回收...
				break;
			default : 
				throw new Error("未知的操作类型 : " + operate);
			}
		}
	}
};
</script>
<style>
.qrcode-panel {margin-top:10%; text-align:center; width:100%;}
.qrcode-panel > img {width : 80%; margin : 10% auto;}
</style>