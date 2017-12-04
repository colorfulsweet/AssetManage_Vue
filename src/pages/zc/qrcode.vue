<!-- 二维码展示 页面 -->
<template>
<div>
	<divider>请展示给交接方进行扫码</divider>
	<div class="qrcode-panel" >
		<img id="qrcode_img" :src="imgSrc" title="资产流转二维码"/>
	</div>
</div>
</template>
<script>
import { Divider } from 'vux'
export default {
	name : "qrcode",
	data () {
		return {
			imgSrc : null
		};
	},
	created () {
		this.$store.commit("setHeaderConf", {hasbackbtn : false,title : "二维码"});
		this.imgSrc = this.$store.state.apiUrl+'lz/outputQrcode/'+localStorage.getItem('operateId');
	},
	components : { Divider },
	methods : {
		
	}
};
</script>
<style>
.qrcode-panel {margin-top:10%; text-align:center; width:100%;}
.qrcode-panel > img {width : 80%; margin : 10% auto;}
</style>