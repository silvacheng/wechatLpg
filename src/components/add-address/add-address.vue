<template>
  <div class="add-address">
    <div class="header">
      <!-- <i class="iconfont back" @click="back">&#xe603;</i> -->
      <h3 class="title">添加新地址</h3>
    </div>
    <div class="content">
      <group class="content-wrapper" label-width="5em" label-align="left">
        <x-input title="姓名" name="userName" placeholder="请输入姓名" is-type="china-name" v-model="userName" required></x-input>        
        <x-input 
          title="联系方式" 
          name="mobile" 
          placeholder="请输入手机号码" 
          keyboard="number" 
          is-type="china-mobile" 
          :max="11" v-model="phone" 
          @on-blur="checkUser"  
          @on-change="hiddenVerify" 
          required>
        </x-input>
        <x-button v-show="needVerifyCode" :type="verifyCodeType" class="verifyCode" mini @click.native="getVerifyCode">{{deadLine}}</x-button>
        <x-input v-show="needVerifyCode" title="验证码" name="verifyCode" placeholder="请输入验证码" keyboard="number" :max="4" v-model="verifyCode" required></x-input>
        <x-address title="所在地区" v-model="addressValue" :list="addressData" @on-shadow-change="onShadowChange" ref="xAddress" raw-value></x-address>
        <x-input title="详细地址" placeholder="请输入详细地址" v-model="detailAddress" required></x-input>
        <x-input title="楼层" placeholder="请输入楼层" v-model="floor" type="number" required>楼层</x-input>
        <x-switch title="电梯" @on-click="hasElevator" v-model="elevator"></x-switch>
      </group>
    </div>
    <div class="company">
      <popup-radio title="公司名称" :options="companyList" v-model="companyValue" class="popup-radio"></popup-radio>
      <popup-radio title="门店选择" :options="shopList" v-model="shopValue" class="popup-radio"></popup-radio>
    </div>
    <div class="default">
      <x-switch title="设为默认" @on-click="setDefaultAddress" v-model="isSetAsDefaultAddress"></x-switch>
    </div>
    <div class="save" @click="submit">
      <x-button type="primary">保存</x-button>
    </div>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
    <alert v-model="showAlert" title="提示" :content="alertConent"></alert> 
  </div>
</template>
<script type="text/ECMAScript-6">
  import { Group, XButton, XInput, XSwitch, XAddress, Picker, PopupRadio, ChinaAddressV3Data, cookie, Loading, Alert } from 'vux'
  import BMap from 'BMap'
  import { getGasCompanyUrl, getGasShopUrl, saveLpgUserInfoUrl, getVerifyCodeUrlTest, checkUserTest } from '../../api/config'
  import { param } from '../../common/js/dom'
  export default {
    data () {
      return {
        addressData: ChinaAddressV3Data,
        phone: '',
        userName: '',
        addressId: '',
        cityId: '',
        selectedAddress: '',
        selectedAddressArr: [],
        addressValue: [],
        detailAddress: '',
        floor: '',
        elevator: true,
        isSetAsDefaultAddress: true,
        companyList: [],
        companyValue: '',
        companyData: [],
        companyId: '',
        companyOrgCode: '',
        shopList: [],
        shopValue: '',
        shopData: [],
        shopId: '',
        shopOrgCode: '',
        showLoading: false,
        loadingText: '获取地理位置中..',
        showAlert: false,
        alertConent: '',
        deadLine: '获取验证码',
        countDownStart: false,
        verifyCode: '',
        verifyCodeType: 'primary',
        verifyCodeSwitch: false,
        needVerifyCode: false
      }
    },
    mounted: function () {
      this.showLoading = true
      this.getLocation()
      // this.getWechatOpenId()
      // console.log(window.location.href)
      let openId = 'oxFVVv-WE38ZX29eKCWBCFYklfBE'
      cookie.set('openId', openId)
    },
    watch: {
      cityId: function (newCityId) {
        // console.log('新的城市id:' + newCityId)
        this.companyList = []
        this.companyData = []
        this.companyValue = ''
        this.companyId = ''
        this.companyOrgCode = ''
        this.shopList = []
        this.shopData = []
        this.shopValue = ''
        this.shopId = ''
        this.shopOrgCode = ''
        this.getGasCompany(newCityId)
      },
      companyId: function (newCompanyId) {
        // console.log('新的公司id:' + newCompanyId)
        if (newCompanyId === '') {
          return
        }
        this.getGasShop(newCompanyId)
      },
      companyValue: function (newCompanyValue) {
        // console.log(newCompanyValue)
        if (this.companyData.length <= 1) {
          return
        }
        for (let i = 0; i < this.companyData.length; i++) {
          if (this.companyData[i].orgName === newCompanyValue) {
            this.companyOrgName = this.companyData[i].orgName
            this.companyId = this.companyData[i].id
            this.companyOrgCode = this.companyData[i].orgCode
            break
          }
        }
        // console.log('新的公司:' + this.companyOrgName)
        // console.log('新的公司Id:' + this.companyId)
        // console.log('新的公司:' + this.companyOrgCode)
      },
      shopValue: function (newShopValue) {
        for (let i = 0; i < this.shopData.length; i++) {
          // console.log(newShopValue)
          if (this.shopData[i].orgName === newShopValue) {
            this.shopOrgName = this.shopData[i].orgName
            this.shopId = this.shopData[i].id
            this.shopOrgCode = this.shopData[i].orgCode
            // console.log('序号为：' + i)
            break
          }
        }
        // console.log('新的店铺:' + this.shopOrgName)
        // console.log('新的店铺Id:' + this.shopId)
        // console.log('新的店铺:' + this.shopOrgCode)
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      onShadowChange (ids, names) {
        this.addressId = ids[2]
        this.cityId = ids[1].substring(0, 4)
        this.selectedAddressArr = names
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
      getLocationByBaiduMap (point) {
        let _this = this
        let geoc = new BMap.Geocoder()
        geoc.getLocation(point, function (res) {
          let addComp = res.addressComponents
          _this.addressValue.push(addComp.province, addComp.city, addComp.district)
          _this.showLoading = false
          _this.loadingText = '正在保存..'
        })
      },
      getLocation () {
        let geolocation = new BMap.Geolocation()
        let _this = this
        geolocation.getCurrentPosition(showLocation, {enableHighAccuracy: true})
        function showLocation (res) {
          if (res.latitude && res.longitude) {
            let locationPoint = res.point
            _this.getLocationByBaiduMap(locationPoint)
          }
        }
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
        this.companyId = ''
        this.companyOrgCode = ''
        this.companyOrgName = ''
        this.shopList = []
        let _this = this
        this.$http.post(getGasCompanyUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1') { // 获取到项目公司的列表
            let list = res.data.data
            if (list.length > 0) {
              list.map(function (item) {
                _this.companyList.push(item.orgName)
                let obj = {
                  orgName: item.orgName,
                  orgCode: item.orgCode,
                  id: item.id
                }
                _this.companyData.push(obj)
              })
              _this.companyValue = list[0].orgName
              _this.companyId = list[0].id
              _this.companyOrgId = list[0].orgCode
            }
          } else if (res.data.status === '2') { // 项目公司列表为空
            _this.companyList.push(res.data.msg)
            _this.companyValue = res.data.msg
          }
        })
      },
      getGasShop (id) {
        let data = {
          orgtype: '22,23',
          parOrgId: id
        }
        this.shopList = []
        this.shopData = []
        this.shopId = ''
        this.shopOrgCode = ''
        this.shopOrgName = ''
        let _this = this
        this.$http.post(getGasShopUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1') {
            let list = res.data.data
            if (list.length > 0) {
              list.map(function (item) {
                let obj = {
                  orgName: item.orgName,
                  orgCode: item.orgCode,
                  id: item.id
                }
                _this.shopList.push(item.orgName)
                _this.shopData.push(obj)
              })
              _this.shopValue = list[0].orgName
              _this.shopId = list[0].Id
              _this.shopOrgCode = list[0].orgCode
            }
          }
        })
      },
      submit () {
        let MOBILE_REG = /^1[34578]\d{9}$/g
        if (this.phone === '') {
          this.alertConent = '请输入联系方式'
          this.showAlert = true
          return
        } else if (this.phone && !(MOBILE_REG.test(this.phone))) {
          this.alertConent = '请输入正确的手机号'
          this.showAlert = true
          return
        }
        if (this.detailAddress === '') {
          this.alertConent = '请输入详细地址'
          this.showAlert = true
          return
        }
        if (this.addressId === '110101') {
          this.alertConent = '请选择地址'
          this.showAlert = true
          return
        }
        if (this.floor === '') {
          this.alertConent = '请输入楼层'
          this.showAlert = true
          return
        }
        if (this.companyOrgId === '') {
          this.alertConent = '请选择送气公司'
          this.showAlert = true
          return
        }
        if (this.shopOrgCode === '') {
          this.alertConent = '请选择送气门店'
          this.showAlert = true
          return
        }

        if (this.verifyCode.length !== 4 && this.needVerifyCode === true) { // 需要输入验证码
          this.alertConent = '请输入正确的验证码'
          this.showAlert = true
          return
        }

        let data = {
          'openId': 'oxFVVv-WE38ZX29eKCWBCFYklfBE',
          'userName': this.userName, // 用户名称
          'addressId': this.addressId, // 所在省市的4位数字编码
          'userArea': this.selectedAddress, // 所在区域
          'userAddress': this.detailAddress, // 所在地址
          'elevator': this.elevator === false ? '0' : '1', // 是否有电梯 0无1有
          'floor': this.floor, // 楼层
          'deliverCompanyId': this.companyOrgId, // 送气公司Id
          'deliverCompanyName': this.companyValue, // 送气公司名称
          'deliverDepartmentId': this.shopOrgCode, // 送气门店Id
          'deliverDepartmentName': this.shopValue, // 送气门店名称
          'mobile': this.phone, // 手机
          'smsCode': this.verifyCode.length === 4 ? this.verifyCode : '00000', // 验证码
          // 'isLpgDefault': '1', // LPG订气默认收货地址(1:为LPG地址2:为电商地址)
          'isDefault': this.isSetAsDefaultAddress === false ? '1' : '2' // 是否设置为默认地址
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
      },
      checkUser () {
        let MOBILE_REG = /^1[345678]\d{9}$/g
        if (this.phone.length !== 11 || !(MOBILE_REG.test(this.phone))) {
          return
        }
        let data = {
          'mobile': this.phone,
          'userId': 123456
        }
        let url = checkUserTest + '?' + param(data)
        this.$http.post(url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          if (res.data.status === '1') {
            this.needVerifyCode = true
          } else {
            this.needVerifyCode = false
          }
        })
      },
      hiddenVerify () { // 退格时 清除验证码发送按钮
        if (this.phone.length !== 11 && this.needVerifyCode === true) {
          this.needVerifyCode = false
        }
      },
      getVerifyCode () { // 获取验证码
        let MOBILE_REG = /^1[345678]\d{9}$/g
        if (this.phone === '') {
          this.alertConent = '请输入手机号'
          this.showAlert = true
          return
        } else if (this.phone && !(MOBILE_REG.test(this.phone))) {
          this.alertConent = '请输入正确的手机号'
          this.showAlert = true
          return
        }
        // 防止重复点击
        if (this.verifyCodeSwitch) {
          return
        }
        this.verifyCodeSwitch = true
        this.verifyCodeType = 'default'
        this.deadLine = '120s'
        let timer = null
        let num = 120
        let _this = this
        clearInterval(timer)
        timer = setInterval(function () {
          num--
          if (num === 0) {
            _this.verifyCodeType = 'primary'
            _this.deadLine = '获取验证码'
            _this.verifyCodeSwitch = false
            clearInterval(timer)
          } else {
            _this.deadLine = num + 's'
          }
        }, 1000)
        let data = {
          'clientfrom': '1',
          'macAddr': '',
          'mobile': this.phone,
          'picCode': '',
          'picRandom': '',
          'sendfrom': '1',
          'useFor': 'register2',
          'ZRapp_version': '1.5.7',
          'app_version': '1.5.7',
          'appType': '1',
          'isAndroid': ''
        }
        // console.log(this.$http)
        let url = getVerifyCodeUrlTest + '?' + param(data)
        this.$http.post(url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          console.log(res.data)
        })
      }
    },
    components: {
      Group,
      XButton,
      XInput,
      XAddress,
      XSwitch,
      Picker,
      PopupRadio,
      Loading,
      Alert
    }
  }
</script>>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .add-address
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
      margin-top 10px
      padding 0 5px
      background-color #fff
      overflow hidden
      .content-wrapper
        margin-top -21px
        position relative
        .verifyCode 
          position absolute
          right 15px
          top 52px
    .company
      margin-top 10px
      padding 0 5px
      background-color #fff
      border 1px solid #eee
      .popup-radio 
        padding 15px
    .default
      margin-top 10px
      padding 5px
      background-color #fff
      border 1px solid #eee
    .save
      margin 40px 15px
      text-align center
</style>
