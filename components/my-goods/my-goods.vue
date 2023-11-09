<template>
	<view class="goods-item">
		<!-- 左侧 -->
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioChangeHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 右侧 -->
		<view class="goods-item-right">
			<!-- 商品名 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<view class="goods-price">
					￥{{goods.goods_price | tofixed}}
				</view>
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showNum"  @change="numberChangeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		name:"my-goods",
		props:{
			goods: {
				type:Object,
				default:{}
			},
			showRadio: {
				type: Boolean,
				//默认情况下不会展示 Radio 组件
				default: false
			},
			showNum: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				//默认图片地址
				defaultPic:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters:{
			tofixed(num){
				return Number(num).toFixed(2)
			}
		},
		methods: {
			//radio 组件的点击事件处理函数
			radioChangeHandler(){
				//通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
				//同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
				this.$emit('radio-change',{
					//商品的 Id
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			// NumberBox 组件的 change 事件处理函数
			numberChangeHandler(val) {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
				this.$emit('num-change',{
					// 商品的 Id
					goods_id: this.goods.goods_id,
					// 商品的最新数量  + 加号转成数字（隐式转换）
					goods_count: +val
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item{
	width: 750rpx;
	box-sizing: border-box;
	display: flex;
	padding: 10px 5px;
	border-bottom: 1px solid #f0f0f0;
	.goods-item-left{
		margin-right: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.goods-pic{
			width: 100px;
			height: 100px;
			display: block;
		}
	}
	.goods-item-right{
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		.goods-name{
			font-size: 13px;
		}
		.goods-info-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-price{
				color: #C00000;
				font-size: 16px;
			}
		}
	}
}
</style>