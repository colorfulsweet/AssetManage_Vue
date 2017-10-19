<!-- 资产信息搜索结果 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编码</th>
			<th>名称</th>
			<th>类别</th>
			<th>数量</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.zcid" v-on:click="trSelect(index)"
			v-bind:class="{selected : item.isSelected}">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td>{{item.lbie}}</td>
			<td>{{item.shul}}</td>
		</tr>
	</tbody>
</x-table>
<div class="btn-container">
	<x-button @click.native="addToList" type="primary">添加到清单</x-button>
	<x-button @click.native="showList" type="default">查看清单</x-button>
</div>
</div>
</template>

<script>
import { XTable,XButton } from 'vux'
import qs from "qs"

export default {
  name : "result",
  data () {
	  return {
		  zcList : []
	  };
  },
  created () {
	this.$store.commit("setHeaderConf", 
		{
			hasbackbtn : true,
			title : "查询结果"
		});
	var _this = this;
	this.$http.get(this.$store.state.apiUrl + "zichan/list",{params:{
		zcID : this.$route.query.zcID,
		mingch : this.$route.query.name,
		lbie : this.$route.query.type
	}}).then(function(response){
		_this.zcList = response.data;
	});
  },
  components : { XTable,XButton },
  methods : {
	/**
	 * 数据表格行点击事件函数
	 * @argument index 数据行的索引(从0开始)
	 */
	trSelect (index) {
		this.zcList.splice(index, 1, 
			Object.assign(this.zcList[index], {isSelected:!this.zcList[index].isSelected})
		);
	},
	/**
	 * "添加到清单"按钮点击事件函数
	 * 将选中的数据添加到清单
	 */
	addToList () {
		var selectedIds = this.zcList.filter(function(item){
			return item.isSelected;
		}).map(function(item){
			return item.uuid;
		});
		if(selectedIds.length == 0) {
			this.$vux.toast.text('请选择加入到清单的资产', 'middle')
			return;
		}
		//由于可以多次添加, 需要获取到上次添加的列表
		var oldList = localStorage.getItem("selectedIds");
		if(!oldList) {
			//第一次添加
			localStorage.setItem("selectedIds", JSON.stringify(selectedIds));
		} else {
			//不是第一次添加
			let currentList = JSON.parse(oldList);
			for(let index in selectedIds) {
				if(currentList.findIndex(function(item){return item===selectedIds[index]}) == -1) {
					//现有列表中没有该ID
					currentList.push(selectedIds[index]);
				}
			}
			localStorage.setItem("selectedIds", JSON.stringify(currentList));
		}
		this.$vux.toast.text('添加成功', 'middle')
	},
	/**
	 * "查看清单"按钮点击事件函数
	 */
	showList () {
		if(!localStorage.getItem("selectedIds")) {
			this.$vux.alert.show({
				title: '提示',
				content: '清单中没有任何数据'
			});
			return;
		}
		this.$router.push("/zc/list");
	}
  }
}
</script>
<style scope>
tr.selected {
	background-color: rgb(238,248,172);
}
</style>
