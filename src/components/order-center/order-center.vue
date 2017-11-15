<template>
  <div class="order-center">
    <div class="header">
      <i class="iconfont back" @click="back">&#xe603;</i>
      <h3 class="title">我的订单</h3>
    </div>
    <div class="content-wrapper">
      <tab ref="tab">
        <tab-item selected @on-item-click="onItemClick">全部</tab-item>
        <tab-item @on-item-click="onItemClick">待发货</tab-item>
        <tab-item @on-item-click="onItemClick">待收货</tab-item>
        <tab-item @on-item-click="onItemClick">已收货</tab-item>
      </tab>
      <div class="content">
        <ul>
          <li class="order" 
          v-for="(order, index) in totalOrder" 
          v-show="selectOrderState==='all'||order.orderState===selectOrderState"
          >
            <div class="order-title">
              <span class="shop">{{order.deliverDepartmentName}}</span>
              <span class="status" v-show="order.orderState==='2'">等待卖家发货</span>
              <span class="status" v-show="order.orderState==='3'">等待买家收货</span>
              <span class="status" v-show="order.orderState==='4'">交易完成</span>
              <span class="status" v-show="order.orderState==='5'">交易关闭</span>
              <span class="status" v-show="order.orderState==='6'">已取消</span>
            </div>
            <div class="good-wrapper" @click.stop.prevent="checkOrder(order)">
              <ul>
                <li class="good-item" v-for="good in order.lstGas" v-show="good.amount>0">
                  <div class="left">
                    <img src="../../common/image/LPG_small.png" width="35" height="35">
                  </div>
                  <div class="right">
                    <div class="right-top">
                      <span>{{good.gasTypeName}}</span>
                    </div>
                    <div class="right-middle">
                      <span v-show="good.freight&&Number(good.freight)!==0">送气费{{good.freight/100}}元&nbsp;/&nbsp;瓶</span>
                      <span class="right" v-show="address.elevator==='0'||address.haveElevator===0">楼层费1.00元&nbsp;/&nbsp;层</span>
                    </div>
                    <div class="right-bottom">
                      <div class="price">￥{{good.bottlePrice/100}}</div>
                      <div>x {{good.amount}}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="info">
              <div class="time">{{order.createTime}}</div>
              <div class="total">共{{goodAmout(order)}}件商品&nbsp;合计:<span>￥{{order.totalCost/100}}</span></div>
            </div>
            <div class="operate">
              <span @click="deleteOrder(order)" v-show="order.orderState==='6'||order.orderState==='4'">删除订单</span>
              <span @click="cancelOrder(order)" v-show="order.orderState==='2'">取消订单</span>
              <span @click="contractOrder(order)" v-show="(order.orderState==='3'||order.orderState==='2')&&order.deliverPhone">联系我们</span>
              <span @click="confirmOrder(order)" v-show="order.orderState==='3'">确认收货</span>
            </div>
          </li>                   
        </ul>
          <div class="empty" v-show="showEmpty" ref="noneOrder">
            <div>
              <img src="../../common/image/no_order.png" alt="" width="64" height="80">
              <p>您还没有相关订单</p>
            </div>
          </div>        
      </div>
      <div>
        <confirm v-model="showConfirm"
          :title="confirmTitle"
          @on-cancel="onConfirmCancel"
          @on-confirm="onConfirmSure">
        </confirm>
      </div>
    </div>
    <Loading class="loading" :text="loadingText" :show="showLoading"></Loading>
  </div>
</template>
<script type="text/ECMAScript-6">
  import { Tab, TabItem, cookie, Loading, Confirm } from 'vux'
  import { getGasOrderUrl, updateGasOrderUrl } from '../../api/config'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        totalOrder: [],
        loadingText: '加载订单列表中..',
        showLoading: false,
        address: JSON.parse(cookie.get('defaultAddress')),
        confirmTitle: '',
        showConfirm: false,
        currentOperateOrder: {},
        selectOrderState: 'all',
        showEmpty: false,
        userAgent: window.navigator.userAgent
      }
    },
    computed: {
      tabItemSelectedIndex () {
        return cookie.get('selectedIndex') ? cookie.get('selectedIndex') : '0'
      }
    },
    created () {
      // 获取订单列表
      this.getOrderList()
    },
    watch: {
      selectOrderState (newState) {
        // console.log('当前选择的状态为：' + newState)
        if (newState === 'all') {
          if (this.totalOrder.length > 0) { // 全部订单
            this.showEmpty = false
          } else {
            this.showEmpty = true
          }
        } else { //  2,3，4  待发货 待收货 已收货
          if (this.totalOrder && this.totalOrder.length > 0) {
            for (let i = 0; i < this.totalOrder.length; i++) {
              if (this.totalOrder[i].orderState === newState) {
                this.showEmpty = false
                break
              } else {
                this.showEmpty = true
              }
            }
          }
        }
      }
    },
    methods: {
      back () {
        cookie.remove('selectedIndex')
        this.$router.push('/lpgshop')
      },
      goodAmout (order) {
        let num = 0
        let goodArr = order.lstGas
        for (let i = 0; i < goodArr.length; i++) {
          num += goodArr[i].amount
        }
        return num
      },
      onItemClick (index) {
        if (index === 0) {
          this.selectOrderState = 'all'
        } else if (index === 1) {
          this.selectOrderState = '2'
        } else if (index === 2) {
          this.selectOrderState = '3'
        } else if (index === 3) {
          this.selectOrderState = '4'
        }
        cookie.set('selectedIndex', index)
      },
      getOrderList () {
        this.showLoading = true
        let data = {
          'openId': cookie.get('openId')
        }
        // console.log(data)
        this.$http.post(getGasOrderUrl, JSON.stringify(data)).then((res) => {
          if (res.data.status === '1' && res.data.data.length > 0) {
            let orders = res.data.data
            // console.log(orders)
            this.totalOrder = orders.reverse()
            this.showEmpty = false
            this.showLoading = false
          } else if (res.data.status === '1' && res.data.data.length === 0) {
            this.totalOrder = []
            this.showEmpty = true
            this.showLoading = false
          } else {
            this.showEmpty = true
            this.showLoading = false
          }
        })
      },
      checkOrder (order) {
        this.currentOperateOrder = order
        this.$emit('select', order)
        this.orderDetail(order)
        this.$router.push('/orderDetail')
      },
      cancelOrder (order) { // 取消订单
        this.currentOperateOrder = order
        this.confirmTitle = '确定取消此订单？'
        this.showConfirm = true
      },
      deleteOrder (order) { // 删除订单
        this.currentOperateOrder = order
        this.confirmTitle = '确定删除此订单？'
        this.showConfirm = true
      },
      contractOrder (order) { // 删除订单  TODO 拨打送气工电话
        this.currentOperateOrder = order
        let phone = order.deliverPhone
        this.callPhone(phone)
      },
      confirmOrder (order) { // 删除订单  TODO 拨打送气工电话
        this.currentOperateOrder = order
        this.confirmTitle = '确认收货吗？'
        this.showConfirm = true
      },
      onConfirmCancel () {
        this.showConfirm = false
        this.confirmTitle = ''
        this.currentOperateOrder = {}
      },
      onConfirmSure () { // 确认删除
        this.showConfirm = false
        if (!this.currentOperateOrder) {
          return
        }
        let order = this.currentOperateOrder
        let data = {
          openId: order.openId,
          id: order.id,
          orderState: order.orderState,
          deliverDepartmentId: order.deliverDepartmentId,
          orderCode: order.orderCode,
          cancelReason: order.receivePerson
        }
        let _this = this
        if (this.confirmTitle === '确定删除此订单？') { // 删除订单
          data.isDel = 2
          this.$http.post(updateGasOrderUrl, JSON.stringify(data)).then((res) => {
            console.log(res.data)
            // 清除操作的订单
            _this.currentOperateOrder = {}
            if (res.data.status === '1') {
              _this.getOrderList()
            }
          })
        } else if (this.confirmTitle === '确定取消此订单？') { // 取消订单
          data.orderState = 6 // 发送要改变的状态
          this.$http.post(updateGasOrderUrl, JSON.stringify(data)).then((res) => {
            console.log(res.data)
            // 清除操作的订单
            _this.currentOperateOrder = {}
            if (res.data.status === '1') {
              _this.getOrderList()
            }
          })
        } else if (this.confirmTitle === '确认收货吗？') { // 确认收货
          data.orderState = 4 // 发送要改变的状态
          this.$http.post(updateGasOrderUrl, JSON.stringify(data)).then((res) => {
            console.log(res.data)
            // 清除操作的订单
            _this.currentOperateOrder = {}
            if (res.data.status === '1') {
              _this.getOrderList()
            }
          })
        }
        // 清除confirmTitle
        this.confirmTitle = ''
      },
      callPhone (phone) {
        // console.log('拨打电话')
        let isAndroid = this.userAgent.indexOf('Android') > -1 || this.userAgent.indexOf('Adr') > -1
        let isIos = !!this.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        // console.log(isAndroid)
        // console.log(isIos)
        if (isAndroid) {
          // console.log(111)
          window.location.href = 'tel:' + phone
        } else if (isIos) {
          // console.log(222)
          window.location.href = 'tel://' + phone
        }
      },
      ...mapMutations({
        orderDetail: 'SET_ORDER_DETAIL'
      })
    },
    components: {
      Tab,
      TabItem,
      Loading,
      Confirm
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
      .good-wrapper
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
          border-radius 5px
          margin-right 2px
          display inline-block 
    .empty
      margin-top 10px
      background-color #ffffff
      text-align center
      img 
        margin-top 200px
      p 
        margin-top 30px
        color #6a6a6a
      

</style>
