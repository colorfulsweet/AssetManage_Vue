import Vue from 'vue'
import Router from 'vue-router'
import Login from  "@/pages/login"
import Index from  "@/pages/index"
import Search from "@/pages/search"

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/',component: Login},
    {path: "/index",component: Index},
    {path: "/search/:operate",component: Search}
  ]
})
