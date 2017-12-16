<!-- 流转清单(保存在缓存当中的数据) -->
<template>
<div>
	<x-table :cell-bordered="false" >
	<thead>
		<tr style="background-color: #F7F7F7">
			<th>编号</th>
			<th>名称</th>
			<th>数量</th>
			<th>单位</th>
			<th>移除</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item,index) in zcList" :key="item.uuid" v-bind:class="{selected : item.isSelected}">
			<td>{{item.zcid}}</td>
			<td>{{item.mingch}}</td>
			<td><input class="table_input" :value="item.shul" v-on:change="numChange(index)"/></td>
			<td>{{item.danwei}}</td>
			<td><span class="vux-close" v-on:click="removeItem(index)"></span></td>
		</tr>
	</tbody>
	</x-table>
	<div class="btn-container">
		<flexbox orient="vertical">
			<flexbox-item>
			<flexbox>
			<flexbox-item><x-button @click.native="toQrcode" type="primary">生成二维码</x-button></flexbox-item>
			<flexbox-item><x-button @click.native="toReceive" type="primary" :plain="true">对方无法扫码</x-button></flexbox-item>
			</flexbox>
			</flexbox-item>
			<flexbox-item>
			<x-button @click.native="continueSearch" type="default">继续检索添加</x-button>
			</flexbox-item>
		</flexbox>
	</div>
</div>
</template>
<script>
import { XTable,XButton,Flexbox,FlexboxItem } from 'vux'

export default {
	name : "zc_list",
	data () {
		return {
			operate : localStorage.getItem("operate") || 1,
			zcList : []
		}
	},
	created () {
		var selectIds = localStorage.getItem("selectedIds");
		this.$store.commit("setHeaderConf", 
			{
				hasbackbtn : true,
				title : `${this.$store.state.operateList[this.operate-1]}清单`
			});
		var _this = this;
		this.$http.get(this.$store.state.apiUrl+"zichan/list",
			{params:{uuids:JSON.parse(selectIds).join(",")}})
			.then(function(response){
				_this.zcList = response.data;
			});
	},
	components : { XTable,XButton,Flexbox,FlexboxItem },
	methods : {
		/**
		 * 数量输入框修改事件函数
		 * @param {number} index 数据对应的索引 
		 */
		numChange (index) {
			var newVal = parseFloat(event.currentTarget.value);//新值
			//新值不合法的情况下, 将输入框赋值为上一个有效的值
			if(Number.isNaN(newVal) || newVal<=0) {
				this.$vux.toast.text('请输入有效的数字(必须大于0)', 'middle');
				event.currentTarget.value = this.zcList[index].zcNum || this.zcList[index].shul;
				return;
			}
			if(newVal > this.zcList[index].shul) {//原始值(新值不能超过该值)
				this.$vux.toast.text(
					`${this.$store.state.operateList[this.operate-1]}数量不能超过当前库存数量:${this.zcList[index].shul}`,'middle');
				event.currentTarget.value = this.zcList[index].zcNum || this.zcList[index].shul;
				return;
			}
			event.currentTarget.value = newVal;
			this.zcList[index].zcNum = newVal;
		},
		/**
		 * 生成二维码
		 */
		toQrcode () {
			if(!this.zcList.length) {
				this.$vux.toast.text('清单中没有任何数据', 'middle');
				return;
			}
			var zcInfo = {};
			this.zcList.forEach(function(item){
				zcInfo[item.uuid] = item.zcNum || item.shul;
			});
			this.saveLzxx(function(){
				// 跳转到二维码展示页面
				this.$router.push("/zc/list/qrcode");
			}, zcInfo);
		},
		/**
		 * 继续检索添加
		 */
		continueSearch () {
			this.$router.push(`/search?operate=${this.operate}`);
		},
		/**
		 * 对方无法扫码
		 */
		toReceive () {
			if(!this.zcList.length) {
				this.$vux.toast.text('清单中没有任何数据', 'middle');
				return;
			}
			var zcInfo = {};
			this.zcList.forEach(function(item){
				zcInfo[item.uuid] = item.zcNum || item.shul;
			});
			this.saveLzxx(function(){
				localStorage.setItem("from", "noQrcode");
				// 跳转到接收页面
				this.$router.replace("/zc/receive");
			}, zcInfo);
		},
		/**
		 * 移除清单中的项目
		 * @argument index 要移除条目的索引(从0开始)
		 */
		removeItem (index) {
			this.zcList.splice(index, 1);
			var selectIds = this.zcList.map(function(item) {
				return item.uuid;
			});
			localStorage.setItem("selectedIds", JSON.stringify(selectIds));
		},
		/**
		 * 保存流转信息
		 * @param {function} callback 保存完成之后的回调函数(可以执行页面跳转) 
		 * @param {object} zcInfo 资产信息 资产ID:数量 键值对结构, 如 {"1001":10,"1002":5.6}
		 */
		saveLzxx (callback, zcInfo) {
			var _this = this;
			this.$http.post(this.$store.state.apiUrl + "lz/save", {
				bgrId : this.$store.state.loginInfo.userData.uuid,
				zcInfo : JSON.stringify(zcInfo),
				operate : localStorage.getItem("operate")
			}).then((response) => {
				localStorage.removeItem("selectedIds");
				localStorage.setItem("operateId", response.data);
				if(typeof callback === "function") {
					callback.call(_this);
				}
			});
		}
	}
}
</script>
<style scoped lang="less">
@import '~vux/src/styles/close.less';
.vux-table .table_input {
	width: 3.5em;
	height: 1.4em;
	line-height: 1.4em;
	text-align: center;
}
</style>
