<template>
<div id="scan-panel"></div>
</template>

<script>
var scan = null;
/**
 * 销毁扫描器
 */
const destoryScan = function() {
	if(scan) {
		//结束对摄像头获取图片数据进行条码识别操作，同时关闭摄像头的视频捕获
		//结束后可调用start方法重新开始识别
		scan.cancel();
		//释放控件占用系统资源，调用close方法后控件对象将不可使用
		scan.close();
	}
}
var errCallback = function() {
	destoryScan();
	var _this = this;
	this.$vux.alert.show({
		title: '提示',
		content: '无效内容',
		onHide() {
			_this.$router.go(-1);
		}
	});
};
var successCallback = function(type, code, file){
	//type - 码的类型 - 对应plus.barcode当中的常量, 二维码是plus.barcode.QR
	//code - 扫描获取到的内容
	//file - 捕捉到的图片保存的路径(可以在开始扫描时传参指定是否保存文件)
	var content = null;
	try {
		content = JSON.parse(code.replace(/\\/g,""));
	} catch (e) {
		//内容无法被解析为JSON
		errCallback.call(this);
		return;
	}
	var currentUser = this.$store.state.loginInfo.userData;
	if(typeof content==="object" && "operateType" in content && "operateId" in content) {
		//将扫描获得的信息放在前端缓存
		localStorage.setItem("operateId", content.operateId);
		localStorage.setItem("operate", content.operateType);
		localStorage.setItem("from", "index");
		switch (content.operateType) {
		case "1" : //出库(可以由MA或者MK扫码)
			if(currentUser.roles.findIndex((item) => {return item === "MA";}) !== -1) {
				this.$router.replace("/zc/receive");
			} else if(currentUser.roles.findIndex((item) => {return item === "MK";}) !== -1) {
				this.$router.replace("/zc/receive/confirm");
			} else {
				this.$vux.alert.show({title: '提示',content: '无操作权限'});
			}
			break;
		case "2" : //流转(必须由MK扫码)
			if(currentUser.roles.findIndex((item) => {return item === "MK";}) !== -1) {
				this.$router.replace("/zc/receive");
			} else {
				this.$vux.alert.show({title: '提示',content: '无操作权限'});
			}
			break;
		case "3" : break;//TODO 回收
		}
		destoryScan();
	} else {
		errCallback.call(this);
		return;
	}
};


export default {
	name : "qrcode_scan",
	data () {
		return {}
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : true,title : "二维码扫描"});
	},
	/**
	 * 生命周期钩子 - 虚拟DOM绑定完毕之后执行
	 */
	mounted () {
		if(!("plus" in window)) {
			console.warn("请使用真机或模拟器进行调试!");
			return;
		}
		scan = new plus.barcode.Barcode('scan-panel');
		
		//扫描失败回调函数
		scan.onerror = errCallback.bind(this);
		//扫描成功的回调函数
	    scan.onmarked = successCallback.bind(this);
	    scan.start(); //开始执行扫描(可以传入参数)
	},
	/**
	 * 生命周期钩子 - 组件销毁之前执行
	 */
	beforeDestroy : destoryScan
}
</script>
<style scoped>
#scan-panel {
	background-color: #111;
}
</style>