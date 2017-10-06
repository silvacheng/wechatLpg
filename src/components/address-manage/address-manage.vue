<template>
  <div class="address-manage">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">地址管理</h3>
    </div>
    <div class="content">
      <ul class="address-list">
        <li class="item" v-for="item in addressList">
          <div class="info">
            <div class="left">
              <i class="iconfont">&#xe60d;</i>
            </div>
            <div class="right">
              <div class="right-top">
                <span class="receiver">{{item.userName}}</span>
                <span class="phone">{{item.phone}}</span>
              </div>
              <div class="right-bottom">
                <span class="address">{{item.detailAddress}}</span>
              </div>
            </div>
          </div>
          <div class="operate">
            <div class="left">
              <div @click="setDefault(item)">
                <i class="iconfont" :class="item.isLpgDefault==='1'?'default':''">&#xe60e;</i>
                <span>设为默认</span>
              </div>
            </div>
            <div class="right">
              <div @click="edit(item)">
                <i class="iconfont">&#xe617;</i>
                <span class="edit">编辑</span>
              </div>
              <div @click="deleteAddress(item)">
                <i class="iconfont">&#xe605;</i>
                <span class="delete">删除</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="add" @click="addAddress">
      <x-button type="primary">新建地址</x-button>
    </div>
  </div>
</template>
<script type="text/ECMAScript-6">
  const getAddressListUrl = '/zrds/ZRapp/getSendAddressListByUserId'
  const setDefaultAddressUrl = '/zrds/ZRapp/updateBuyerDeliveryToLpgDefault'
  const deleteAddressUrl = '/zrds/ZRapp/deleteAddress'
  const ERR_OK = 1
//  import Vue from 'vue'
  import { XButton, cookie } from 'vux'
  import { parseParam } from '../../api/config'

  export default {
    data () {
      return {
        addressList: []
      }
    },
    computed: {
      localSid () {
        let sid = cookie.get('sid')
        return 'aaahg10001/' + sid
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      back () {
        this.$router.back()
      },
      fetchData () { // 获取地址信息
        let data = {
          userId: cookie.get('userId')
        }
//        Vue.http.defaults.headers.post['x-mas-app-info'] = this.localSid
        this.$http.post(getAddressListUrl, parseParam(data)).then((res) => {
          if (res.data.status === ERR_OK) {
            this.addressList = res.data.data
          }
        })
      },
      addAddress () {
        this.$router.push('/addAddress')
      },
      setDefault (item) { // 设置默认地址
        let data = {
          id: item.id,
          userId: cookie.get('userId')
        }
        this.$http.post(setDefaultAddressUrl, parseParam(data)).then((res) => {
          // console.log(res.data)
          if (res.data.status === 1) {
            cookie.remove('defaultAddress')
            cookie.set('defaultAddress', JSON.stringify(item))
            // this.fetchData()
            this.$router.push('/Register')
          }
        })
      },
      edit (item) { // 编辑地址
        cookie.set('editAddress', JSON.stringify(item))
        this.$router.push('/EditAddress')
      },
      deleteAddress (item) {
        let data = {
          id: item.id,
          userId: cookie.get('userId')
        }
        this.$http.post(deleteAddressUrl, parseParam(data)).then((res) => {
          console.log(res.data)
          if (res.data.status === 1) {
            this.fetchData()
          }
        })
      }
    },
    components: {
      XButton
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .address-manage
    height 100%
    background-color #f4f4f4
    .header
      height 40px
      line-height 40px
      position relative
      text-align center
      background-color #fff
      .back
        position absolute
        left 0
        font-size 20px
        padding 0 8px
        font-weight bold
      .title
        font-weight bold
    .content
      .item
        background-color #fff
        border-radius 5px
        margin 15px 5px 0 5px
        padding 5px
        font-size 16px
        .info
          display flex
          border-bottom 1px solid #eee
          .left
            flex 0 0 40px
            text-align center
            .iconfont
              display inline-block
              margin-top 24px
          .right
            flex 1
            font-size 12px
            line-height 30px
            padding 0 5px
            .right-top
              display flex
              justify-content space-between
        .operate
          display  flex
          height 40px
          line-height 40px
          font-size 12px
          .left
            flex 1
            text-align center
            div
              display inline-block
              padding 0 10px
              .iconfont
                margin-right 8px
                &.default
                  color #1AAD19
          .right
            flex 1
            padding-left 10px
            display flex
            div
              display inline-block
              .edit
                margin-right 35px
              .iconfont
                margin-right 3px
    .add
      position absolute
      left 5%
      width 90%
      bottom 10px
      text-align center
</style>
