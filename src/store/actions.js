// 异步操作 修改 mutation进行封装
import * as types from './mutation-types'

export const selectGoods = function ({commit, state}, {list}) {
  commit(types.SET_SELECT_GOODS, list)
}
export const defaultAddress = function ({commit, state}, {list}) {
  commit(types.SET_DEFAULT_ADDRESS, list)
}
export const editAddress = function ({commit, state}, {list}) {
  commit(types.SET_EDIT_ADDRESS, list)
}
export const orderDetail = function ({commit, state}, {list}) {
  commit(types.SET_ORDER_DETAIL, list)
}
