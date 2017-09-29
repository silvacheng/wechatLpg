<template>
  <div class="add-address">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">添加新地址</h3>
    </div>
    <div class="content">
      <x-input title="联系方式" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"  :max="11" v-model="phone" required></x-input>
      <x-address  title="所在地区" :list="addressData" placeholder="更换" @on-shadow-change="onShadowChange" ref="xAddress"></x-address>
      <x-input title="详细地址" v-model="detailAddress" required></x-input>
      <x-input title="楼层" v-model="floor" type="number" required>楼层</x-input>
      <x-switch title="电梯" @on-click="hasElevator" v-model="elevator"></x-switch>
    </div>
    <div class="company">
      <popup-radio title="公司名称" :options="companyList" v-model="companyValue"></popup-radio>
      <popup-radio title="门店选择" :options="shopList" v-model="shopValue"></popup-radio>
    </div>
    <div class="default">
      <x-switch title="设为默认" @on-click="setDefaultAddress" v-model="isSetAsDefaultAddress"></x-switch>
    </div>
    <div class="save" @click="submit">
      <x-button type="primary">保存</x-button>
    </div>
  </div>
</template>
<script type="text/ECMAScript-6">
//  const addAddressUrl = '/zrds/ZRapp/addLpgBuyerDelivery'
  import { XButton, XInput, XSwitch, XAddress, PopupRadio, ChinaAddressV3Data } from 'vux'
//  import { parseParam } from '../../api/config'

  export default {
    data () {
      return {
        addressData: ChinaAddressV3Data,
        phone: '',
        addressId: '',
        selectedAddress: '',
        detailAddress: '',
        floor: '',
        elevator: false,
        isSetAsDefaultAddress: true,
        companyList: ['佛山市华来燃气有限公司', '佛山市中国燃气有限公司'],
        shopList: ['华来门店', '中燃门店'],
        companyValue: '佛山市华来燃气有限公司',
        shopValue: '华来门店'
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      onShadowChange (ids, names) {
        this.addressId = ids[2]
        this.selectedAddress = names.join('')
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
      submit () {
        let MOBILE_REG = /^1[34578]\d{9}$/g
        if (this.phone === '') {
          alert('请输入联系方式')
          return
        } else if (this.phone && !(MOBILE_REG.test(this.phone))) {
          alert('请输入正确的手机号')
          return
        }
        if (this.detailAddress === '') {
          alert('请输入详细地址')
          return
        }
        if (this.addressId === '110101') {
          alert('请选择地址')
          return
        }
        if (this.floor === '') {
          alert('请输入楼层')
          return
        }
        let data = {
          'phone': this.phone,
          'addressId': this.addressId,
          'detailAddress': this.selectedAddress + this.detailAddress,
          'floor': this.floor,
          'elevator': this.elevator,
          'isDefaultAddress': this.isSetAsDefaultAddress
        }
        console.log(data)
        this.$router.push('/lpgshop')
      }
    },
    components: {
      XButton,
      XInput,
      XAddress,
      XSwitch,
      PopupRadio
    }
  }
</script>>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .add-address
    overflow hidden
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
      padding 0 5px
      background-color #fff
      border 1px solid #eee
      overflow hidden
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
      margin 40px 15px
      text-align center
</style>
