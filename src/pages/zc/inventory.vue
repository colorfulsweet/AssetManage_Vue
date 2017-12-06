<!-- 资产盘点/处理 页面 -->
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
<div class="table-body-container">
<x-table :cell-bordered="false" >
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-on:click="trClick(index)">
			<td style="width:20%">{{item.zcid}}</td>
			<td style="width:25%">{{item.mingch}}</td>
			<td style="width:15%">{{item.shul}}</td>
			<td style="width:15%">{{item.danwei}}</td>
			<td v-bind:style="{color:(item.pdzt==='已盘点'?'green':'red')}"
				style="width:25%">{{item.pdzt}}</td>
		</tr>
	</tbody>
</x-table>
</div>
<!-- 盘点/处理 详细信息dialog -->
<x-dialog hide-on-blur :show.sync="showDialog" v-on:on-hide="clearPd" class="detail-dialog">
	<div class="detail-panel">
		<group>
			<cell title="资产名称" primary="content" :value="selectIndex?zcList[selectIndex].mingch:null"></cell>
			<selector placeholder="请选择" v-model="status" :title="type+'状态'" direction="rtl" :options="statuses" ></selector>
			<x-input type="text" v-model="remark" title="备注信息" placeholder="请输入"
				:show-clear="true" placeholder-align="right" text-align="right" ></x-input>
			<cell :title="type+'照片'" primary="content" :value="imgPath ? null :'无'">
				<img v-if="imgPath" style="width:7em;height:7em" :src="$store.state.readPhotoUrl+imgPath"/>
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
				<x-button @click.native="uploadPic" type="primary">上传照片</x-button>
				</flexbox-item>
			</flexbox>
			</flexbox-item>
			<flexbox-item>
			<x-button @click.native="pdComplete" type="default">完成</x-button>
			</flexbox-item>
		</flexbox>
	</div>
</x-dialog>

</div>
</template>
<script>
import { XTable,XButton,XDialog,Group, Cell,XInput,Selector,
		Flexbox, FlexboxItem,TransferDomDirective as TransferDom } from 'vux'

const pdStatuses = ["已盘点", "未盘点"];
export default {
	name : "inventory",
	data () {
		return {
			//从查询跳转到这里,就是处理,否则就是盘点
			type : null,
			zcList : [],
			datailList :[],
			showDialog : false,
			selectIndex : null,
			statuses : ["正常", "损坏", "丢失", "其他"],
			status : null, //盘点/处理 状态
			remark : null, //备注信息
			imgPath : null //盘点/处理 照片的路径
		}
	},
	/**
	 * 组件内的导航前置守卫
	 */
	beforeRouteEnter (to, from, next) {
		// 在渲染该组件的对应路由被 confirm 前调用
		// 不！能！获取组件实例 `this`
		// 因为当守卫执行前，组件实例还没被创建
		// 可以传一个回调给next来访问组件实例
		next(vm => {
			if(from.path === "/search") {
				vm.type = "处理";
				//查询资产数据(根据查询参数)
				vm.$http.get(vm.$store.state.apiUrl + "zichan/list",{params:{
					zcID : vm.$route.query.zcID,
					mingch : vm.$route.query.name,
					lbie : vm.$route.query.type
				}}).then((response) => {
					vm.zcList = response.data;
				});
			} else {
				vm.type = "盘点";
				//查询资产数据(根据保管人ID)
				vm.$http.get(vm.$store.state.apiUrl + "zichan/findByBgrId",{params:{
					bgrId : vm.$store.state.loginInfo.userData.uuid
				}}).then((response) => {
					vm.zcList = response.data.filter((item) => {
						//新入库的资产数据必须在进行入库拍照后才能执行盘点/处理
						//这里只显示已盘点和未盘点的
						return pdStatuses.indexOf(item.pdzt) >= 0;
					});
				});
			}
			vm.$store.commit("setHeaderConf",{hasbackbtn : true,title : `资产${vm.type}`});
		});
	},
	directives: { TransferDom },
	components : { XTable,XButton,XDialog,Group,Cell,XInput,Selector,Flexbox,FlexboxItem },
	methods : {
		/**
		 * 行点击事件-显示dialog
		 */
		trClick (index) {
			if(this.zcList[index].pdzt === `已${this.type}`) {
				this.$vux.toast.text(`当前资产已${this.type},请勿重复操作`, 'middle')
				return;
			}
			this.selectIndex = index;
			this.showDialog = true;
		},
		/**
		 * 上传盘点/处理照片
		 */
		uploadPic () {
			//TODO 调用文件选择器 文件上传
			
		},
		/**
		 * 拍照
		 */
		takePhoto () {
			if(!("plus" in window)) {
				console.warn("请使用真机或模拟器进行调试!");
				return;
			}
			var _this = this;
			//获取需要操作的摄像头对象, 1表示主摄像头, 2表示辅摄像头
			const cmr = plus.camera.getCamera(1);
			//执行拍照操作, 参数分别是 成功回调(必选),失败回调,拍照参数(必选)
			cmr.captureImage( (capturedFile) => {
				//capturedFile - 保存的文件路径
				// 上传文件
				var upload = plus.uploader.createUpload(
					_this.$store.state.apiUrl + "pd/uploadPhoto",
					{method:"POST"},
					function(response,status){ //上传完成
						//响应:response.responseText
						//TODO 在页面添加图片预览
					}
				);
				upload.addData("zcUuid", _this.zcList[_this.selectIndex].uuid);
				upload.addFile(capturedFile, {});
				upload.start(); //开始执行上传

			}, (err) => {
				_this.$vux.alert.show({ title: "提示",content: "拍照出错:"+err.toString() });
			}, {filename:'_doc/camera/',index:1} );
		},
		/**
		 * 盘点/处理 完成
		 */
		pdComplete () {
			if(!this.status) {
				this.$vux.toast.text(`请选择当前资产${this.type}状态`, 'middle');
				return;
			}
			if(!this.imgPath) {
				this.$vux.toast.text(`请上传资产${this.type}照片`, 'middle');
                return;
            }
			var _this = this;
			//保存盘点/处理信息
			this.$http.post(this.$store.state.apiUrl + "pd/save", {
				fkZichanUuid : this.zcList[this.selectIndex].uuid, //资产uuid
				fkZichanZcid : this.zcList[this.selectIndex].zcid, //资产编码
				status : this.status, //盘点/处理状态 : 正常 损坏 丢失 其他
				photoPath : this.imgPath, //照片路径
				pdbz : this.remark, //盘点/处理备注
				pdzt : `已${this.type}` 
			}).then((response) => {
				_this.zcList[_this.selectIndex].pdzt = `已${_this.type}`;
				_this.showDialog = false;
			});
		},
		/**
		 * 清除dialog当中填写的盘点/处理信息
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
<style scope>
.detail-dialog .detail-panel {
	max-height: calc(70vh);
	overflow:scroll;
}
.weui-cell__hd {
	text-align: left;
}
.table-body-container {
	max-height: calc(100vh - 5.4em);
}
</style>