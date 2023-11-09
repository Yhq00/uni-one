<template>
	<view class="cart-container" v-if="cart.length !==0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 商品列表区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧文本区域 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<!-- 循环渲染购物车中的商品信息 -->
		<uni-swipe-action>
			<block v-for="(goods,i) in cart" :key="i">
				<!-- show-radio 与 showRadio驼峰命名相同 -->
				<!-- 在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的goods_id 和 goods_state -->
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>	
			</block>
		</uni-swipe-action>
		<!-- 使用自定义的的结算组件 -->
		<my-settle></my-settle>
	</view>
	<!-- 无商品现实 -->
	<view class="empty-cart" v-else>
		你的购物车里空空如也....
		<b></b>
		快去添加商品吧
	</view>
</template>

<script>
	//按需导入 mapGetters 这个辅助方法
	// import { mapGetters } from 'vuex'

	//导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	//按需导入 mapState 这个辅助函数
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		//将 badgeMix 混入到当前页面中进行使用
		mixins: [badgeMix],
		computed: {
			//将m_cart模块中的 cart 数组映射到当前页面中使用
			...mapState('m_cart', ['cart'])
		},

		data() {
			return {
				options:[{
					text:'删除' ,// 显示的文本内容
					style: {
						backgroundColor: '#C00000' // 按钮的背景颜色
					}
				}]
			};
		},
		// computed: {
		// 	//将 m_cart 模块中的 total 映射为当前页面的计算属性
		// 	...mapGetters('m_cart',['total'])
		// },
		// onShow() {
		// 	//在页面刚显示的时候，设置数字徽标
		// 	this.setBadge()
		// },
		// methods: {
		// 	setBadge(){
		// 		//调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
		// 		uni.setTabBarBadge({
		// 			index: 2, //索引
		// 			text: this.total + '' //注意： text 的值必须是字符串，不能是数字
		// 		})
		// 	}
		// }
		methods: {
			...mapMutations('m_cart', ['updateGoodsState','updateGoodsCount','removeGoodsById']),
			//商品的勾选状态发生了变化
			radioChangeHandler(e) {
				// console.log(e); // 输出得到的数据 -> {goods_id: 395,goods_state:false}
				this.updateGoodsState(e)
			},
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			swipeItemClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
	.cart-container{
		padding-bottom: 50px;
	}
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border: 1px solid #efefef;

		.cart-title-text {
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.empty-cart{
		text-align: center;
		padding-top: 250px;
		color: gray;
	}
</style>