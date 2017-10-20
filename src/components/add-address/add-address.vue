<template>
  <div class="add-address">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">添加新地址</h3>
    </div>
    <div class="content">
      <group class="content-wrapper" label-width="5em" label-align="left">
        <x-input title="联系方式" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"  :max="11" v-model="phone" required></x-input>
        <x-address  title="所在地区" v-model="addressValue" :list="addressData" @on-hide="onAddressListHide"  @on-shadow-change="onShadowChange" ref="xAddress" raw-value></x-address>
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
    <div class="save" @click="submit">
      <x-button type="primary">保存</x-button>
    </div>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
  </div>
</template>
<script type="text/ECMAScript-6">
  import { Group, XButton, XInput, XSwitch, XAddress, Picker, PopupRadio, ChinaAddressV3Data, cookie, Loading } from 'vux'
  import { mapMutations } from 'vuex'
  import BMap from 'BMap'
  const getGasCompanyUrl = '/lw/controller/gasCompany/getGasCompanyMas.do'
  const getGasShopUrl = '/lw/controller/gasShop/getGasShopMas.do'
  const saveLpgUserInfoUrl = '/lw/controller/forGas/postGasUserInfoMas.do'
  export default {
    data () {
      return {
        addressData: ChinaAddressV3Data,
        phone: '15646786654',
        addressId: '',
        cityId: '',
        selectedAddress: '',
        selectedAddressArr: [],
        addressValue: [],
        detailAddress: '人民路2号',
        floor: '8',
        elevator: false,
        isSetAsDefaultAddress: true,
        companyList: [],
        shopList: [],
        companyValue: '',
        companyData: [],
        companyId: '',
        shopValue: '',
        showLoading: false,
        loadingText: '保存中...'
      }
    },
    mounted: function () {
      this.getLocationByBaiduMap()
    },
    watch: {
      cityId: function (newCityId) {
        console.log('新的城市id:' + newCityId)
        this.getGasCompany(newCityId)
      },
      companyId: function (newCompanyId) {
        console.log('新的公司id:' + newCompanyId)
        this.getGasShop(newCompanyId)
      },
      companyValue: function (newCompanyValue) {
        // console.log(newCompanyValue)
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      onShadowChange (ids, names) {
        // console.log(ids, names)
        this.addressId = ids[2]
        this.cityId = ids[1].substring(0, 4)
        this.selectedAddressArr = names
        this.selectedAddress = names.join('')
      },
      onAddressListHide (value) {
        // console.log(value)
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
          'appUserId': '11393245', // app用户Id
          'userName': '陆兆斌', // 用户名称
          'needAddAddress': 'false',
          'receivePerson': '陆兆斌',
          'receiveMobile': this.phone,
          'addressId': this.addressId,
          'userArea': this.selectedAddress, // 所在区域
          'userAddress': this.detailAddress, // 所在区域
          // 'sex': '',
          // 'sexName': '',
          'elevator': '0', // 是否有电梯
          'floor': this.floor, // 楼层
          'deliverCompanyId': '0125', // 送气公司Id
          'deliverCompanyName': this.companyValue, // 送气公司名称
          'deliverDepartmentId': '111212000001', // 送气门店Id
          'deliverDepartmentName': this.shopValue, // 送气门店名称
          'workUnits': '', // 工作单位
          'position': '', // 工作单位
          'companyPhone': '', // 公司电话
          'homePhone': '', // 家庭电话
          'mobile': this.phone, // 家庭电话
          'lpgInviteCode': ''
        }
        console.log(data)
        cookie.set('defaultAddress', JSON.stringify(data))
        this.defaultAddress(data)
        this.showLoading = true
        this.$http.post(saveLpgUserInfoUrl, JSON.stringify(data)).then((res) => {
          console.log(res.data)
          if (res.data.status === '1') {
            cookie.set('orderGasNo', res.data.data)
            this.showLoading = false
            this.$router.push('/lpgshop')
          }
        })
      },
      getLocationByBaiduMap () {
        let _this = this
        let point = new BMap.Point(113.041381, 23.078265)
        let geoc = new BMap.Geocoder()
        geoc.getLocation(point, function (rs) {
          let addComp = rs.addressComponents
          _this.addressValue.push(addComp.province, addComp.city, addComp.district)
        })
      },
      getGasCompany (cityId) {
        if (!cityId) {
          return
        }
        let data = {
          orgtype: '20',
          cityId: cityId,
          parOrgId: '10'
        }
        this.companyList = []
        this.companyData = []
        this.shopList = []
        let _this = this
        this.$http.post(getGasCompanyUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1') {
            let list = res.data.data
            if (list.length > 0) {
              list.map(function (item) {
                _this.companyList.push(item.orgName)
                let obj = {
                  orgName: item.orgName,
                  id: item.id
                }
                _this.companyData.push(obj)
              })
              _this.companyValue = list[0].orgName
              _this.companyId = list[0].id
            }
          } else if (res.data.status === '2') {
            _this.companyList.push(res.data.msg)
            _this.companyValue = res.data.msg
          }
        })
      },
      getGasShop (id) {
        let data = {
          orgtype: '22,23',
          parOrgId: id,
          latitude: '',
          longitude: ''
        }
        this.shopList = []
        let _this = this
        this.$http.post(getGasShopUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1') {
            let list = res.data.data
            if (list.length > 0) {
              list.map(function (item) {
                _this.shopList.push(item.orgName)
              })
              _this.shopValue = list[0].orgName
            }
          }
        })
      },
      ...mapMutations({
        defaultAddress: 'SET_DEFAULT_ADDRESS'
      })
    },
    components: {
      Group,
      XButton,
      XInput,
      XAddress,
      XSwitch,
      Picker,
      PopupRadio,
      Loading
    }
  }
</script>>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .add-address
    overflow hidden
    background-color #f4f4f4
    height 100%
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
      overflow hidden
      .content-wrapper
        margin-top -1.3em
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
