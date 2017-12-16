<!-- 二维码展示 页面 -->
<template>
<div>
	<flexbox orient="vertical" justify="space-around" style="height:100%;min-height:480px;">
		<flexbox-item style="flex-grow:0;">
		<divider>请展示给交接方进行扫码</divider>
		</flexbox-item>
		<flexbox-item style="flex-grow:0;">
		<div class="qrcode-panel" >
			<img id="qrcode_img" :src="imgSrc" title="资产流转二维码"/>
		</div>
		</flexbox-item>
		<flexbox-item style="flex-grow:0;">
		<div class="btn-container">
			<x-button @click.native="backToIndex" type="default" :plain="true" >返回首页</x-button>
		</div>
		</flexbox-item>
	</flexbox>
</div>
</template>
<script>
import { Divider,XButton,Flexbox,FlexboxItem } from 'vux'

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
	components : { Divider,XButton,Flexbox,FlexboxItem },
	methods : {
		/**
		 * 验证对方是否确认完成
		 */
		checkFinished () {
			// 创建websocket连接, 等待服务端返回对方确认完成的消息
			var _this = this;
			const socket = new WebSocket(this.$store.state.wsUrl + "lz/waitingFinish");
			socket.addEventListener("open", (event) => {
				//当连接建立, 立即发送当前的operateId给服务端
				socket.send(JSON.stringify({operateId : _this.operateId}));
			});

			socket.addEventListener("message", (event) => {
				//event.data为从服务端接收到的消息内容
				if(event.data.toString() === "finished") {
					socket.close();
					_this.openNextView();
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
					this.$router.replace("/zc/receive");
				} else if(currentUser.roles.findIndex((item)=>{return item === "MK";}) !== -1) {
					this.$router.replace("/zc/receive/show");
				}
				break;
			case "2" : //流转
				this.$router.replace("/zc/receive/show");
				break;
			case "3" : //TODO 回收...
				break;
			default : 
				throw new Error("未知的操作类型 : " + operate);
			}
		},
		backToIndex () {
			this.$router.replace("/index/main");
		}
	}
};
</script>
<style scoped>
.qrcode-panel {text-align:center;}
</style>