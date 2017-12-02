<!-- 当前资产 页面 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编码</th>
			<th>名称</th>
			<th>数量</th>
			<th>单位</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-on:click="trClick(index)">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td>{{item.shul}}</td>
			<td>{{item.danwei}}</td>
		</tr>
	</tbody>
</x-table>
<x-dialog hide-on-blur :show.sync="showDialog" class="detail-dialog">
	<div class="detail-panel">
		<group>
			<cell title="资产名称" primary="content" :value="selectIndex?zcList[selectIndex].mingch:null"></cell>
			<cell-form-preview :list="datailList"></cell-form-preview>
		</group>
	</div>
</x-dialog>
</div>
</template>
<script>
import { XTable,XDialog,CellFormPreview, Group, Cell,TransferDomDirective as TransferDom } from 'vux'
var datailColumns = {ggxh:"规格",shul:"数量",ppcj:"厂家",gysDcxm:"供应商"};

export default {
    name : "my_asset",
    data () {
		return {
			zcList : [],
			datailList :[],
			selectIndex : null, //选中行的索引
			showDialog : false
		};
    },
    created () {
		this.$store.commit("setHeaderConf",
			{
				hasbackbtn : true,
				title : "当前资产"
			});
		var _this = this;
		//查询资产数据
		this.$http.get(this.$store.state.apiUrl + "zichan/findByBgrId",{params:{
			bgrId : this.$store.state.loginInfo.userData.uuid
		}}).then((response) => {
			_this.zcList = response.data;
		});
    },
    directives: { TransferDom },
    components : { XTable,XDialog,CellFormPreview,Group,Cell },
    methods : {
        /**
         * 表格行点击事件函数
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
        }
    }
}
</script>
