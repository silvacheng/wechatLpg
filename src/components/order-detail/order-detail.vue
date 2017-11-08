<template>
  <div class="order-detail">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">订单详情</h3>
    </div>
    <div class="order-state">
      <div class="left">{{orderStateDesc}}</div>
      <div class="right">
        <img :src="imageSrc" alt="" width="42" height="36">
      </div>
    </div>
    <div class="basic-info">
      <div class="phone">
        <i class="iconfont">&#xe619;</i><span>联系电话：{{orderDetail.receiveMobile}}</span>
      </div>
      <div class="address">
         <i class="iconfont">&#xe60d;</i><span>收货地址：{{orderDetail.deliverAddress}}</span>
      </div>
    </div>
    <div class="detail-info">
      <div> 
        <span class="left">订单号</span> 
        <span class="right">{{orderDetail.orderCode}}</span>
      </div>
      <div> 
        <span class="left">创建时间</span> 
        <span class="right">{{orderDetail.createTime}}</span>
      </div>
      <div> 
        <span class="left">预计送达</span> 
        <span class="right">{{orderDetail.bookingTime}}</span>
      </div>
      <div> 
        <span class="left">配送方式</span> 
        <span class="right">货到付款&nbsp;&nbsp;送货上门</span>
      </div>
      <div> 
        <span class="left">配送时间</span> 
        <span class="right">{{orderDetail.finishTime}}</span>
      </div>
    </div>
    <div class="order-info">
      <div class="order-title">
        <div class="shop">{{defaultAddress.deliverDepartmentName||defaultAddress.departmentName}}</div>
        <div class="state">{{orderStateDesc}}</div>
      </div>
      <div class="good-wrapper">
        <ul>
          <li class="good-item" v-for="good in orderDetail.lstGas" v-show="good.amount>0">
            <div class="left">
              <img src="../../common/image/LPG_small.png" width="35" height="35">
            </div>
            <div class="right">
              <div class="right-top">
                <span>{{good.gasTypeName}}</span>
              </div>
              <div class="right-middle">
                <span>送气费{{good.freight}}元&nbsp;/&nbsp;瓶</span><span class="right">楼层费1.00元&nbsp;/&nbsp;层</span>
              </div>
              <div class="right-bottom">
                <div class="price">￥{{good.bottlePrice}}</div>
                <div>x {{good.amount}}</div>
              </div>
            </div>            
          </li>
        </ul>        
      </div>
      <div class="order-price">
        <div class="total">合计&nbsp;:<span>￥{{orderDetail.totalCost/100}}</span></div>
        <div class="other-info">共{{goodAmout}}件商品（楼层费:￥5.00;送气费:￥10.00）</div>
      </div>
    </div>      
  </div>  
</template>
<script type="text/ECMAScript-6">
  import { cookie } from 'vux'
  export default {
    data () {
      return {
        orderDetail: JSON.parse(cookie.get('selectedOrder')),
        defaultAddress: JSON.parse(cookie.get('defaultAddress'))
      }
    },
    computed: {
      orderStateDesc () {
        let state = this.orderDetail.orderState
        let desc
        // console.log(state)
        if (state === '2') {
          desc = '等待卖家发货'
        } else if (state === '3') {
          desc = '等待买家收货'
        } else if (state === '4') {
          desc = '交易完成'
        } else if (state === '5') {
          desc = '交易关闭'
        } else if (state === '6') {
          desc = '已取消'
        }
        return desc
      },
      goodAmout () {
        let num = 0
        let goodArr = this.orderDetail.lstGas
        for (let i = 0; i < goodArr.length; i++) {
          num += goodArr[i].amount
        }
        return num
      },
      imageSrc () {
        let state = this.orderDetail.orderState
        let desc
        if (state === '2') {
          desc = require('../../common/image/wait_send.png')
        } else if (state === '3') {
          desc = require('../../common/image/wait_receive.png')
        } else if (state === '4') {
          desc = require('../../common/image/succeed_order.png')
        } else if (state === '5') {
          desc = require('../../common/image/closed_order.png')
        } else if (state === '6') {
          desc = require('../../common/image/cancel_order.png')
        }
        return desc
      }
    },
    methods: {
      back () {
        this.$router.back()
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .order-detail
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
    .order-state
      color #38d164 
      font-size 24px
      height 74px
      display flex 
      align-items center
      .left 
        flex 1
        text-align center
      .right 
        flex 1
        text-align center
          
    .basic-info 
      padding 10px 15px
      color #6a6a6a
      border-top 1px solid #ededed
      div 
        padding 8px 0
        .iconfont 
          margin-right 10px
    .detail-info 
      padding 0 15px
      div
        border-top 1px solid #ededed
        line-height 16px
        padding 10px 0
        font-size 14px
        color #a4a4a4
        display flex 
        .left 
          flex 1
        .right 
          flex 2  
    .order-info 
      padding 0 15px 
      border-top 3px solid #efefef
      .order-title
        display flex
        justify-content space-between
        padding 10px 0
        font-size 14px
        border-bottom 1px solid #e1e1e1
        color #a4a4a4
        .shop
          color #7e7e7e
          font-weight bold  
    .good-wrapper
      padding 10px 0
      font-size 12px
      color #6a6a6a
      .good-item 
        display flex
        padding 10px
        border-bottom 1px solid #e1e1e1
        .left 
          flex 0 0 45px
          display flex 
          align-items center              
        .right 
          flex 1 
          .right-top
            span 
              font-size 14px
              color #6a6a6a
              font-weight bold
          .right-middle 
            margin-top 8px
            span 
              color #a4a4a4
              &.right 
                margin-left 20px
          .right-bottom 
            margin-top 8px 
            display flex 
            justify-content space-between
            font-size 14px              
            .price
              color #f50000
              font-weight bold              

    .order-price
      color #6a6a6a
      font-size 14px
      font-weight 600
      div
        display flex 
        justify-content flex-end
        padding-top 8px
      .total 
        span 
          color #f50000  

</style> 
