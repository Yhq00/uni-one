<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserinfo">一键登录</button>
		<text class="tips-text">登录后尽享更多权益</text>
	</view>
</template>

<script>
	import { mapMutations, mapState } from "vuex"
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('m_user',['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
			//用户授权以后，获取用户的基本信息
			getUserinfo(e){
				if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
				this.updateUserInfo(e.detail.userInfo)
				this.getToken(e.detail)
			},
			async getToken(info) {
				//获取 code 值
				const [err,res] = await uni.login().catch(err => err)

				if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登陆失败!')
				
				const query = {
					encryptedData:info.encryptedData,
					rawData:info.rawData,
					iv:info.iv,
					signature:info.signature,
					code: res.code,					
				}
				const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin',query)
				// if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！') 
				//直接把token保存到 vux 中
				// this.updateToken(loginResult.message.token)
				this.updateToken("token")
				uni.$showMsg('登录成功！')
				this.navigateBack()
			},
			navigateBack() {
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.login-container{
	height: 750rpx;
	background-color: #F8F8F8;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	// overflow: hidden;
	// &::after{
	// 	content: ' ';
	// 	display: block;
	// 	width: 100%;
	// 	height: 40px;
	// 	background-color: white;
	// 	position: absolute;
	// 	bottom: 0;
	// 	left: 0;
	// 	border-radius:100%;
	// 	transform: translateY(50%);
	// }
	.btn-login{
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
	}
	.tips-text{
		font-size: 12px;
		color: gray;
	}
}
</style>