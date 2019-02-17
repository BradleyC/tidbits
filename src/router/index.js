import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Team from '@/components/Team'
import Dappmin from '@/components/Dappmin'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/team',
      name: 'Team',
      component: Team
    },
    {
      path: '/dappmin',
      name: 'Dappmin',
      component: Dappmin
    }
  ]
})
