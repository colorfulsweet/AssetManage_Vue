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
<x-dialog hide-on-blur :show.sync="showDialog" class="detail-dialog" @on-hide="dialogHideCallback">
	<div class="detail-panel">
		<group>
			<cell title="资产名称" primary="content" :value="selectIndex!==null?zcList[selectIndex].mingch:null"></cell>
			<cell-form-preview :list="datailList"></cell-form-preview>
			<cell title="相关照片" primary="content" :value="!imageList || !imageList.length ? '无' : null">
				<img v-for="(imgPath,index) in imageList" v-bind:key="index" width="100" class="previewer-img"
					@click="enlargePhoto(index)" :src="$store.state.readPhotoUrl+imgPath"/>
				<previewer :list="previewerList" ref="previewer" v-if="imageList.length" 
					:options="previewerOptions" @on-close="previewerIsOpen=false"></previewer>
			</cell>
		</group>
	</div>
</x-dialog>
</div>
</template>
<script>
import { XTable,XDialog,CellFormPreview, Group, Cell,Previewer,TransferDomDirective as TransferDom } from 'vux'
var datailColumns = {ggxh:"规格",shul:"数量",ppcj:"厂家",gysDcxm:"供应商"};

export default {
    name : "my_asset",
    data () {
		return {
			zcList : [],
			datailList :[],
			selectIndex : null, //选中行的索引
			showDialog : false,
			imageList : [], //dialog当中的图片列表
			previewerOptions: {
				getThumbBoundsFn (index) {
				// 找到缩略图的元素
				let thumbnail = document.querySelectorAll('.previewer-img')[index]
				// 获取当前视窗的Y轴坐标(向下滚动了多少)
				let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
				// 获取该缩略图的定位信息
				let rect = thumbnail.getBoundingClientRect()
				return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
				}
			},
			previewerIsOpen : false //图片放大预览是否打开
		};
	},
	computed : {
		//提供给预览视图的图片列表
		previewerList () {
			return this.imageList.map((imgPath) => {
				return {src : this.$store.state.readPhotoUrl + imgPath};
			});
		}
	},
    created () {
		this.$store.commit("setHeaderConf",{hasbackbtn : true,title : "当前资产"});
		var _this = this;
		//查询资产数据
		this.$http.get(this.$store.state.apiUrl + "zichan/findByBgrId",{params:{
			bgrId : this.$store.state.loginInfo.userData.uuid
		}}).then((response) => {
			_this.zcList = response.data;
		});
    },
    directives: { TransferDom },
    components : { XTable,XDialog,CellFormPreview,Group,Cell,Previewer },
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
			var _this = this;
			//获取资产流转的最后一张照片
			this.$http.post(this.$store.state.apiUrl + "zichan/findLastPhoto", {zcid : this.zcList[index].zcid})
			.then(function(response){
				_this.imageList = response.data;
			});
		},
		/**
		 * 放大查看图片
		 * @argument index 图片的索引
		 */
		enlargePhoto (index) {
			this.$refs.previewer.show(index);
			this.previewerIsOpen = true;
		},
		/**
		 * dialog被隐藏时执行的回调函数
		 */
		dialogHideCallback () {
			if(this.$refs.previewer && this.previewerIsOpen) {
				this.$refs.previewer.close();
			}
		}
    }
}
</script>
