<template>
  <div class="edit-address">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">编辑地址</h3>
    </div>
    <div class="content" :initData="initData">
      <group class="content-wrapper" label-width="5em" label-align="left">
        <x-input title="联系方式" v-model="phone"  name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" :max="11" required></x-input>
        <x-address  title="地址" v-model="addressArr" :list="addressData"  @on-shadow-change="onShadowChange" raw-value ref="xAddress" value-text-align="left"></x-address>
        <x-input title="详细地址" v-model="detailAddress" required></x-input>
        <x-input title="楼层" v-model="floor" type="number" required>楼层</x-input>
        <x-switch title="电梯" @on-click="hasElevator" v-model="elevator"></x-switch>
      </group>
    </div>
    <div class="company">
      <popup-radio title="公司名称" :options="companyList" v-model="companyValue"></popup-radio>
      <popup-radio title="门店选择" :options="shopList" v-model="shopValue"></popup-radio>
    </div>
    <div class="default">
      <x-switch title="设为默认" @on-click="setDefaultAddress" v-model="isSetAsDefaultAddress"></x-switch>
    </div>
    <div class="save" @click="save">
      <x-button type="primary">保存</x-button>
    </div>
  </div>
</template>
<script type="text/ECMAScript-6">
//  const updateAddressUrl = '/zrds/ZRapp/updateAddress'
  import { XButton, XInput, XAddress, XSwitch, Group, PopupRadio, ChinaAddressV3Data, cookie } from 'vux'
//  import { parseParam } from '../../api/config'

  export default {
    data () {
      return {
        addressData: ChinaAddressV3Data,
        addressArr: [],
        addressIds: '',
        phone: '',
        address: '',
        detailAddress: '',
        floor: '',
        elevator: '',
        isSetAsDefaultAddress: true,
        companyList: ['佛山市华来燃气有限公司', '佛山市中国燃气有限公司'],
        shopList: ['华来门店', '中燃门店'],
        companyValue: '佛山市华来燃气有限公司',
        shopValue: '华来门店'
      }
    },
    computed: {
      initData () {
        let data = JSON.parse(cookie.get('defaultAddress'))
        console.log(data)
        this.phone = data.phone
        this.addressArr = data.selectedAddressArr
        this.address = data.address
        this.detailAddress = data.detailAddress
        this.floor = data.floor
        this.elevator = data.elevator
        return data
      }
//      addressValue: function () {
//        if (!this.initData) {
//          return
//        }
//        return this.initData.selectedAddressArr
//      },
//      detailValue () {
//        if (!this.initData) {
//          return
//        }
//        return this.initData.detailAddress
//      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      onShadowChange (ids, names) {
        this.addressArr = names
        this.addressIds = ids[2]
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
          'address': this.selectedAddress,
          'detailAddress': this.detailAddress,
          'selectedAddressArr': this.selectedAddressArr,
          'floor': this.floor,
          'elevator': this.elevator,
          'isDefaultAddress': this.isSetAsDefaultAddress
        }
        console.log(data)
        cookie.set('defaultAddress', JSON.stringify(data))
        this.$router.push('/lpgshop')
      }
    },
    components: {
      XButton,
      XInput,
      XAddress,
      Group,
      XSwitch,
      PopupRadio
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
