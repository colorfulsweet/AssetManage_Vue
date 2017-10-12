import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
	  // 公共变量
	  comm: {
		loading: false,
		loginInfo: {
		  userId: null,
		  userData: null
		},
		apiUrl: 'http://127.0.0.1:8080/',
		fileUrl: 'http://127.0.0.1:8080/filebase/',
		operateList : ["出库", "流转", "盘点", "回收"]
	  },
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
		state.comm.loading = status
	  },
	  /*
	   * 修改header的信息
	   * */
	  setHeaderConf: (state, data) => {
		Object.assign(state.headerConf, data)
	  },
	  /*
	   * 登陆
	   * */
	  login: (state,data) => {
		localStorage.setItem('userId',data.uuid);//登陆用户ID
		localStorage.setItem('userMsg',JSON.stringify(data));//登陆用户其他信息
		state.comm.loginInfo.userId = data.uuid;
		state.comm.loginInfo.userData = data;
	  },
	  /*
	   * 注销
	   * */
	  logout: (state,data) => {
		localStorage.removeItem('userId');
		localStorage.removeItem('userMsg');
		state.comm.loginInfo.userId = null;
		state.comm.loginInfo.userData = null;
	  }
	}
});
export default store;