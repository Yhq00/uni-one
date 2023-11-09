export default{
	//为当前模块开启命名空间
	namespaced:true,
	
	//模块的state数据
	state:()=>({
		//数据节点
		address:JSON.parse(uni.getStorageSync('address') || '{}'),
		token:uni.getStorageSync('token') || '',
		//用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		//重定向的对现象	
		redirectInfo: null
		
	}),
	//方法
	mutations:{
		updateAddress(state,address){
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		saveAddressToStorage(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		},
		//更新用户的基本信息
		updateUserInfo(state,userinfo) {
			state.userinfo = userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		//用户信息持久化
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
		},
		updateToken(state,token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		saveTokenToStorage(state) {
			uni.setStorageSync('token',state.token)
		},
		updateRedirectInfo(state,info) {
			state.redirectInfo = info
		}
	},
	//模块的getters属性
	getters:{
		  addstr(state){
			  if(!state.address.provinceName) return ''
			  return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		  }
	}
}