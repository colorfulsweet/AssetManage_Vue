<!-- 搜索-表单 -->
<template>
<div>
	<group title="资产查询检索">
		<x-input type="text" v-model="zcid" title="编码" placeholder="请输入"
			:show-clear="true" placeholder-align="right" text-align="right" :max="9"></x-input>
		<div class="selector-clear" @click="clearSelector('name')" v-show="name">
			<i class="weui-icon weui_icon_clear weui-icon-clear" ></i>
		</div>
		<selector placeholder="请选择" direction="rtl" v-model="name" title="名称" :options="names" ></selector>
		<div class="selector-clear" @click="clearSelector('type')" v-show="type">
			<i class="weui-icon weui_icon_clear weui-icon-clear" ></i>
		</div>
		<selector placeholder="请选择" direction="rtl" v-model="type" title="类型" :options="types" ></selector>
	</group>
	<div class="btn-container">
		<x-button @click.native="search" type="primary">搜索</x-button>
	</div>
</div>
</template>
<script>
import { XInput, Group, XButton, Selector } from 'vux'
export default {
	name : "search",
	data () {
		return {
			operate : 1,
			zcid : null,
			name : null,
			type : null,
			names : ["办公家具", "打印机", "摄像机", "投影仪"],
			types : ["软件测试","办公设施及用品", "生活设施及用品", "临建设施物资" ,"工具化临时设施", "CT物资", "安全文明施工设施",
			"安全劳保", "仪器仪表", "机械设备", "工具用具", "自购周转料具", "功能车辆"]
		};
	},
	created () {
		this.operate = this.$route.query.operate;
		localStorage.setItem("operate", this.operate);
		this.$store.commit("setHeaderConf",
			{
				hasbackbtn : true,
				title : `${this.$store.state.operateList[this.operate-1]}流程`
			});
	},
	components : {
		XInput, Group, XButton, Selector
	},
	methods : {
		/**
		 * 执行查询
		 */
		search() {
			if(!this.zcid && !this.name && !this.type) {
				this.$vux.toast.text('请输入查询条件', 'middle');
				return;
			}
			//查询参数
			const query = {
				zcid : this.zcid ? this.zcid : '',
				name : this.name ? this.name : '',
				type : this.type ? this.type : ''
			};
			if(this.$route.query.target) {
				//传递查询参数的目标页面路由地址, 如果没有就默认到result
				this.$router.push({path:this.$route.query.target, query});
			} else {
				this.$router.push({path:"/search/result", query});
			}
		},
		/**
		 * 清空选择框
		 * @argument variable 下拉框绑定的变量名称
		 */
		clearSelector (variable) {
			this[variable] = null;
		}
	}
};
</script>
<style scope>
/* 下拉框的清空按钮 */
.selector-clear { 
	display: inline-block;
	position: absolute;
	left: 3em;
	margin-top: 0.45em;
	z-index: 100;
}
</style>