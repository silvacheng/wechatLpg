<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left" v-show="fullPath==='/lpgshop'||fullPath==='/lpgShop'">
          <div class="top">合计商品：<span class="red">{{totalamount}}件</span></div>
          <div class="bottom">合计金额：<span class="red">￥{{totalGasPrice}}</span>&nbsp;&nbsp;<span class="remark">(不包含送气费，楼层费)</span></div>
        </div>
        <div class="content-left" v-show="fullPath==='/confirmOrder'||fullPath==='/confirmorder'">
          <div class="top">合计金额:<span class="red">￥{{(totalGasPrice+totalFreightPrice+totalFloorPrice)/100}}</span></div>
          <div class="bottom bottom-spec">
            <div>送气费:￥{{totalFreightPrice/100}}</div>
            <div class="floor">楼层费:￥{{totalFloorPrice/100}}</div>
          </div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
        </div>
      </div>
      <!-- <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <div class="title">购物车</div>
            <div class="empty" @click="empty">清空</div>
          </div>
          <div class="list-content">
            <ul>
              <li class="good" v-for="(good, index) in selectGoods" v-show="good.amount>0">
                <span>{{good.gasTypeName}}</span>
                <div class="price">
                  <span>￥{{good.bottlePrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :good="good" @add="addGood" :index="index"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition> -->
    </div>
    <!-- <transition name="fade">
      <div class="list-mark" v-show="listShow" @click="hideList"></div>
    </transition> -->
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
    <alert v-model="showAlert" :content="alertContent"></alert>    
  </div>
</template>
<script type="text/ECMAScript-6">
  import cartcontrol from '../../base/cartcontrol/cartcontrol.vue'
  import { cookie, Loading, dateFormat, Alert } from 'vux'
  import { mapMutations } from 'vuex'
  import { postGasOrderUrl } from '../../api/config'
  export default {
    props: {
      selectGoods: {
        type: Array
      },
      address: {
        type: Object
      },
      appointmentTime: {
        type: String
      },
      appointmentTimeStamp: {
        type: Number
      },
      selectAppointmentTimeStamp: {
        type: Number
      },
      remarkText: {
        type: String
      }
    },
    data () {
      return {
        fold: true,
        showLoading: false,
        loadingText: '提交订单中...',
        fullPath: this.$router.history.current.fullPath,
        needPlus: true,
        showAlert: false,
        alertContent: ''
      }
    },
    created () {
      // console.log(this.selectGoods)
      if (this.needPlus) {
        for (let i = 0; i < this.selectGoods.length; i++) {
          this.selectGoods[i].bottlePrice = this.selectGoods[i].bottlePrice * 100
          this.selectGoods[i].floorFee = this.selectGoods[i].floorFee * 100
          this.selectGoods[i].freight = this.selectGoods[i].freight * 100
          this.selectGoods[i].weightPrice = this.selectGoods[i].weightPrice * 100
        }
        this.needPlus = false
      }
    },
    computed: {
      totalGasPrice () {
        let total = 0
        this.selectGoods.forEach((good) => {
          total += Number(good.bottlePrice) * good.amount
        })
        return total
      },
      totalamount () {
        let amount = 0
        this.selectGoods.forEach((good) => {
          amount += good.amount
        })
        return amount
      },
      totalFloorPrice () {
        let total = 0
        if (this.address.elevator === '1' || this.address.haveElevator === 1) {
          return total
        }
        let floor = this.address.floor ? Number(this.address.floor) - 1 : Number(this.address.floorLevel) - 1
        // console.log('需要计算楼层费的层数为：' + floor)
        this.selectGoods.forEach((good) => {
          total += floor * good.amount * 100
        })
        return total
      },
      totalFreightPrice () {
        let total = 0
        this.selectGoods.forEach((good) => {
          total += Number(good.freight) * good.amount
        })
        return total
      },
      payDesc () {
        if (this.totalGasPrice === 0) {
          return '请选择商品'
        } else {
          if (this.fullPath === '/lpgshop') {
            return '结算'
          } else {
            return '提交订单'
          }
        }
      },
      payClass () {
        if (this.totalGasPrice > 0) {
          return 'enough'
        } else {
          return 'not-enough'
        }
      },
      listShow () {
        if (!this.totalamount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        return show
      }
    },
    methods: {
      pay () {
        if (this.totalGasPrice === 0) {
          return
        }
        this.setSelectGoods(this.selectGoods)
        let currentFullPath = this.$router.history.current.fullPath
        if (currentFullPath === '/lpgShop' || currentFullPath === '/lpgshop') {
          // 当前路由在店铺时  跳转到确认订单
          this.$router.push('/confirmOrder')
        } else { // 提交订单
          let userInfo = this.address
          let goodArr = []
          // 过滤掉  个数为0的good
          goodArr = this.selectGoods.filter(function (currentValue, index) {
            return currentValue.amount > 0
          })
          let selectFoodStr = JSON.stringify(goodArr)
          // console.log(goodArr)
          let gasCost = this.totalGasPrice
          let deliverCost = this.totalFreightPrice
          let floorCost = this.totalFloorPrice
          let totalCost = Number((floorCost + deliverCost + gasCost).toFixed(0))
          // 判断预约时间是否为半个小时延迟还是自己选择的时间
          let bookingTime
          if (this.selectAppointmentTimeStamp === 0) { // 选择半个小时延迟
            bookingTime = this.appointmentTime
          } else {
            let currentTimeStamp = Date.parse(new Date())
            console.log('当前时间戳为：' + currentTimeStamp)
            console.log('选择的预约时间戳为：' + this.selectAppointmentTimeStamp)
            let deltaStamp = this.selectAppointmentTimeStamp - currentTimeStamp
            console.log('相差时间戳为：' + deltaStamp)
            if (deltaStamp >= 30 * 60 * 1000) { // 半个小时后
              bookingTime = dateFormat(new Date(this.selectAppointmentTimeStamp), 'YYYY-MM-DD HH:mm:ss')
            } else {
              this.showAlert = true
              this.alertContent = '预约时间至少为半个小时之后~'
              return
            }
          }
          let data = {
            'openId': cookie.get('openId'),
            'userId': cookie.get('appUserId'), // appUserId
            'userCode': cookie.get('orderGasNo'), // 订气编号
            // 'orderGasNo': cookie.get('orderGasNo'), // 订气编号
            'deliverCompanyId': userInfo.deliverCompanyId ? userInfo.deliverCompanyId : userInfo.orgCode, // 公司id
            'deliverDepartmentId': userInfo.deliverDepartmentId ? userInfo.deliverDepartmentId : userInfo.departmentCode, // 门店id
            'receivePerson': userInfo.userName, // 收货人姓名
            'receiveMobile': userInfo.mobile, // 收货人手机
            'deliverAddress': userInfo.userArea ? userInfo.userArea + userInfo.userAddress : userInfo.areaName + userInfo.detailAddress, // 送货地址
            'elevator': userInfo.elevator ? userInfo.elevator : userInfo.haveElevator,  // 是否有电梯 1:有 0：无
            'floor': userInfo.floor ? userInfo.floor : userInfo.floorLevel, // 楼层
            'payType': '1', // 支付方式  1：货到付款   2：在线支付
            'deliveryType': '1', // 配送方式  1：送货上门    2：上门提货
            'bookingTime': bookingTime, // 预约时间
            'customerRemark': this.remarkText,
            'gasCost': gasCost, // 燃气费 精确到分
            'waterCost': 0, // 水费（不含送水费、楼层费）
            'auxiliaryMaterialCost': 0, // 辅料费
            'deliverCost': deliverCost, // 运费
            'floorCost': floorCost, // 楼层费
            'totalCost': totalCost, // 总费用
            'lstGasStr': selectFoodStr, // 瓶装气商品列表
            'lstWaterStr': '[]', // 桶装水商品列表
            'lstAuxinliaryMaterialStr': '[]', // 辅料商品列表
            'integralUse': 0, // 是否使用积分
            'integralConsume': 0, // 抵扣积分
            'integralMoney': 0 // 积分抵扣金额
          }
          console.log(data)
          this.showLoading = true
          this.$http.post(postGasOrderUrl, JSON.stringify(data)).then((res) => {
            console.log(res.data)
            this.showLoading = false
            if (res.data.status === '1') {
              this.$router.push('/orderCenter')
            }
          })
        }
      },
      addGood (target) {
        this.$emit('add', target)
      },
      toggleList () {
        if (this.$router.history.current.path === '/lpgshop') { // 确认订单页面不展示弹出层
          return
        }
        if (!this.totalamount) {
          return
        } else {
          this.fold = !this.fold
        }
      },
      empty () {
        this.selectGoods.forEach((item) => {
          item.amount = 0
        })
      },
      hideList () {
        this.fold = true
      },
      ...mapMutations({
        setSelectGoods: 'SET_SELECT_GOODS'
      })
    },
    components: {
      cartcontrol,
      Loading,
      Alert
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background #000
    .content
      display flex
      background #141d27
      font-size 0
      height 48px
      line-height 48px
      color rgba(255, 255, 255, 0.4) 
      .content-left
        flex 1
        flex-direction row-reverse
        color #fff
        padding 4px 10px
        .top,.bottom
          height 20px 
          line-height 20px
          font-size 14px
          font-weight 600             
          .red
            color #f96363
          .remark 
            font-size 10px  
        .bottom-spec
          display flex 
          justify-content space-between
          .floor 
            margin-right 30px            
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background-color rgb(0, 160, 220)
            .iconfont
              font-size 24px
              color #80858a
              line-height 44px
              &.highlight
                color #fff
          .number
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 10px
            font-weight 700
            color #fff
            background-color rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff

        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 0 0 8px
          font-weight 700
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          background #2b333b
          &.not-enough
            background-color #2b333b
          &.enough
            background-color #00b43c
            color #fff

    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(.49,-0.29,.75,.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px;
        background #f3f5f7;
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          font-weight 200
          color rgb(7, 17, 27)
          line-height 40px
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
          line-height 40px
      .list-content
        padding 0 18px
        max-height 400px
        overflow hidden
        background #fff
        .good
          position relative
          padding 12px 0
          box-sizing border-box
          border-bottom:1px solid rgba(7, 17, 27, 0.1)
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 8px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: -5px

  .list-mark
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
