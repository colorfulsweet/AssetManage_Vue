<!-- 我的记录 页面 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>资产名称</th>
			<th>数量</th>
			<th>交接方</th>
			<th>时间</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in lzList" :key="item.uuid" v-show="index<2 || showMore">
			<td>{{item.zcName}}</td>
			<td>{{item.shul}}</td>
			<td>{{item.jjf}}</td>
			<td>{{item.lzsj}}</td>
		</tr>
	</tbody>
</x-table>
<div v-on:click="showMore=!showMore">
    <load-more v-show="lzList.length>2" :show-loading="false" :tip="showMore ? '收起' : '更多'" ></load-more>
</div>
</div>
</template>
<script>
import { XTable,LoadMore } from 'vux'

export default {
    name : "my_asset",
    data () {
		return {
        	lzList : [], //流转信息列表
        	showMore : false //是否显示更多
		};
    },
    created () {
		this.$store.commit("setHeaderConf", 
			{
				hasbackbtn : true,
				title : "我的记录"
			});
		var _this = this;
		//查询与当前用户相关的流转数据
		this.$http.get(this.$store.state.apiUrl + "lz/findRecordByBgr",{params:{
			bgrId : this.$store.state.loginInfo.userData.uuid
		}}).then((response) => {
			_this.lzList = response.data;
		});
    },
    components : { XTable,LoadMore }
}
</script>