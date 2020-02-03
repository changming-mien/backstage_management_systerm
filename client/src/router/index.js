import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import NoFind from '../views/404.vue'
import Home from '../views/Home.vue'
import InfoShow from '../views/InfoShow.vue'
import FundList from '../views/FundList.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children:[{
      path: '',
      component: Home
    },{
      path: '/home',
      component: Home
    },{
      path: '/info',
      name:'infoShow',
      component: InfoShow
    },
    {
      path: '/fundlist',
      name: 'fundlist',
      component: FundList
    }]
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '*',
    name: 'noFind',
    component: NoFind
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next)=>{
  let isLogin=localStorage.eleToken?true:false;
  if(to.path=="/login"||to.path=="/register"){
    next()
  }else{
    isLogin?next():next("/login")
  }
})
export default router
