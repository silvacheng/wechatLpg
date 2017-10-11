// 异步操作 修改 mutation进行封装
import * as types from './mutation-types'

export const selectGoods = function ({commit, state}, {list}) {
  console.log(commit)
  console.log(state)
  console.log(list)
  commit(types.SET_SELECT_GOODS, list)
}
export const selectAddress = function ({commit, state}, {list}) {
  commit(types.SET_SELECT_ADDRESS, list)
}
export const editAddress = function ({commit, state}, {list}) {
  commit(types.SET_EDIT_ADDRESS, list)
}
