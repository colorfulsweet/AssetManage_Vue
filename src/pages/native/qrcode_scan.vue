<template>
<div id="scan-panel"></div>
</template>

<script>
var scan = null;
export default {
	name : "qrcode_scan",
	data () {
		return {}
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : true,title : "二维码扫描"});
	},
	mounted () {
		if(!("plus" in window)) {
			console.log("请使用真机或模拟器进行调试!");
			return;
		}
		scan = new plus.barcode.Barcode('scan-panel');
		var errCallback = function() {
			var _this = this;
			this.$vux.alert.show({
				title: '提示',
				content: '无效内容',
				onHide() {
					_this.$router.go(-1);
				}
			});
		}
		scan.onerror = errCallback.bind(this);
		//扫描成功的回调函数
	    scan.onmarked = (function(type, code, file){
			//type - 码的类型 - 对应plus.barcode当中的常量, 二维码是plus.barcode.QR
			//code - 扫描获取到的内容
			//file - 捕捉到的图片保存的路径(可以在开始扫描时传参指定是否保存文件)
			alert(code);
			var content = null;
			try {
				content = JSON.parse(code.replace(/\\/g,""));
			} catch (e) {
				errCallback.call(this);
			}
			var currentUser = this.$store.state.loginInfo.userData;
			if("operateType" in content && "operateId" in content) {
				//将扫描获得的信息放在前端缓存
				localStorage.setItem("operateId", content.operateId);
				localStorage.setItem("operate", content.operateType);
				localStorage.setItem("from", "index");
				switch (content.operateType) {
				case "1" : //出库(可以由MA或者MK扫码)
					if(currentUser.roles.findIndex((item) => {return item === "MA";}) !== -1) {
						this.$router.push("/zc/receive");
					} else if(currentUser.roles.findIndex((item) => {return item === "MK";}) !== -1) {
						this.$router.push("/zc/receive");
					} else {
						this.$vux.alert.show({title: '提示',content: '无操作权限'});
					}
					break;
				case "2" : //流转(必须由MK扫码)
					if(_.findIndex(login_user.roles, function(item){return item === "MK";}) !== -1) {
						this.$router.push("/zc/receive");
					} else {
						this.$vux.alert.show({title: '提示',content: '无操作权限'});
					}
					break;
				case "3" : break;//TODO 回收
				}
				
			} else {
				errCallback.call(this);
			}
		}).bind(this);
	    scan.start(); //开始执行扫描(可以传入参数)
	},
	beforeDestroy () {
		//结束对摄像头获取图片数据进行条码识别操作，同时关闭摄像头的视频捕获
		//结束后可调用start方法重新开始识别
		scan.cancel();
		//释放控件占用系统资源，调用close方法后控件对象将不可使用
		scan.close();
	}
}
</script>
<style scope>
#scan-panel {
	background-color: #111;
}
</style>