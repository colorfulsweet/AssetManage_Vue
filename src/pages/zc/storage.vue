<!-- 资产入库 页面 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th style="width:20%">编码</th>
			<th style="width:25%">名称</th>
			<th style="width:15%">数量</th>
			<th style="width:15%">单位</th>
			<th style="width:25%">状态</th>
		</tr>
	</thead>
</x-table>
<div class="table-body-container" >
<x-table :cell-bordered="false" >
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-on:click="trClick(index)">
			<td style="width:20%">{{item.zcid}}</td>
			<td style="width:25%">{{item.mingch}}</td>
			<td style="width:15%">{{item.shul}}</td>
			<td style="width:15%">{{item.danwei}}</td>
			<td style="width:25%">{{item.pdzt}}</td>
		</tr>
	</tbody>
</x-table>
</div>
<divider v-if="showTip">没有符合条件的数据</divider>
<!-- 盘点/处理 详细信息dialog -->
<x-dialog hide-on-blur :show.sync="showDialog" v-on:on-hide="clearRk" class="detail-dialog">
	<div class="detail-panel">
		<group>
			<cell title="资产名称" primary="content" :value="selectIndex!==null?zcList[selectIndex].mingch:null"></cell>
			<x-input type="text" v-model="remark" title="备注信息" placeholder="请输入"
				:show-clear="true" placeholder-align="right" text-align="right" ></x-input>
			<cell title="入库照片" primary="content" :value="imgPath ? null :'无'">
				<img v-if="imgPath" style="width:7em;height:7em" :src="$store.state.readPhotoUrl + imgPath"/>
			</cell>
		</group>
	</div>
	<div class="btn-container">
		<flexbox orient="vertical">
			<flexbox-item>
			<flexbox>
				<flexbox-item>
				<x-button @click.native="takePhoto" type="primary">拍照</x-button>
				</flexbox-item>
				<flexbox-item>
				<x-button @click.native="selectPic" type="primary">上传照片</x-button>
				</flexbox-item>
			</flexbox>
			</flexbox-item>
			<flexbox-item>
			<x-button @click.native="rkComplete" type="default">完成</x-button>
			</flexbox-item>
		</flexbox>
	</div>
</x-dialog>
</div>
</template>
<script>
import { XTable,XButton,XDialog,Group, Cell,XInput,Selector,Divider,
		Flexbox, FlexboxItem,TransferDomDirective as TransferDom } from 'vux'
var NativePicHandle = null;
import(/* webpackChunkName: "native" */ "../native/takephoto").then(moduleObj => {
	NativePicHandle = moduleObj;
});

//上传成功的回调函数
const uploadCallback = function(response,status) {
	this.$vux.toast.text("上传成功", 'bottom');
	var result = JSON.parse(response.responseText);
	// 在页面添加图片预览
	this.imgPath = result.data;
}
export default {
	name : "storage",
	data () {
		return {
			zcList : [],
			showTip : false,
			showDialog : false,
			selectIndex : null,
			remark : null, //备注信息
			imgPath : null //入库 照片的路径
		};
	},
	created () {
		var _this = this;
		this.$http.get(this.$store.state.apiUrl + "zichan/findByBgrId",{params:{
			bgrId : this.$store.state.loginInfo.userData.uuid
		}}).then((response) => {
			_this.zcList = response.data.filter((item) => {
				//在该页面只显示新入库的资产数据(在web端录入之后的盘点状态)
				return item.pdzt === '新入库';
			});
			if(!_this.zcList.length) {
				_this.showTip = true;
			}
		});
		this.$store.commit("setHeaderConf",{hasbackbtn : true,title : "资产入库"});
	},
	directives: { TransferDom },
	components : { XTable,XButton,XDialog,Group,Cell,XInput,Selector,Flexbox,FlexboxItem,Divider },
	methods : { 
		/**
		 * 行点击事件-显示dialog
		 */
		trClick (index) {
			this.selectIndex = index;
			this.showDialog = true;
		},
		/**
		 * 清除dialog当中填写的入库信息
		 */
		clearRk () {
			this.selectIndex = null;
			var _this = this;
			setTimeout(() => {
				_this.remark = null;
				_this.imgPath = null;
			}, 300);
		},
		/**
		 * 入库完成(该条数据从列表移除)
		 */
		rkComplete () {
			if(!this.imgPath) {
				this.$vux.toast.text("请上传资产入库照片", 'middle');
				return;
			}
			var _this = this;
			this.$http.post(this.$store.state.apiUrl + "pd/rkSave", {
				fkZichanUuid : this.zcList[this.selectIndex].uuid, //资产uuid
				fkZichanZcid : this.zcList[this.selectIndex].zcid, //资产编码
				photoPath : this.imgPath, //照片路径
				pdbz : this.remark //备注
			}).then((response) => {
				_this.zcList.splice(_this.selectIndex, 1);
				_this.selectIndex = null;
				_this.$vux.toast.text(response.data.msg, 'middle');
				_this.showDialog = false;
			})
		},
		/**
		 * 上传盘点/处理照片
		 */
		selectPic () {
			NativePicHandle.selectPic({
				uploadUrl : this.$store.state.apiUrl + "pd/uploadPhoto",
				params : {zcUuid : this.zcList[this.selectIndex].uuid},
				successCb : uploadCallback,
				context : this,
				fileKey : "uploadPhoto"
			});
		},
		/**
		 * 拍照
		 */
		takePhoto () {
			NativePicHandle.takePhoto({
				uploadUrl : this.$store.state.apiUrl + "pd/uploadPhoto",
				params : {zcUuid : this.zcList[this.selectIndex].uuid},
				successCb : uploadCallback,
				context : this,
				fileKey : "uploadPhoto"
			});
		},
	}
}
</script>
<style>
.detail-dialog .detail-panel {
	max-height: calc(70vh);
	overflow:scroll;
}
.weui-cell__hd {
	text-align: left;
}
.table-body-container {
	max-height: calc(100% - 2.5em);
}
</style>