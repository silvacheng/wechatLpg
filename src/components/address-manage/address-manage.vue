<template>
  <div class="address-manage">
    <div class="header">
      <i class="iconfont back" @click="back" v-show="addressList.length>0">&#xe603;</i>
      <h3 class="title">选择地址</h3>
    </div>
    <div class="content">
      <ul class="address-list">
        <li class="item" v-for="item in addressList" :class="item.isDefault===2?'default':''">
          <div class="info" :class="item.isDefault===2?'default':''" @click="selectAddress(item)">
            <div class="info-detail">
              <div class="top">
                <div class="left">联系电话:</div>
                <div class="right">{{item.mobile}}</div> 
              </div>
              <div class="bottom">
                <div class="left">收货地址:</div>
                <div class="right">{{item.areaName}}{{item.detailAddress}}</div>
              </div>
            </div>
          </div>
          <div class="operate" :class="item.isDefault===2?'default':''">
            <div class="left">
              <div @click.stop="setDefault(item, $event)" :class="item.isDefault===2?'default':''">
                <i class="iconfont" :class="item.isDefault===2?'default':''" v-show="item.isDefault===2">&#xe60e;</i>
                <span :class="item.isDefault===2?'default':''">默认地址</span>
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
      <!-- <div class="add-address" @click="addAddress">
        <span>添加新地址</span>
      </div> -->
    </div>
    <div class="confirm" @click="addAddress" v-show="!showLoading">
      <x-button type="primary">添加新地址</x-button>
    </div>
    <alert v-model="showAlert" :content="alertContent"></alert>
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
  import { XButton, cookie, Loading, Confirm, Alert } from 'vux'
  import { getAddressListUrl, deleteAddressUrl, setDefaultLpgAddressUrl } from '../../api/config'
  export default {
    data () {
      return {
        addressList: [],
        userId: '',
        operateAddressId: '',
        openId: '',
        orderGasNo: '',
        loadingText: '正在加载地址列表',
        showLoading: true,
        showConfirm: false,
        showAlert: false,
        alertContent: '',
        confirmTitle: '',
        needSwitchTodefaultAddress: false
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
          'openId': this.address.openId
        }
        this.$http.post(getAddressListUrl, JSON.stringify(data)).then((res) => {
          this.showLoading = false
          if (res.data.status === '1') {
            this.addressList = res.data.data
            if (this.needSwitchTodefaultAddress) {
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].isDefault === 2) { // 列表中的默认地址
                  let item = res.data.data[i]
                  cookie.set('defaultAddress', JSON.stringify(item))
                  cookie.set('userId', item.userid)
                  cookie.set('openId', item.openId)
                  cookie.set('orderGasNo', item.gasOrderNo)
                  // 恢复默认需要把地址切换为默认地址开关按钮
                  this.needSwitchTodefaultAddress = false
                  break
                }
              }
            }
          }
        })
      },
      addAddress () {
        this.$router.push('/newAddress')
      },
      setDefault (item, $event) { // 设置默认地址
        if ($event.target.className === 'default') {
          return
        }
        this.userId = item.userid
        this.operateAddressId = item.id
        this.openId = item.openId
        this.confirmTitle = '确定设为默认地址？'
        this.showConfirm = true
      },
      edit (item) { // 编辑地址
        cookie.set('editAddress', JSON.stringify(item))
        this.$router.push('/addressEdit')
      },
      deleteAddress (item) {
        if (this.addressList.length === 1) { // 只有一个地址时
          this.alertContent = '至少保留一个地址~'
          this.showAlert = true
          return
        }
        if (item.isDefault === 2) { // 只有一个地址时
          this.alertContent = '不能删除默认地址~'
          this.showAlert = true
          return
        }
        if (item.gasOrderNo === this.address.gasOrderNo) { // 删除了当前选中的店铺地址  需要把地址切换为默认地址
          this.needSwitchTodefaultAddress = true
        }
        this.userId = item.userId
        this.operateAddressId = item.id
        this.confirmTitle = '确定删除此地址？'
        this.showConfirm = true
      },
      selectAddress (item) {
        cookie.set('defaultAddress', JSON.stringify(item))
        cookie.set('userId', item.userid)
        cookie.set('openId', item.openId)
        cookie.set('orderGasNo', item.gasOrderNo)
        this.$router.push('/lpgShop')
      },
      onConfirmCancel () {
        this.showConfirm = false
        this.confirmTitle = ''
      },
      onConfirmSure () { // 确认删除
        this.showConfirm = false
        let data = {
          'id': this.operateAddressId,
          'userid': this.userId,
          'openId': cookie.get('openId')
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
          data.isDefault = 2
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
      Confirm,
      Alert
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
        color #6a6a6a
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
          .info-detail
            flex 1
            font-size 14px
            line-height 30px
            padding 0 5px
            .top, .bottom 
              display flex
              .left 
                flex 0 0 70px               
              .right 
                flex 1               
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
