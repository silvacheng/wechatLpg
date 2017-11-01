<template>
  <div class="address-manage">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">选择地址</h3>
    </div>
    <div class="content">
      <ul class="address-list">
        <li class="item" v-for="item in addressList" :class="item.isLpgDefault===1?'default':''">
          <div class="info" :class="item.isLpgDefault===2?'default':''" @click="selectAddress">
            <div class="right">
              <!-- <div>
                <span class="address">收货人&nbsp;:&nbsp;{{item.userName}}</span>
              </div> -->
              <div>
                <span class="receiver">联系电话&nbsp;:&nbsp;{{item.phone}}</span>
              </div>
              <div>
                <span class="address">收货地址&nbsp;:&nbsp;{{item.areaName}}{{item.detailAddress}}</span>
              </div>
            </div>
          </div>
          <div class="operate" :class="item.isLpgDefault===1?'default':''">
            <div class="left">
              <div @click.stop="setDefault(item, $event)" :class="item.isLpgDefault===1?'default':''">
                <i class="iconfont" :class="item.isLpgDefault===1?'default':''">&#xe60e;</i>
                <span :class="item.isLpgDefault===1?'default':''">默认地址</span>
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
      <div class="add-address" @click="addAddress">
        <span>添加新地址</span>
      </div>
    </div>
    <div class="confirm" >
      <x-button type="primary">确定</x-button>
    </div>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
    <div>
      <confirm v-model="showConfirm"
        :title="confirmTitle"
        @on-cancel="onConfirmCancel"
        @on-confirm="onConfirmSure">
      </confirm>
    </div>        
  </div>
</template>
<script type="text/ECMAScript-6">
  import { XButton, cookie, Loading, Confirm } from 'vux'
  import { getAddressListUrl, deleteAddressUrl, setDefaultLpgAddressUrl } from '../../api/config'
  export default {
    data () {
      return {
        addressList: [],
        userId: '',
        operateAddressId: '',
        loadingText: '正在加载地址列表',
        showLoading: true,
        showConfirm: false,
        confirmTitle: ''
      }
    },
    created () {
      this.getAddressList()
    },
    computed: {
      address () {
        let address = cookie.get('defaultAddress')
        if (address) {
          return JSON.parse(address)
        } else {
          let addressData = {
            phone: '',
            detailAddress: ''
          }
          return addressData
        }
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      getAddressList () { // 获取地址信息
        let data = {
          'userId': this.address.appUserId
        }
        this.$http.post(getAddressListUrl, JSON.stringify(data)).then((res) => {
          this.showLoading = false
          if (res.data.status === '1') {
            this.addressList = res.data.data
          }
        })
      },
      addAddress () {
        this.$router.push('/addAddress')
      },
      setDefault (item, $event) { // 设置默认地址
        if ($event.target.className === 'default') {
          return
        }
        this.userId = item.userId
        this.operateAddressId = item.id
        this.confirmTitle = '确定设为默认地址？'
        this.showConfirm = true
      },
      edit (item) { // 编辑地址
        console.log(item)
        console.log(item.areaName)
        console.log(typeof item.areaName)
        cookie.set('editAddress', JSON.stringify(item))
        this.$router.push('/addressEdit')
      },
      deleteAddress (item) {
        console.log(item)
        this.userId = item.userId
        this.operateAddressId = item.id
        this.confirmTitle = '确定删除此地址？'
        this.showConfirm = true
      },
      selectAddress () {
        this.$router.push('/lpgShop')
      },
      onConfirmCancel () {
        this.showConfirm = false
        this.confirmTitle = ''
      },
      onConfirmSure () { // 确认删除
        this.showConfirm = false
        let data = {
          id: this.operateAddressId,
          userId: this.userId
        }
        let _this = this
        if (this.confirmTitle === '确定删除此地址？') { // 删除地址
          this.$http.post(deleteAddressUrl, JSON.stringify(data)).then((res) => {
            console.log(res.data)
            if (res.data.status === '1') {
              _this.addressList = []
              _this.getAddressList()
              _this.showLoading = true
            }
          })
        } else if (this.confirmTitle === '确定设为默认地址？') { // 设为默认地址
          this.$http.post(setDefaultLpgAddressUrl, JSON.stringify(data)).then((res) => {
            console.log(res.data)
            if (res.data.status === '1') {
              _this.getAddressList()
              _this.showLoading = true
            }
          })
        }
        // 清除confirmTitle
        this.confirmTitle = ''
      }
    },
    components: {
      XButton,
      Loading,
      Confirm
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
      border-bottom 1px solid #dadada
      background-color #38d164
      color #fff
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
        margin 15px 0
        padding 5px 10px
        font-size 16px
        &.default
          background-color #b1e5c0
          .info 
            border-color #5dd57f
        .info
          display flex
          border-bottom 1px solid #eee
          padding 5px 0
          &.default
            border-color #5dd57f
            color #6a6a6a                     
          .left
            flex 0 0 40px
            text-align left
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
          height 30px 
          line-height 30px
          margin-top 8px
          font-size 12px
          &.default
            color #808080
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
            display flex
            div
              flex 1
              .iconfont
                margin-right 3px
      .add-address 
        font-size 14px 
        color #38d164
        margin 15px 
        text-align right
        span 
          padding 5px 10px
    .confirm
      margin 30px 15px 0 15px
</style>
