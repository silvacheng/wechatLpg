<template>
  <div class="order-center">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">订单中心</h3>
    </div>
    <div class="content-wrapper">
      <tab>
        <tab-item selected @on-item-click="onItemClick">全部</tab-item>
        <tab-item @on-item-click="onItemClick">待发货</tab-item>
        <tab-item @on-item-click="onItemClick">待收货</tab-item>
        <tab-item @on-item-click="onItemClick">已发货</tab-item>
      </tab>
      <div class="content">
        <ul>
          <li class="order" v-for="order in totalOrder" v-show="totalOrder.length>0">
            <div class="order-title">
              <span class="shop">华来门店</span>
              <span class="status">等待卖家发货</span>
            </div>
            <div class="good" @click="enterDetail(order)">
              <ul>
                <li class="good-item" v-for="good in order.lstGas">
                  <div class="left">
                    <img src="../../common/image/LPG_small.png" width="35" height="35">
                  </div>
                  <div class="right">
                    <div class="right-top">
                      <span>{{good.gasTypeName}}</span>
                    </div>
                    <div class="right-middle">
                      <span>送气费10.00</span><span class="right">楼层费1.00元&nbsp;/&nbsp;层</span>
                    </div>
                    <div class="right-bottom">
                      <div class="price">￥{{good.bottlePrice}}</div>
                      <div>x {{good.amount}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="info">
              <div class="time">{{order.bookingTime.substring(0,10)}}</div>
              <div class="total">共{{order.lstGas.length}}件商品&nbsp;合计:<span>￥{{order.totalCost/100}}</span></div>
            </div>
            <div class="operate">
              <span @click="deleteOrder">删除订单</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
  </div>
</template>
<script type="text/ECMAScript-6">
  import { Tab, TabItem, cookie, Loading } from 'vux'
  import { getGasOrderUrl, updateGasOrderUrl } from '../../api/config'
  export default {
    data () {
      return {
        totalOrder: [],
        loadingText: '加载订单列表中..',
        showLoading: true,
        address: JSON.parse(cookie.get('defaultAddress'))
      }
    },
    created () {
      let orderGasNo = cookie.get('orderGasNo')
      let data = {
        'orderGasNo': orderGasNo
      }
      console.log(data)
      this.$http.post(getGasOrderUrl, JSON.stringify(data)).then((res) => {
        if (res.data.status === '1') {
          this.totalOrder = res.data.data
          this.showLoading = false
        }
      })
    },
    methods: {
      back () {
        this.$router.push('/lpgshop')
      },
      onItemClick (index) {
        console.log('on item click:', index)
      },
      enterDetail (item) {
        cookie.set('selectedOrder', JSON.stringify(item))
        this.$router.push('/orderDetail')
      },
      deleteOrder () {
        let data = {
          id: '615132',
          orderState: 2,
          deliverDepartmentId: '111212000001',
          orderCode: '171101880025',
          cancelReason: '中燃慧生活'
        }
        this.$http.post(updateGasOrderUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1') {
            this.goods = res.data.data
            this.showLoading = false
          }
        })
      }
    },
    components: {
      Tab,
      TabItem,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    height 40px
    line-height 40px
    position relative
    text-align center
    color #fff
    border-bottom 1px solid #dadada
    background-color #38d164
    .back
      position absolute
      left 0
      font-size 20px
      padding 0 8px
      font-weight bold
    .title
      font-weight bold
  .content-wrapper
    background-color #f3f3f3
    .order
      margin-top 10px
      background-color #fff
      padding 0 15px      
      .order-title
        display flex
        justify-content space-between
        padding 3px 15px
        height 30px
        line-height 30px
        font-size 14px
        border-bottom 1px solid #e1e1e1
        .status 
          color #38d164
      .good
        padding 10px 15px
        border-bottom 1px solid #e1e1e1
        font-size 12px
        color #6a6a6a
        .good-item 
          display flex
          margin-bottom 10px
          &:last-child
            margin-bottom 0
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
      .info
        background-color #fff
        display flex
        justify-content space-between
        padding 11px 15px
        font-size 14px
        border-bottom 1px solid #e1e1e1
        .time 
          color #a4a4a4
        .total
          background-color #fff
          span
            color #bf3447
      .operate
        background-color #fff
        padding 8px
        text-align right
        span
          font-size 14px
          padding 6px
          border 1px solid #a4a4a4
          border-radius 10%
          display inline-block
</style>
