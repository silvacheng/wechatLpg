// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import App from './App'
import { AjaxPlugin, cookie } from 'vux'

Vue.use(AjaxPlugin)
Vue.use(VueRouter)
router.beforeEach((to, from, next) => {
  if (cookie.get('defaultAddress')) {
    if (to.path === '/') {
      next({path: '/lpgShop'})
    } else {
      next()
    }
  } else {
    next()
  }
})
FastClick.attach(document.body)

Vue.config.productionTip = false
// console.log(Vue.http.defaults.headers)
// 配置请求头
Vue.http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
