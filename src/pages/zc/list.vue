<template>
<div>
	<x-table :cell-bordered="false" >
    <thead>
      <tr style="background-color: #F7F7F7">
        <th>序号</th>
        <th>编号</th>
        <th>名称</th>
        <th>数量</th>
        <th>单位</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in zcList" :key="item.zcid" v-bind:class="{selected : item.isSelected}">
        <td>{{item.zcid}}</td>
        <td>{{item.mingch}}</td>
        <td>{{item.leib}}</td>
        <td>{{item.shul}}</td>
        <td>{{item.danwei}}</td>
      </tr>
    </tbody>
  </x-table>
  <div class="btn-container">
    <x-button @click.native="toQrcode" type="primary">生成二维码</x-button>
    <x-button @click.native="continueSearch" type="primary">继续检索添加</x-button>
    <x-button @click.native="toReceive" type="default">对方无法扫码</x-button>
  </div>
</div>
</template>
<script>
import { XTable,XButton } from 'vux'
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
			title : `${this.$store.state.comm.operateList[this.operate-1]}清单`
		});
    //TODO ajax
    // ----TEST----
    this.zcList = [{
      uuid:"ab1",
      zcid:"1001",
      mingch:"资产1",
      leib:"11",
      shul:1,
      danwei:"个"
    },{
      uuid:"ab2",
      zcid:"1002",
      mingch:"资产2",
      leib:"22",
      shul:1,
      danwei:"个"
    }];
    // ------------

  },
  components : { XTable,XButton },
  methods : {
    /**
     * 生成二维码
     */
    toQrcode () {

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

    }
  }
  
}
</script>

