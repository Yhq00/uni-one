<template>
	<view>
		<view class="search-box">
			<uni-search-bar placeholder="请输入搜索内容" bgColor="#EEEEEE"
			 :radius="100" @input="input" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsLst(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//延时器的timerId
				timer:null,
				//搜索关键词
				kw:'',
				//搜索的结果列表
				searchResults:[],
				//搜索历史的数组 
				historyList:[]
			};
		},
		methods:{
			// input输入事件
			input(e){
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.kw = e
					this.getSearchList()
				},500) 
			},
			async getSearchList(){
				//判空
				if(this.kw.length === 0){
					this.searchResults = []
					return
				}
				const {data:res} = await uni.$http.get('/api/public/v1/goods/search',{query: this.kw})
				if(res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message.goods
				 this.saveSearchHistory()
			},
			gotoDetail(item){
				console.log(item.goods_id);
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			saveSearchHistory(){
				// this.historyList.push(this.kw)
				//1.将Array数组转化成 Set对象
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				//调用uni.setStorageSync(key,value)将搜索历史持久化储存到本地
				uni.setStorageSync('kw',JSON.stringify(this.historyList)) 
			},
			clean(){
				this.historyList = []
				uni.setStorageSync('kw',[])
			},
			gotoGoodsLst(item){
				uni.navigateTo({
						url:'/subpkg/goods_list/goods_list?quety=' + item
				})
			}
		},
		computed:{
			histories(){
				return [...this.historyList].reverse()
			}
		},
		onLoad(){
			this.historyList = JSON.parse(uni.getStorageSync('kw'||'[]'))
		}
	}
</script>

<style lang="scss">
.search-box{
	position: sticky;
	top: 0;
	z-index: 999;
}
.sugg-list{
	padding: 0 5px;
	.sugg-item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		.goods-name{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
.history-box{
	padding: 0 5px;
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border: 1px solid #efefef;
	}
	.history-list{
		 display: flex;
		 flex-wrap: wrap;
		 .uni-tag{
			 margin: 5px 5px 0px;
		 }
	}
}
</style>
