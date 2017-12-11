import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const port = 9000;
//阿里云主机
const host = "47.96.30.143";
//局域网主机
// const host = "192.168.31.137";
//本地
// const host = "127.0.0.1";
const apiUrl = `http://${host}:${port}/`;
const store = new Vuex.Store({
	state: {
	  	// 公共变量
		loading: false,
		loginInfo: {
			userData: null,
			token: null
		},
		apiUrl: apiUrl,
		readPhotoUrl: apiUrl + "lz/readPhoto?photoPath=",
		operateList : ["出库", "流转", "处理"],
		// 页头配置
		headerConf : {
			hasbackbtn : false,
			title : null
		},
	},
	mutations: {
		/*
		* loading的显示/隐藏
		* */
		setLoading: (state, status) => {
			state.loading = status;
		},
		/*
		* 修改header的信息
		* */
		setHeaderConf: (state, headerConf) => {
			Object.assign(state.headerConf, headerConf)
		},
		/*
		* 登陆
		* */
		login: (state,userData) => {
			localStorage.setItem('userId',userData.uuid);//登陆用户ID
			localStorage.setItem('userMsg',JSON.stringify(userData));//登陆用户其他信息
			state.loginInfo.token = userData.token;
			state.loginInfo.userData = userData;
		},
		/*
		* 注销
		* */
		logout: (state) => {
			localStorage.removeItem('userId');
			localStorage.removeItem('userMsg');
			state.loginInfo.token = null;
			state.loginInfo.userData = null;
		}
	}
});
export default store;
