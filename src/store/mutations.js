// 变化
import * as types from './mutation-types'

const mutations = {
  [types.SET_SELECT_GOODS] (state, selectGoods) {
    state.selectGoods = selectGoods
  },
  [types.SET_DEFAULT_ADDRESS] (state, defaultAddress) {
    state.defaultAddress = defaultAddress
  },
  [types.SET_EDIT_ADDRESS] (state, editAddress) {
    state.editAddress = editAddress
  },
  [types.SET_ORDER_DETAIL] (state, orderDetail) {
    state.orderDetail = orderDetail
  }
}
export default mutations
