<template>
	<view>
		<!-- 搜索组件 -->
		<view class="search-box">
			<my-search :bgcolor="'pink'" :radius="3" @myclick="gotoSearch"></my-search>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id" class="swiper-item">
					<img :src="item.image_src">
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<img :src="item.image_src" class="nav-img">
			</view>
			
		</view>
		<!--楼层区域-->
		<view class="floor-list">
			<!--楼层item项-->
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!--楼层标题-->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
						<!-- 左侧大图片盒子 -->
						<navigator class="left-img-box" :url="item.product_list[0].url">
							<image :src="item.product_list[0].image_src" 
							:style="{width:item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
						<!-- 右侧 -->
						<view class="right-img-box">
							<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
								<img :src="item2.image_src" mode= "widthFix" :style="{width:item2.image_width +'rpx'}">
							</navigator>
						</view>
				</view>
			</view>
		</view>
		<!-- 楼层图片区域 -->
		
	</view>
</template>

<script>
	//导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	
	export default {
		//将 badgeMix 混入到当前页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				//这是轮播图的数据列表
				swiperList: [],
				//分类导航的数据列表
				navList:[],
				//楼层数据列表
				floorList:[]
			};
			
		},
		onLoad() {
			//调用方法获取轮播图的数据
			this.getSwiperList();
			this.getNavList();
			this.getFloorLsit();
		},
		methods:{ 
			 async getSwiperList(){
			  const {data:res} = await	uni.$http.get('/api/public/v1/home/swiperdata')
			  //请求失败
			  if(res.meta.status !== 200) return uni.$showMsg()
			  this.swiperList = res.message
			  // console.log(res);	
			 },
			 async getNavList(){
				 const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
				 if(res.meta.status !== 200) return uni.$showMsg()
				 this.navList = res.message
				 // console.log(res);
			 },
			 async getFloorLsit(){
				 const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
				 if(res.meta.status !== 200) return uni.$showMsg()
				 //对数据进行处理
				 res.message.forEach(floor=>{
					 floor.product_list.forEach(prod=>{
						 prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1] 
					 })
				 })
				 this.floorList = res.message
				 // console.log(res);
			 },
			 navClickHandler(item){
				if(item.name === "分类"){
					uni.switchTab({
						url:"/pages/cate/cate"
					})
				}
			 },
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
		
	}
</script>

<style lang="scss">
swiper{
	height: 330rpx;
	.swiper-item,
	image {
		 width: 100%;
		 height: 100%;
		  }
	  }
		 
  .nav-list{
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
	.nav-img{
		width: 128rpx;
		height: 140rpx;
	}
}

.floor-title{
	height:60rpx;
	width:100%;
	// display:flex;
}
.right-img-box{
	display: flex;
	flex-wrap: wrap; 
	justify-content: space-around;
}
.floor-img-box{
	display: flex;
	padding-left: 10rpx;
}
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
}
</style>
