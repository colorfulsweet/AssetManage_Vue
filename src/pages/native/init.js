//
// ==========================================
// 应用初始化相关操作
// ==========================================
//

var readyToExit = false;
/**
 * 安卓物理按键"返回"执行的回调函数
 */
function backBtnCallback() {
	if(this.$store.state.headerConf.hasbackbtn) {
		//在有返回按钮的页面 按下返回物理按键, 执行普通回退操作
		this.$router.go(-1);
	} else {
		//在无返回按钮的页面 首次按返回物理按键，提示‘再按一次退出应用’
		if(readyToExit) {
			plus.runtime.quit();
			return;
		}
		plus.nativeUI.toast('再按一次退出应用');
		readyToExit = true;
		setTimeout(() => { //两次按键在1秒的间隔内, 则退出程序
			readyToExit = false;
		}, 1000);
	}
}

export default {
	run (context) {
		if(!("plus" in window)) {
			return;
		}
		// 添加物理按键"返回"执行的操作
		plus.key.addEventListener( "backbutton", backBtnCallback.bind(context), false );
	}
}