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
    },
    {
      path: '/confirmOrder',
      component: function (resolve) {
        require(['../components/confirm-order/confirm-order.vue'], resolve)
      }
    },
    {
      path: '/orderCenter',
      component: function (resolve) {
        require(['../components/order-center/order-center.vue'], resolve)
      }
    },
    {
      path: '/addressManage',
      component: function (resolve) {
        require(['../components/address-manage/address-manage.vue'], resolve)
      }
    },
    {
      path: '/addressEdit',
      component: function (resolve) {
        require(['../components/address-edit/address-edit.vue'], resolve)
      }
    }
  ]
})
