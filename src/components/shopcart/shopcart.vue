<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="top">合计商品：<span class="red">{{totalamount}}件</span></div>
          <div class="bottom">合计金额：<span class="red">￥{{totalPrice}}</span>&nbsp;&nbsp;<span class="remark">(不包含送气费，楼层费)</span></div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
        </div>
      </div>
      <transition name="fold">
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
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mark" v-show="listShow" @click="hideList"></div>
    </transition>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
  </div>
</template>
<script type="text/ECMAScript-6">
  import cartcontrol from '../../base/cartcontrol/cartcontrol.vue'
  import { cookie, Loading } from 'vux'
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
      remarkText: {
        type: String
      }
    },
    data () {
      return {
        fold: true,
        showLoading: false,
        loadingText: '提交订单中...'
      }
    },
    computed: {
      totalPrice () {
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
      payDesc () {
        if (this.totalPrice === 0) {
          return '请选择商品'
        } else {
          if (this.$router.history.current.fullPath === '/lpgshop') {
            return '结算'
          } else {
            return '提交'
          }
        }
      },
      payClass () {
        if (this.totalPrice > 0) {
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
        if (this.totalPrice === 0) {
          return
        }
        this.setSelectGoods(this.selectGoods)
        let currentFullPath = this.$router.history.current.fullPath
        if (currentFullPath === '/lpgShop' || currentFullPath === '/lpgshop') {
          // 当前路由在店铺时  跳转到确认订单
          this.$router.push('/confirmOrder')
        } else { // 提交订单
          let userInfo = this.address
          let selectFoodStr = JSON.stringify(this.selectGoods)
          let data = {
            'userId': cookie.get('appUserId'), // appUserId
            'userCode': cookie.get('orderGasNo'), // 订气编号
            // 'orderGasNo': cookie.get('orderGasNo'), // 订气编号
            'deliverCompanyId': userInfo.deliverCompanyId, // 公司id
            'deliverDepartmentId': userInfo.deliverDepartmentId, // 门店id
            'receivePerson': userInfo.userName, // 收货人姓名
            'receiveMobile': userInfo.mobile, // 收货人手机
            'deliverAddress': userInfo.userArea + userInfo.userAddress, // 送货地址
            'elevator': userInfo.elevator,  // 是否有电梯 1:有 0：无
            'floor': userInfo.floor, // 楼层
            'payType': '1', // 支付方式  1：货到付款   2：在线支付
            'deliveryType': '1', // 配送方式  1：送货上门    2：上门提货
            'bookingTime': this.appointmentTime, // 预约时间
            'customerRemark': this.remarkText,
            'gasCost': this.totalPrice * 100, // 燃气费 精确到分
            'waterCost': 0, // 水费（不含送水费、楼层费）
            'auxiliaryMaterialCost': 0, // 辅料费
            'deliverCost': 0, // 运费
            'floorCost': 0, // 楼层费
            'totalCost': this.totalPrice * 100, // 总费用
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
      Loading
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
          .red
            color #f96363
          .remark 
            font-size 10px  
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
