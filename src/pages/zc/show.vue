<!-- 接收方资产清单展示 页面 -->
<template>
<div>
	<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编号</th>
			<th>名称</th>
			<th>类别</th>
			<th>数量</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-bind:class="{selected : item.isSelected}">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td>{{item.lbie}}</td>
			<td>{{item.shul}}</td>
		</tr>
	</tbody>
	</x-table>
	<div class="btn-container">
		<x-button @click.native="confirm" type="primary">确定</x-button>
	</div>
</div>
</template>
<script>
import { XTable,XButton } from 'vux'

export default {
	name : "zc_list",
	data () {
		return {
			zcList : [],
			operateId : localStorage.getItem("operateId"),
			operate : localStorage.getItem("operate") || 1
		}
	},
	created () {
		var selectIds = localStorage.getItem("selectedIds");
		this.$store.commit("setHeaderConf", 
			{
				hasbackbtn : true,
				title : `资产${this.$store.state.operateList[this.operate-1]}清单`
			});
		var _this = this;
		this.$http.post(this.$store.state.apiUrl + "zichan/getByOperateId",
			{operateId : this.operateId})
			.then((response) => {
				_this.zcList = response.data;
			});
	},
	components : { XTable,XButton },
	methods : {
		/**
		 * 确定
		 */
		confirm () {
			this.$router.push("/zc/receive/confirm");
		}
	}
}
</script>
