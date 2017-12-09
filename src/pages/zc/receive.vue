<!-- 资产交接方上传资产照片页面 -->
<template>
<div>
<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编码</th>
			<th>名称</th>
			<th>类别</th>
			<th>照片</th>
		</tr>
	</thead>
	<tbody id="tableBody">
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-on:click="trClick(index)"
			v-bind:class="{selected : index===selectItemIndex}">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td>{{item.lbie}}</td>
			<td><div v-if="item.hasPic" class="img-preview" :style="item.previewStyle"></div></td>
		</tr>
	</tbody>
</x-table>
<group v-if="from === 'noQrcode'">
	<x-input type="text" v-model="targetTel" title="手机号" placeholder="请输入对方手机号码" required 
		:show-clear="true" placeholder-align="right" text-align="right"></x-input>
</group>
<div class="btn-container">
	<x-button @click.native="takePhoto" type="default">拍照</x-button>
	<x-button @click.native="uploadPic" type="default">上传图片</x-button>
	<x-button @click.native="finished" type="primary">完成</x-button>
</div>
</div>
</template>
<script>
import { XTable,XButton,Group,XInput } from 'vux'
// import NativePicHandle from "../native/takephoto"
var NativePicHandle = null;
import(/* webpackChunkName: "native" */ "../native/takephoto").then(moduleObj => {
	NativePicHandle = moduleObj;
});
var updatePreview = function(response,status) {
	var picPath = JSON.parse(response.responseText).data;
	var picUrl = this.$store.state.apiUrl + "lz/readPhoto?photoPath="+picPath;
	this.zcList[this.selectItemIndex].previewStyle = {
		"background-image" : `url(${picUrl})`,
		"width" : "7em",
		"height" : "7em"
	}
	this.zcList[this.selectItemIndex].hasPic = true; //在该数据上标识已有图片
};

export default {
	name : "receive",
	data () {
		return {
			zcList : [],
			selectItemIndex : null, //选中行的索引
			operateId : localStorage.getItem("operateId"), //操作ID
			operate : localStorage.getItem("operate") || 1, //操作类型
			from : localStorage.getItem("from"), //从哪跳转到这个页面来的
			targetTel : null //交接方手机号码
		}
	},
	components : { XTable,XButton,Group,XInput },
	created() {
		var _this = this;
		this.$store.commit("setHeaderConf", 
			{
				hasbackbtn : true,
				title : `${this.$store.state.operateList[this.operate-1]}清单`
			});
		//根据操作ID查询资产数据
		this.$http.post(this.$store.state.apiUrl + "zichan/getByOperateId", {operateId : this.operateId})
			.then((response) => {
				_this.zcList = response.data;
			});
	},
	methods : {
		/**
		 * 表格行点击事件
		 */
		trClick (index) {
			if(this.zcList[index].isSelected) {
				//该行当前在被选中的状态
				this.zcList[index].isSelected = false;
				this.selectItemIndex = null;
			} else {
				//该行当前在未被选中的状态
				if(this.selectItemIndex || this.selectItemIndex===0) {
					this.zcList[this.selectItemIndex].isSelected = false;
				}
				this.selectItemIndex = index;
				this.zcList[index].isSelected = true;
			}
		},
		/**
		 * 拍照 按钮点击事件
		 */
		takePhoto () {
			NativePicHandle.takePhoto({
				uploadUrl : this.$store.state.apiUrl + "lz/uploadPhoto",
				params : {operateId : this.operateId, zcId : this.zcList[this.selectItemIndex].uuid},
				successCb : updatePreview,
				context : this,
				fileKey : "uploadPhoto"
			});
		},
		/**
		 * 上传图片 按钮点击事件
		 */
		uploadPic () {
			NativePicHandle.selectPic({
				uploadUrl : this.$store.state.apiUrl + "lz/uploadPhoto",
				params : {operateId : this.operateId, zcId : this.zcList[this.selectItemIndex].uuid},
				successCb : updatePreview,
				context : this,
				fileKey : "uploadPhoto"
			});
		},
		/**
		 * "完成"按钮点击事件
		 */
		finished () {
			//检验是否所有要执行流转的资产都已经上传照片
			if(! this.zcList.every((item) => { return item.hasPic; }) ) {
				this.$vux.toast.text('请为所有的资产上传对应照片', 'middle');
                return;
            }
			switch(this.from) {
			case "noQrcode" : //对方无法扫码 -> 跳转至本页面
				if(!this.targetTel) {
					this.$vux.toast.text('请输入对方手机号码', 'middle');
					return;
				}
				var _this = this;
				this.$http.post(this.$store.state.apiUrl + "lz/saveTargetTel", {
					operateId : this.operateId,
					operate : this.operate,
					targetTel : this.targetTel
				}).then(function(response){
					if(!response.data.status) {
						this.$vux.toast.text(response.data.msg, 'middle');
						return;
					}
					_this.$router.push("/zc/receive/confirm");
				});
				return;
			case "index" : //扫码操作后解析二维码 -> 跳转至本页面
				this.$router.push("/zc/receive/confirm");
				break;
			case "qrcode" : //二维码展示页面等待对方扫码确认完成 -> 跳转至本页面
				this.$router.push("/zc/receive/count");
				break;
			}

		}
	}
}
</script>

<style lang="less" scope>
tr.selected {
	background-color: rgb(238,248,172);
}
//图片预览
.img-preview {
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center center;
}
</style>