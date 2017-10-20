<template>
  <div class="company-shop">
    <div class="header">
      <h3>商品选择</h3>
      <div class="center" @click="enter">
        <i class="iconfont">&#xe60f;</i>
      </div>
    </div>
    <!-- <div class="slider-wrapper">
      <slider>
        <div v-for="item in imageUrls">
          <img :src="item">
        </div>
      </slider>
    </div> -->
    <div class="good-list"  ref="goodList">
      <div class="title">
        {{goodsTitle}}
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
    <shopcart :selectGoods="selectGoods"></shopcart>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
  </div>
</template>
<script type="text/ECMAScript-6">
  const getGasListUrl = '/lw/controller/forGas/getGasListMas.do'

  import cartcontrol from '../../base/cartcontrol/cartcontrol.vue'
  import shopcart from '../shopcart/shopcart.vue'
  import slider from '../../base/slider/slider.vue'
  import { Loading, cookie } from 'vux'

  export default {
    data () {
      return {
        amount: 0,
        goodsTitle: '瓶装气',
        goods: [],
        showLoading: true,
        loadingText: '加载中...',
        imageUrls: [
          'http://00.rc.xiniu.com/g1/M00/D0/06/CgAGS1kpHLKAN3VUAAI-cZamYUA420.jpg',
          'http://00.rc.xiniu.com/g1/M00/D0/06/CgAGS1kpHLKADdIQAALW1KkkGiI047.jpg',
          'http://00.rc.xiniu.com/g1/M00/D0/06/CgAGS1kpHLKAc4g1AAW35IqvU_c466.jpg'
        ]
      }
    },
    created () {
      let data = {
        orderGasNo: cookie.get('orderGasNo')
      }
      this.$http.post(getGasListUrl, JSON.stringify(data)).then((res) => {
        console.log(res.data.data)
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
      enter () {
        this.$router.push('/OrderCenter')
      }
    },
    components: {
      cartcontrol,
      shopcart,
      Loading,
      slider
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
    .center
      position absolute
      right 10px
      top 0
      padding 0 10px
      .iconfont
        font-size 20px
  .slider-wrapper
    overflow hidden
  .good-list
    .title
      height 20px
      line-height 20px
      padding 10px 0 10px 10px
      background-color #eee
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
