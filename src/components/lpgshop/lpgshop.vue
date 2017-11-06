<template>
  <div class="company-shop">
    <div class="header">
      <div>
        <h3>
          <div class="select-address" @click="changeAddress">
            <i class="iconfont left">&#xe60d;</i>
            <span class="current-address">{{address.userAddress||address.detailAddress}}</span>
            <i class="iconfont right">&#xe601;</i>
          </div>
        </h3>
      </div>
      <div class="center" @click="enterOrderCenter">
        <i class="iconfont">&#xe600;</i>
      </div>
    </div>
    <div class="good-list"  ref="goodList">
      <div class="title">
        <img src="../../common/image/LPG_small.png" width="20" height="20">
        <span>{{goodsTitle}}</span>
      </div>
      <ul>
        <li class="good" v-for="good in goods">
          <div class="good-name">{{good.gasTypeName}}</div>
          <div class="good-price">￥{{good.bottlePrice}}</div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :good="good" @add="addGood"></cartcontrol>
          </div>
        </li>
      </ul>
    </div>
    <shopcart :selectGoods="selectGoods" :address="address"></shopcart>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
  </div>
</template>
<script type="text/ECMAScript-6">
  import cartcontrol from '../../base/cartcontrol/cartcontrol.vue'
  import shopcart from '../shopcart/shopcart.vue'
  import { Loading, cookie } from 'vux'
  import { getGasListUrl } from '../../api/config'
  export default {
    data () {
      return {
        amount: 0,
        goodsTitle: '瓶装气',
        goods: [],
        showLoading: true,
        loadingText: '加载中...',
        address: JSON.parse(cookie.get('defaultAddress'))
      }
    },
    created () {
      let data = {
        orderGasNo: cookie.get('orderGasNo')
      }
      this.$http.post(getGasListUrl, JSON.stringify(data)).then((res) => {
        // console.log(res.data.data)
        if (res.data.status === '1') {
          this.goods = res.data.data
          this.showLoading = false
        }
      })
    },
    computed: {
      selectGoods () {
        let goodArr = []
        this.goods.forEach((good) => {
          if (good.amount && good.amount > 0) {
            goodArr.push(good)
          }
        })
        return goodArr
      }
    },
    methods: {
      addGood (target) {
        this.$emit('add', target)
      },
      enterOrderCenter () {
        this.$router.push('/orderCenter')
      },
      changeAddress () {
        // this.showLoading = true
        // this.loadingText = '正在跳转..'
        this.$router.push('/addressManage')
      }
    },
    components: {
      cartcontrol,
      shopcart,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .header
    height 40px
    line-height 40px
    font-weight bold
    text-align center
    border-bottom 1px solid #dadada
    background-color #38d164
    color #fff
    position relative
    .select-address 
      display inline-block 
      padding 0 20px
      max-width 200px 
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
      position relative 
      .iconfont 
        position absolute
        &.left 
          left 0px 
        &.right 
          right 0px  
    .center
      position absolute
      right 10px
      top 0
      padding 0 10px
  .slider-wrapper
    overflow hidden
  .good-list
    .title
      height 20px
      line-height 20px
      padding 10px 0 10px 10px
      background-color #eee
      display flex
      span 
        height 20px 
        line-height 20px
        margin-left 6px
        font-size 14px
        display inline-block
    ul
      margin-bottom 48px  
      .good
        padding 15px 10px
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
          top 10px
</style>
