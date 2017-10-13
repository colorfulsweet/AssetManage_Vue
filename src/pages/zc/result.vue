<!-- 资产信息搜索结果 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编码</th>
			<th>名称</th>
			<th>类别</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.zcid" v-on:click="trSelect(index)"
			v-bind:class="{selected : item.isSelected}">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td>{{item.leib}}</td>
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
export default {
  name : "result",
  data () {
	  return {
		  columns : ["编码", "名称", "类别"],
		  zcList : []
	  };
  },
  created () {
	this.$store.commit("setHeaderConf", 
		{
			hasbackbtn : true,
			title : "查询结果"
		});
	//TODO ajax
	//this.$route.query中包含查询参数
	this.zcList = [{
		uuid:"ab1",
		zcid:"1001",
		mingch:"资产1",
		leib:"11"
	},{
		uuid:"ab2",
		zcid:"1002",
		mingch:"资产2",
		leib:"22"
	}];
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
		//TODO 跳转清单页面
	}
  }
}
</script>
<style scope>
tr.selected {
	background-color: rgb(238,248,172);
}
</style>
