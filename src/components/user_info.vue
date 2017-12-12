<template>
<div id='user-info' v-if="realname">
    <i class="fa fa-user" ></i>
    <span >{{realname}}</span>
</div>
</template>

<script>
export default {
  name : "user_info",
  props : {
    realname : {
        type : String,
        default : null
    }
  }
}
</script>

<style scope>
#user-info {
    position: absolute;
    z-index: 102;
    right: 0.3em;
    height: 2.9em;
    line-height: 2.9em;
    color: white;
}
</style>