<template>
  <div class="confirm-order">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">确认订单</h3>
    </div>
    <div class="content">
      <div class="info">
        <div class="phone">
          <div class="left">用户姓名:</div>
          <div class="right">{{address.userName}}</div>
        </div>
        <div class="phone">
          <div class="left">联系方式:</div>
          <div class="right">{{address.mobile}}</div>
        </div>
        <div class="address">
          <div class="left">收货地址:</div>
          <div class="right">{{address.areaName}}{{address.detailAddress}}</div>
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
          <datetime 
            v-model="appointmentTime" 
            format="YYYY-MM-DD HH:mm" 
            @on-change="selectAppointmentTime" 
            title="预约送达时间" 
            :min-year="minYear" 
            :max-year="maxYear" 
            required>
          </datetime>
        </div>
        <div class="note">
          <span>配送人员将在预约时间前/后半小时内为您送达</span>
        </div>
        <div class="remark">
          <x-input title="备注：" placeholder="请根据您的实际情况备注说明" v-model="remarkText"></x-input>
        </div>
      </div>
      <div class="shop">
        <div class="shop-name">{{address.departmentName}}</div>
        <div class="good-list" ref="goodWrapper">
          <ul>
            <li class="good" v-for="good in selectGoods"  v-show="good.amount>0">
              <div class="good-name">
                <img class="logo" src="../../common/image/LPG_small.png" width="20" height="20">
                <span class="name">{{good.gasTypeName}}</span>                
              </div>
              <div class="good-price">￥{{good.bottlePrice}}</div>
              <div class="freight-price" v-show="good.freight&&Number(good.freight)!==0">送气费{{good.freight}}元&nbsp;/&nbsp;瓶</div>
              <div class="floor-price" v-show="address.elevator==='0'||address.haveElevator===0">楼层费1.00元&nbsp;/&nbsp;层</div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :good="good" @add="addGood"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="shopcart-wrapper" ref="shopcartWrapper">
      <shopcart 
        :selectGoods="selectGoods" 
        :address="address" 
        :appointmentTime="appointmentTime"  
        :appointmentTimeStamp="appointmentTimeStamp"  
        :selectAppointmentTimeStamp="selectAppointmentTimeStamp"
        :remarkText="remarkText" 
      ></shopcart>
    </div>
  </div>
</template>
<script type="text/ECMAScript-6">
  import { cookie, Datetime, XInput, dateFormat } from 'vux'
  import { mapGetters } from 'vuex'
  import shopcart from '../shopcart/shopcart.vue'
  import cartcontrol from '../../base/cartcontrol/cartcontrol.vue'
  export default {
    data () {
      return {
        minYear: 2017,
        maxYear: 2099,
        remarkText: '',
        address: JSON.parse(cookie.get('defaultAddress')),
        selectAppointmentTimeStamp: 0
      }
    },
    computed: {
      ...mapGetters({
        selectGoods: 'selectGoods'
      }),
      appointmentTime: {
        get: function () {
          let nowTimeStamp = Date.parse(new Date()) + 30 * 60 * 1000
          let halfHourDelayTime = dateFormat(new Date(nowTimeStamp), 'YYYY-MM-DD HH:mm:ss')
          return halfHourDelayTime
        },
        set: function () {
        }
      },
      appointmentTimeStamp () {
        let halfHourDelayTimeStamp = Date.parse(new Date()) + 30 * 60 * 1000
        return halfHourDelayTimeStamp
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      addGood (target) {
        this.$emit('add', target)
      },
      selectAppointmentTime (newVal) {
        // 将选择的时间转化为时间戳   提交订单时判断
        let time = newVal + ':00'
        // alert('选择的预约时间：' + time)
        // alert('格式化时间例子为：' + new Date('2017/11/13 18:09:06'))
        // alert('格式化时间为：' + new Date(newVal))
        let timeParse = time.replace(/-/g, '/')
        // alert('格式化时间为：' + timeParse)
        // alert('格式化时间例子为：' + new Date(timeParse))
        this.selectAppointmentTimeStamp = Date.parse(new Date(timeParse))
        // alert('选择的预约时间戳为：' + this.selectAppointmentTimeStamp)
        return time
      }
    },
    components: {
      shopcart,
      Datetime,
      XInput,
      cartcontrol
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .confirm-order
    background-color #f4f4f4
    min-height 100%
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
      .info
        background-color #fff
        margin-top 10px
        line-height 24px
        padding 5px 15px
        font-size 14px
        font-weight 600
        .phone, .address
          display flex 
          padding 4px 0
          color #6a6a6a          
          .left 
            flex 0 0 70px 
          .right 
            flex 1
      .pay
        margin-top 10px
        background-color #fff
        padding 0 15px
        font-size 14px
        .pay-way, .send-way
          display flex
          justify-content space-between
        .pay-way 
          padding 12px 0
        .send-way 
          padding 6px 0 12px 0
          border-bottom 1px solid #e1e1e1    
        .receive-time
          padding-top 5px
          .vux-datetime
            padding 10px 0
            font-size 14px
        .note
          padding 6px 0 10px 0
          color #a4a4a4
          font-size 12px
          border-bottom 1px solid #e1e1e1    
        .remark
          .vux-x-input
            padding 10px 0
      .shop
        margin-top 10px
        margin-bottom 48px
        padding 0 15px
        background-color #fff
        .shop-name
          background-color #fff
          color #6a6a6a
          padding 10px 0
          font-size 16px
          font-weight 600
          border-bottom 1px solid #e1e1e1
      .good-list
        background-color #fff
        .good
          padding 15px 10px
          font-size 0
          position relative
          border-bottom 1px solid #e6e6e6
          font-size 14px
          .good-name
            color #747474
            display flex
            align-items center
            .name 
              font-weight 500
              margin-left 10px
          .good-price
            font-weight bold
            color #f50000
            margin-top 10px
            font-size 16px
          .freight-price, .floor-price  
            margin-top 8px
            color #a4a4a4   
          .cartcontrol-wrapper
            position absolute
            right 20px
            bottom 20px
            span
              font-size 14px
    // .shopcart-wrapper
    //   position absolute
    //   left 0 
    //   bottom 48px
    //   height 48px
    //   width 100%
</style>
