import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
	  	// 公共变量
		loading: false,
		loginInfo: {
			userData: null,
			token: null
		},
		apiUrl: 'http://192.168.31.137:9000/',
		fileUrl: 'http://192.168.31.137:9000/filebase/',
		operateList : ["出库", "流转", "盘点", "回收"],
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