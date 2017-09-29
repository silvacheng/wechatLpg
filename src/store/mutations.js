// 变化
import * as types from './mutation-types'

const mutations = {
  [types.SET_SELECT_GOODS] (state, selectGoods) {
    state.selectGoods = selectGoods
  },
  [types.SET_SELECT_ADDRESS] (state, selectAddress) {
    state.selectAddress = selectAddress
  },
  [types.SET_EDIT_ADDRESS] (state, editAddress) {
    state.editAddress = editAddress
  }
}
export default mutations
