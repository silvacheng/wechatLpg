<template>
  <div class="order-detail">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">订单详情</h3>
    </div>
    <div class="order-state">
      <div class="left">已取消</div>
      <div class="right"></div>
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
        <span class="left">预计送达时间</span> 
        <span class="right">2017-10-25 16:12:46</span>
      </div>
      <div> 
        <span class="left">配送方式</span> 
        <span class="right">货到付款&nbsp;&nbsp;送货上门</span>
      </div>
    </div>
    <div class="order-info">
      <div class="title">
        <div>华来门店</div>
        <div>已取消</div>
      </div>
      <div class="good">        
      </div>
    </div>      
  </div>  
</template>
<script type="text/ECMAScript-6">
  import { cookie } from 'vux'
  export default {
    data () {
      return {
        orderDetail: JSON.parse(cookie.get('selectedOrder'))
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
      margin 25px 0
      display flex 
      .left 
        flex 1
        text-align center
      .right 
        flex 1  
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
        padding 12px 0
        font-size 14px
        color #a4a4a4
        display flex 
        .left 
          flex 1
        .right 
          flex 2  
    .order-info 
      padding 10px 15px 
      border-top 3px solid #efefef
      .title 
        color #6a6a6a
        display flex
        justify-content space-between         
    
</style> 
