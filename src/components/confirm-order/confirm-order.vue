<template>
  <div class="confirm-order">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">确认订单</h3>
    </div>
    <div class="content">
      <div class="info" @click="selectAddress">
        <div class="phone">
          <span>联系电话:</span>
          <span>{{address.phone}}</span>
        </div>
        <div class="address">
          <span>收货地址:</span>
          <span>{{address.address}}{{address.detailAddress}}</span>
        </div>
        <div class="arrow-right">
          <i class="iconfont enter">&#xe601;</i>
        </div>
      </div>
      <div class="pay">
        <div class="pay-way">
          <span>支付方式</span>
          <span>货到付款</span>
        </div>
        <div class="send-way">
          <span>配送方式</span>
          <span>送货上门</span>
        </div>
        <div class="receive-time">
          <datetime v-model="appointmentTime" format="YYYY-MM-DD HH:mm" @on-change="selectAppointmentTime" title="预约送达时间" :min-year="minYear" :max-year="maxYear" required></datetime>
        </div>
        <div class="note">
          <span>配送人员将在预约时间前/后半小时内为您送达</span>
        </div>
        <div class="remark">
          <x-input title="备注：" placeholder="
请根据您的实际情况备注说明"></x-input>
        </div>
      </div>
      <div class="shop">
        <div class="shop-name">XXX店铺</div>
        <div class="good-list" ref="goodWrapper">
          <ul>
            <li class="good" v-for="good in selectGoods"  v-show="good.count>0">
              <div class="good-name">{{good.gasTypeName}}</div>
              <div class="good-price">￥{{good.bottlePrice}}</div>
              <div class="cartcontrol-wrapper">
                <span>x&nbsp;{{good.count}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <shopcart :selectGoods="selectGoods"></shopcart>
  </div>
</template>
<script type="text/ECMAScript-6">
  import { cookie, Datetime, XInput } from 'vux'
  import { mapGetters } from 'vuex'
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
//  import cartcontrol from '../../base/cartcontrol/cartcontrol.vue'
  export default {
    data () {
      return {
        scrollY: 0,
        appointmentTime: '2017-9-29 14:59:23',
        minYear: 2017,
        maxYear: 2099
      }
    },
    computed: {
      ...mapGetters({
        selectGoods: 'selectGoods'
      }),
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
    created () {
      setTimeout(() => {
        this._initScroll()
      })
    },
    methods: {
//      addGood (target) {
//        this.$emit('add', target)
//      },
      back () {
        this.$router.back()
      },
      _initScroll () {
        this.goodScroll = new BScroll(this.$refs.goodWrapper, {
          click: true
        })
        this.goodScroll.on('scroll', (pos) => {
          // 去四舍五入后的绝对值
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      selectAppointmentTime (val) {
        console.log('change', val)
      },
      selectAddress () {
        this.$router.push('/addressManage')
      }
    },
    components: {
      shopcart,
//      cartcontrol,
      Datetime,
      XInput
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .confirm-order
    height 100%
    background-color #f4f4f4
    .header
      height 40px
      line-height 40px
      position relative
      text-align center
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
      .info
        background-color #fff
        margin-top 20px
        line-height 30px
        padding 0 15px
        font-size 12px
        position relative
        .arrow-right
          position absolute
          margin-top -16px
          right 5%
          top 50%
          .enter
            font-size 16px
      .pay
        margin-top 20px
        background-color #fff
        padding 0 10px
        font-size 12px
        .pay-way, .send-way
          display flex
          justify-content space-between
          height 30px
          line-height 30px
        .receive-time
          .vux-datetime
            padding 10px 0
            font-size 12px
        .note
          height 20px
          line-height 20px
          color #666
          font-size 10px
        .remark
          .vux-x-input
            padding 10px 0
      .shop
        margin-top 20px
        .shop-name
          height 30px
          line-height 30px
          background-color #fff
          padding 0 10px
          font-size 14px
      .good-list
        .title
          height 20px
          line-height 20px
          padding 10px 0 10px 10px
          background-color #eee
        .good
          padding 10px
          font-size 0
          position relative
          border-bottom 1px solid #e6e6e6
          .good-name
            font-size 14px
            font-weight 200
          .good-price
            font-size 12px
            color red
            margin-top 10px
          .cartcontrol-wrapper
            position absolute
            right 20px
            top 15px
            span
              font-size 14px

</style>
