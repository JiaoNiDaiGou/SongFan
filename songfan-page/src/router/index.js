import Vue from 'vue'
import Router from 'vue-router'
import Cart from '@/components/Cart'
import Menu from '@/components/Menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
