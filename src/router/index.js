import Vue from 'vue'
import Router from 'vue-router'
import Login from  "@/pages/login"
import Index from  "@/pages/index"

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/',component: Login},
    {path: "/index",component: Index}
  ]
})
