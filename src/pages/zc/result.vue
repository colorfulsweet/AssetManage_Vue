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
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-on:click="trClick(index)"
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
<!-- 详细信息dialog -->
<x-dialog hide-on-blur :show.sync="showDialog" class="detail-dialog">
	<div class="detail-panel">
		<group>
			<cell title="资产名称" primary="content" :value="selectIndex?zcList[selectIndex].mingch:null"></cell>
			<cell-form-preview :list="datailList"></cell-form-preview>
			<cell title="相关照片" primary="content" :value="!imageList || !imageList.length ? '无' : null">
				<img v-for="(imgPath,index) in imageList" v-bind:key="index" 
					style="width:7em;height:7em" :src="$store.state.readPhotoUrl+imgPath"/>
			</cell>
		</group>
	</div>
	<div class="btn-container">
		<x-button @click.native="selectZc" :type="selectIndex===null||!zcList[selectIndex].isSelected?'primary':'warn'">
			{{selectIndex===null||!zcList[selectIndex].isSelected?'选中':'取消选中'}}
		</x-button>
	</div>
</x-dialog>
</div>
</template>

<script>
import { XTable,XButton,XDialog,CellFormPreview, Group, Cell,TransferDomDirective as TransferDom } from 'vux'
//详情dialog当中包含的字段
const datailColumns = {ggxh:"规格",shul:"数量",ppcj:"厂家",gysDcxm:"供应商"};

export default {
	name : "result",
	data () {
		return {
			zcList : [],
			datailList :[],
			selectIndex : null, //选中行的索引
			showDialog : false,
			imageList : []
		};
	},
	created () {
		this.$store.commit("setHeaderConf",{hasbackbtn : true,title : "查询结果"});
		var _this = this;
		//查询资产数据
		this.$http.get(this.$store.state.apiUrl + "zichan/list",{params:{
			zcID : this.$route.query.zcID,
			mingch : this.$route.query.name,
			lbie : this.$route.query.type
		}}).then((response) => {
			_this.zcList = response.data;
		});
	},
	directives: { TransferDom },
	components : { XTable,XButton,XDialog,CellFormPreview,Group,Cell },
	methods : {
		/**
		* 数据表格行点击事件函数
		* @argument index 数据行的索引(从0开始)
		*/
		trClick (index) {
			this.selectIndex = index;
			this.showDialog = true;
			var datailList = [];
			for(let name in this.zcList[index]) {
				if(name in datailColumns) {
					datailList.push({
						label : datailColumns[name],
						value : this.zcList[index][name]
					});
				}
			}
			this.datailList = datailList;
			var _this = this;
			//获取资产流转的最后一张照片
			this.$http.post(this.$store.state.apiUrl + "zichan/findLastPhoto", {zcid : this.zcList[index].zcid})
			.then(function(response){
				_this.imageList = response.data;
			});
		},
		/**
		* 选中/取消选中当前选择的资产数据
		*/
		selectZc () {
			this.showDialog = false;
			var _this = this;
			var isSelected = !this.zcList[this.selectIndex].isSelected;
			setTimeout(()=>{
				_this.zcList.splice(_this.selectIndex, 1,
					Object.assign(_this.zcList[_this.selectIndex], {isSelected})
				);
			},300);
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
				this.$vux.toast.text('请选择加入到清单的资产', 'middle');
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
			var selectedIds = localStorage.getItem("selectedIds");
			if(!selectedIds || !JSON.parse(selectedIds).length) {
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
<style lang="less" scope>
tr.selected {
	background-color: rgb(238,248,172);
}
.detail-dialog {
	.detail-panel {
		max-height: calc(70vh);
		overflow:scroll;
	}
}
</style>
