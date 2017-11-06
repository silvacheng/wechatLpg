<template>
  <div class="edit-address">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">编辑地址</h3>
    </div>
    <div class="content">
      <group class="content-wrapper" label-width="5em" label-align="left">
        <x-input title="用户姓名" name="user" placeholder="请输入姓名" is-type="china-name" v-model="editAddress.userName" required></x-input>        
        <x-input title="联系方式" name="mobile" placeholder="请输入手机号码" keyboard="number" v-model="editAddress.phone" is-type="china-mobile" :max="11" required></x-input>
        <!-- <x-address title="所在地区" v-model="addressValue" :list="addressData" @on-shadow-change="onShadowChange" raw-value></x-address> -->
        <x-input title="详细地址" placeholder="请输入详细地址" v-model="editAddress.detailAddress" required></x-input>
        <x-input title="楼层" placeholder="请输入楼层" v-model="editAddress.floorLevel" type="number" required>楼层</x-input>
        <x-switch title="电梯" @on-click="hasElevator" v-model="elevator"></x-switch>
      </group>
    </div>
    <!-- <div class="company">
      <popup-radio title="公司名称" :options="companyList" v-model="editAddress.orgName"></popup-radio>
      <popup-radio title="门店选择" :options="shopList" v-model="editAddress.departmentName"></popup-radio>
    </div> -->
    <div class="default">
      <x-switch title="设为默认" @on-click="setDefaultAddress" v-model="isSetAsDefaultAddress"></x-switch>
    </div>
    <div class="save" @click="save">
      <x-button type="primary">保存</x-button>
    </div>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>    
  </div>
</template>
<script type="text/ECMAScript-6">
  import { XButton, XInput, XAddress, XSwitch, Group, PopupRadio, cookie, Loading, Countdown } from 'vux'
  import { saveLpgUserInfoUrl } from '../../api/config'
  
  export default {
    data () {
      return {
        loadingText: '正在获取地址信息。。',
        showLoading: false,
        editAddress: JSON.parse(cookie.get('editAddress'))
      }
    },
    computed: {
      elevator () {
        let bol
        if (this.editAddress.haveElevator === 1) {
          bol = true
        } else {
          bol = false
        }
        return bol
      },
      isSetAsDefaultAddress () {
        let bol
        if (this.editAddress.isLpgDefault === 1) {
          bol = true
        } else {
          bol = false
        }
        return bol
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      hasElevator (newVal, oldVal) {
        setTimeout(() => {
          this.elevator = newVal
        }, 500)
      },
      setDefaultAddress (newVal, oldVal) {
        setTimeout(() => {
          this.setdefault = newVal
        }, 500)
      },
      save () {
        let MOBILE_REG = /^1[34578]\d{9}$/g
        let userInfo = this.editAddress
        if (userInfo.phone === '') {
          this.alertConent = '请输入联系方式'
          this.showAlert = true
          return
        } else if (userInfo.phone && !(MOBILE_REG.test(userInfo.phone))) {
          this.alertConent = '请输入正确的手机号'
          this.showAlert = true
          return
        }
        if (userInfo.detailAddress === '') {
          this.alertConent = '请输入详细地址'
          this.showAlert = true
          return
        }
        if (userInfo.addressId === '110101') {
          this.alertConent = '请选择地址'
          this.showAlert = true
          return
        }
        if (userInfo.floor === '') {
          this.alertConent = '请输入楼层'
          this.showAlert = true
          return
        }
        if (userInfo.companyOrgId === '') {
          this.alertConent = '请选择送气公司'
          this.showAlert = true
          return
        }
        if (userInfo.shopOrgCode === '') {
          this.alertConent = '请选择送气门店'
          this.showAlert = true
          return
        }
        let data = {
          'userName': userInfo.userName, // 用户名称
          'addressId': userInfo.addressId, // 所在省市的4位数字编码
          'userArea': userInfo.selectedAddress, // 所在区域
          'userAddress': userInfo.detailAddress, // 所在地址
          'elevator': this.elevator === false ? '0' : '1', // 是否有电梯 0无1有
          'floor': userInfo.floorLevel, // 楼层
          'deliverCompanyId': userInfo.companyOrgId, // 送气公司Id
          'deliverCompanyName': userInfo.companyValue, // 送气公司名称
          'deliverDepartmentId': userInfo.shopOrgCode, // 送气门店Id
          'deliverDepartmentName': userInfo.shopValue, // 送气门店名称
          'mobile': userInfo.phone, // 手机
          'isLpgDefault': '1', // LPG订气默认收货地址(1:为LPG地址2:为电商地址)
          'isDefault': this.isSetAsDefaultAddress === false ? '0' : '1' // 是否设置为默认地址
        }
        console.log(data)
        this.showLoading = true
        this.$http.post(saveLpgUserInfoUrl, JSON.stringify(data)).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            data.orderGasNo = res.data.msg.orderGasNo
            data.appUserId = res.data.msg.appUserId
            cookie.set('defaultAddress', JSON.stringify(data))
            cookie.set('orderGasNo', res.data.msg.orderGasNo)
            cookie.set('appUserId', res.data.msg.appUserId)
            this.showLoading = false
            this.$router.push('/lpgshop')
          } else {
            this.showLoading = false
            this.alertConent = res.data.msg
            this.showAlert = true
          }
        })
      }
    },
    components: {
      XButton,
      XInput,
      XAddress,
      Group,
      XSwitch,
      PopupRadio,
      Loading,
      Countdown
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .edit-address
    height 100%
    width 100%
    overflow hidden
    background-color #f4f4f4
    .header
      height 40px
      line-height 40px
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
      line-height 20px
      margin-top 20px
      background-color #fff
    .company
      margin-top 20px
      padding 0 5px
      background-color #fff
      border 1px solid #eee
    .default
      margin-top 20px
      padding 5px
      background-color #fff
      border 1px solid #eee
    .save
      margin 100px 15px 0
      text-align center
</style>
