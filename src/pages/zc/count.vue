<!-- 统计信息页面 -->
<template>
<div>
	<group>
		<cell title="资产种类数量" :value="countData.typeCount"></cell>
		<cell-form-preview :list="datailList"></cell-form-preview>
	</group>
	<div class="btn-container">
		<x-button @click.native="backToIndex" type="primary">返回首页</x-button>
	</div>
</div>
</template>

<script>
import { Group,Cell,CellFormPreview,XButton } from 'vux'

const detailColumns = {lyr : "领用人",bz : "备注", rq: "日期", photoNum:"照片数量"};
export default {
	name : "count",
	data () {
		var operate = localStorage.getItem("operate") || 1;
		var operateId = localStorage.getItem("operateId");
		return {
			countData : {},
			operate ,
			operateId ,
			datailList : [{
				label : this.$store.state.operateList[operate-1]+'记录编号',
				value : operateId
			}]
		}
	},
	components : { Group,Cell,CellFormPreview,XButton },
	created () {
		this.$store.commit("setHeaderConf",{
			hasbackbtn : true,
			title : `资产${this.$store.state.operateList[this.operate-1]}统计`
		});
		localStorage.removeItem("operateId");
		localStorage.removeItem("operate");
		if(!this.operateId) {
			return;
		}
		var _this = this;
		this.$http.get(this.$store.state.apiUrl+"lz/count/"+this.operateId)
			.then((response) => {
				_this.countData = response.data.data;
				for(let name in _this.countData) {
					if(!(name in detailColumns)) {
						continue;
					}
					_this.datailList.push({
						label : detailColumns[name],
						value : _this.countData[name]
					});
				}
			});
	},
	methods : {
		backToIndex () {
			//返回首页
			this.$router.replace("/index/main");
		}
	}
}
</script>