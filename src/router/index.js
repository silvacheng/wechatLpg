import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: function (resolve) {
        require(['../components/add-address/add-address.vue'], resolve)
      }
    },
    {
      path: '/lpgshop',
      component: function (resolve) {
        require(['../components/lpgshop/lpgshop.vue'], resolve)
      }
    }
  ]
})
