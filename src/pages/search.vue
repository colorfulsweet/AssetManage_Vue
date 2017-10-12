<template>
<div>
	<x-header>{{operateList[operate-1]}}流程</x-header>
	
</div>
</template>
<script>
import { XHeader, Group  } from 'vux'
export default {
	name : "index",
	data () {
		return {
			operate : 1,
			operateList : ["出库", "流转", "回收"]
		};
	},
	created : function(){
		this.operate = this.$route.params.operate;
	},
	components : {
		XHeader, Group
	},
	methods : {

	}
};
</script>