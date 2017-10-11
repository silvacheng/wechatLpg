<template>
  <div class="order-center">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">订单中心</h3>
    </div>
    <div class="content-wrapper">
      <tab>
        <tab-item selected @on-item-click="onItemClick">全部</tab-item>
        <tab-item @on-item-click="onItemClick">待收货</tab-item>
        <tab-item @on-item-click="onItemClick">待发货</tab-item>
      </tab>

      <div class="content">
        <ul>
          <li class="order">
            <div class="order-title">
              <span class="shop">华来门店</span>
              <span class="status">等待卖家发货</span>
            </div>
            <div class="good">
              <dl>
                <dt></dt>
                <dd></dd>
              </dl>
            </div>
            <div class="info">
              <div class="time">2017-09-02</div>
              <div class="total">共1件商品 合计<span>￥32.00</span></div>
            </div>
            <div class="operate">
              <span>删除订单</span>
            </div>
          </li>
          <li class="order">
            <div class="order-title">
              <span class="shop">华来门店</span>
              <span class="status">等待卖家发货</span>
            </div>
            <div class="good">
              <dl>
                <dt></dt>
                <dd></dd>
              </dl>
            </div>
            <div class="info">
              <div class="time">2017-09-02</div>
              <div class="total">共1件商品 合计<span>￥32.00</span></div>
            </div>
            <div class="operate">
              <span>删除订单</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ECMAScript-6">
  import { Tab, TabItem } from 'vux'
  export default {
    methods: {
      back () {
        this.$router.push('/lpgshop')
      },
      onItemClick (index) {
        console.log('on item click:', index)
      }
    },
    components: {
      Tab,
      TabItem
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    height 40px
    line-height 40px
    position relative
    text-align center
    background-color #fff
    border-bottom 1px solid #dadada
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
      .order-title
        display flex
        justify-content space-between
        padding 0 8px
        background-color #fff
        height 30px
        line-height 30px
        font-size 14px
      .good
          height 80px
      .info
        background-color #fff
        display flex
        justify-content space-between
        padding 0 8px
        font-size 14px
        height 30px
        line-height 30px
      .total
        background-color #fff
        span
          color #bf3447
      .operate
        height 50px
        line-height 50px
        background-color #fff
        padding 0 8px
        text-align right
        span
          font-size 14px
          padding 6px
          border 1px solid #eeeeee
          border-radius 5%
</style>
