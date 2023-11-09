export default{
	//为当前模块开启命名空间
	namespaced:true,
	
	//模块的state数据
	state:()=>({
		//购物车的数组，用来存储购物车中每个商品的信息对象
		//每个商品的信息对象，都包含如下6个属性
		//{goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
		cart:JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	
	mutations:{
		addToCart(state, goods){
			//根据提交的商品的Id,查询购物车中是否存在这件商品
			//如果不存在，则findResult为undefined;否则，为查找到的商品信息对象
			const findResult = state.cart.find(x=>x.goods_id === goods.goods_id)
			//如果购物车中没有这件商品，则直接push
			if(!findResult){
				state.cart.push(goods)
			}else{
			//如果购物车中有这件商品，则只更新数量即可
			findResult.goods_count++
			}
			
			//通过调用 commit 方法，调用 m_cart 命名空间下的 savaToStorage 方法
			this.commit('m_cart/saveToStorage')
		},
		//将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		//更新购物车中商品的勾选状态
		updateGoodsState(state, goods){
			//根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			//有对应的商品信息对象
			if(findResult) {
				//更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				//持久化存储到本地
				this.commit('m_cart/saveToStorage')
				}
			},
			//更新购物车中商品的勾选状态
			updateGoodsCount(state, goods){
				//根据 goods_id 查询购物车中对应商品的信息对象
				const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
				
				//有对应的商品信息对象
				if(findResult) {
					//更新对应商品的勾选状态
					findResult.goods_count = goods.goods_count
					//持久化存储到本地
					this.commit('m_cart/saveToStorage')
				}
			
		},
		// 根据 Id 删除购物车中对应的商品信息
		removeGoodsById(state,goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		//更新购物车中所有商品的勾选状态
		updateAllGoodsState(state,newState) {
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},
	//模块的getters属性
	getters:{
		//统计购物车中商品的总数量
		total(state) {
			// let c = 0
			// //循环统计商品的数量，累加到变量c中
			// state.cart.forEach(goods => c += goods.goods_count)
			// return c
			return state.cart.reduce((total,item)=>total += item.goods_count,0)
		},
		// 勾选的商品总数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item)=> total+= item.goods_count,0)
		},
		//统计总价
		checkedGoodsAmount(state) {
			return	state.cart.filter(x => x.goods_state)
			.reduce((total, item) => total += item.goods_count * item.goods_price,0)
			.toFixed(2)
		}
	}
}