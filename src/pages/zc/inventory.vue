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
<!-- 盘点详细信息dialog -->
<x-dialog hide-on-blur :show.sync="showDialog" v-on:on-hide="clearPd" class="detail-dialog">
	<div class="detail-panel">
		<group>
			<cell title="资产名称" primary="content" :value="selectIndex?zcList[selectIndex].mingch:null"></cell>
			<selector placeholder="请选择" v-model="status" title="盘点状态" direction="rtl" :options="statuses" ></selector>
			<x-input type="text" v-model="remark" title="备注信息" placeholder="请输入"
				:show-clear="true" placeholder-align="right" text-align="right" ></x-input>
			<cell title="盘点照片" primary="content" :value="imgPath ? null :'无'">
				<img v-if="imgPath" style="width:7em;height:7em" :src="$store.state.readPhotoUrl+imgPath"/>
			</cell>
		</group>
	</div>
	<div class="btn-container">
		<x-button @click.native="uploadPhoto" type="primary">上传照片</x-button>
		<x-button @click.native="pdComplete" type="primary">完成</x-button>
	</div>
</x-dialog>

</div>
</template>
<script>
import { XTable,XButton,XDialog,Group, Cell,XInput,Selector,TransferDomDirective as TransferDom } from 'vux'

export default {
	name : "inventory",
	data () {
		return {
			zcList : [],
			datailList :[],
			showDialog : false,
			selectIndex : null,
			statuses : ["正常", "损坏", "丢失"],
			status : null, //盘点状态
			remark : null, //备注信息
			imgPath : null //盘点照片的路径
		}
	},
	created () {
		this.$store.commit("setHeaderConf",{hasbackbtn : true,title : "资产盘点"});
		var _this = this;
		//查询资产数据
		this.$http.get(this.$store.state.apiUrl + "zichan/findByBgrId",{params:{
				bgrId : this.$store.state.loginInfo.userData.uuid
			}}).then((response) => {
				_this.zcList = response.data.filter((item) => {
                    //新入库的资产数据必须在进行入库拍照后才能执行盘点
                    return item.pdzt !== "新入库";
                });
			});
	},
	directives: { TransferDom },
	components : { XTable,XButton,XDialog,Group, Cell,XInput,Selector },
	methods : {
		/**
		 * 行点击事件-显示dialog
		 */
		trClick (index) {
			if(this.zcList[index].pdzt === "已盘点") {
				this.$vux.toast.text('当前资产已盘点,请勿重复操作', 'middle')
                return;
            }
			this.selectIndex = index;
			this.showDialog = true;
		},
		/**
		 * 上传盘点照片
		 */
		uploadPhoto () {
			//TODO 调用文件选择器 文件上传
			
		},
		/**
		 * 盘点完成
		 */
		pdComplete () {
			//TODO 保存盘点信息
			this.zcList[this.selectIndex].pdzt = "已盘点";
			this.showDialog = false;
		},
		/**
		 * 清除dialog当中填写的盘点信息
		 */
		clearPd () {
			this.selectIndex = null;
			var _this = this;
			setTimeout(() => {
				_this.status = null;
				_this.remark = null;
				_this.imgPath = null;
			}, 300);
		}
	}
}
</script>
<style lang="less" scope>
.detail-dialog {
	.detail-panel {
		max-height: calc(70vh);
		overflow:scroll;
	}
}
</style>