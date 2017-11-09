<template>
  <div class="edit-address">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">编辑地址</h3>
    </div>
    <div class="content">
      <group class="content-wrapper" label-width="5em" label-align="left">
        <x-input title="用户姓名" name="user" placeholder="请输入姓名" is-type="china-name" v-model="editAddress.userName" required></x-input>        
        <x-input title="详细地址" placeholder="请输入详细地址" v-model="editAddress.detailAddress" required></x-input>
        <x-input title="楼层" placeholder="请输入楼层" v-model="editAddress.floorLevel" type="number" required>楼层</x-input>
        <x-switch title="电梯" @on-change="hasElevator" v-model="elevator"></x-switch>
      </group>
    </div>
    <div class="save" @click="update">
      <x-button type="primary">保存</x-button>
    </div>
    <alert v-model="showAlert" title="提示" :content="alertConent"></alert>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>    
  </div>
</template>
<script type="text/ECMAScript-6">
  import { XButton, XInput, XAddress, XSwitch, Group, PopupRadio, cookie, Loading, Countdown, Alert } from 'vux'
  import { updateAddressUrl } from '../../api/config'
  
  export default {
    data () {
      return {
        loadingText: '正在获取地址信息',
        showLoading: false,
        showAlert: false,
        alertConent: '',
        editAddress: JSON.parse(cookie.get('editAddress')),
        haveElevator: (JSON.parse(cookie.get('editAddress'))).haveElevator
      }
    },
    computed: {
      elevator () {
        let bol
        if (this.editAddress.haveElevator === 1) {
          bol = true
          this.haveElevator = 1
        } else {
          bol = false
          this.haveElevator = 2
        }
        return bol
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      hasElevator () {
        if (this.haveElevator === 1) {
          this.haveElevator = 2
        } else {
          this.haveElevator = 1
        }
      },
      update () {
        let userInfo = this.editAddress
        if (userInfo.userName === '') {
          this.alertConent = '用户姓名不能为空'
          this.showAlert = true
          return
        }
        if (userInfo.detailAddress === '') {
          this.alertConent = '详细地址不能为空'
          this.showAlert = true
          return
        }
        if (userInfo.floorLevel === '') {
          this.alertConent = '楼层不能为空'
          this.showAlert = true
          return
        }

        let data = {
          'openId': userInfo.openId,
          'userid': userInfo.userid,
          'id': userInfo.id,
          'userName': userInfo.userName, // 用户名称
          'detailAddress': userInfo.detailAddress, // 所在地址
          'haveElevator': this.haveElevator, // 是否有电梯 0无1有
          'floorLevel': Number(userInfo.floorLevel) // 楼层
        }
        // console.log(data)
        this.loadingText = '正在保存中'
        this.showLoading = true
        this.$http.post(updateAddressUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1') {
            this.showLoading = false
            cookie.remove('editAddress')
            this.$router.push('/addressManage')
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
      Countdown,
      Alert
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
