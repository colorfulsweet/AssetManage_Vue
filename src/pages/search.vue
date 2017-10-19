<!-- 搜索-表单 -->
<template>
<div>
	<group title="资产查询检索">
		<x-input type="text" v-model="zcID" title="编码" placeholder="请输入" :show-clear="true" placeholder-align="right" text-align="right"></x-input>
		<selector placeholder="请选择" v-model="name" title="名称" name="name" :options="names" ></selector>
		<selector placeholder="请选择" v-model="type" title="类型" name="type" :options="types" ></selector>
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
			zcID : null,
			name : null,
			type : null,
			names : ["办公家具", "打印机", "摄像机", "投影仪"],
			types : ["软件测试","办公设施及用品", "生活设施及用品", "临建设施物资" ,"工具化临时设施", "CT物资", "安全文明施工设施",
            "安全劳保", "仪器仪表", "机械设备", "工具用具", "自购周转料具", "功能车辆"]
		};
	},
	created : function(){
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
		search() {
			if(!this.zcID && !this.name && !this.type) {
				this.$vux.toast.text('请输入查询条件', 'middle');
				return;
			}
			this.$router.push(`/search/result?` +
				`zcID=${this.zcID?this.zcID:''}&` +
				`name=${this.name?this.name:''}&` +
				`type=${this.type?this.type:''}`);
		}
	}
};
</script>