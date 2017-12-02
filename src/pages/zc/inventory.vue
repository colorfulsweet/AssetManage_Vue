<!-- 资产盘点 页面 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编码</th>
			<th>名称</th>
			<th>数量</th>
			<th>单位</th>
			<th>状态</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-on:click="trClick(index)">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td>{{item.shul}}</td>
			<td>{{item.danwei}}</td>
			<td v-bind:style="{color:(item.pdzt==='已盘点'?'green':'red')}">{{item.pdzt}}</td>
		</tr>
	</tbody>
</x-table>

</div>
</template>
<script>
import { XTable } from 'vux'

export default {
	name : "inventory",
	data () {
		return {
			zcList : []
		}
	},
	created () {
	  this.$store.commit("setHeaderConf",
			{
				hasbackbtn : true,
				title : "资产盘点"
			});
		var _this = this;
		//查询资产数据
		this.$http.get(this.$store.state.apiUrl + "zichan/findByBgrId",{params:{
				bgrId : this.$store.state.loginInfo.userData.uuid
			}}).then((response) => {
				_this.zcList = response.data;
			});
	},
	components : { XTable },
	methods : {
		trClick (index) {
					//TODO 弹出dialog输入盘点信息, 上传照片
		}
	}
}
</script>
