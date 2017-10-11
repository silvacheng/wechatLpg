<template>
  <div class="cartcontrol" :index="index">
    <transition name="move">
      <div class="cart-decrease" v-show="good.count>0" @click.stop.prevent="decreaseCart">
        <i class="iconfont">&#xe6e8;</i>
      </div>
    </transition>
    <div class="cart-count" v-show="good.count>0">{{good.count}}</div>
    <div class="cart-add" @click.stop.prevent="addCart">
      <i class="iconfont">&#xe615;</i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      good: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    methods: {
      addCart (event) {
        if (!this.good.count) {
          Vue.set(this.good, 'count', 1)
        } else {
          this.good.count++
        }
        this.$emit('add', event.target)
      },
      decreaseCart (event) {
        if (this.good.count > 0) {
          this.good.count--
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      line-height: 24px
      font-size: 24px
      transform: translate3d(0, 0, 0)
      .iconfont
        display: inline-block;
        color: #00a0dc
        padding: 6px
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .iconfont
          transform: rotate(180deg)
    .cart-count
      display inline-block
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 14px
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      .iconfont
        display: inline-block;
        color: #00a0dc
        padding: 6px
</style>
