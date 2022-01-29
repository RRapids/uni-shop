<template>
	<view class="content_all">
		<view class="content_1 content">
			<view class="header">
				hello !
			</view>
			<view style="margin-top: 20upx;font-size: 25px;">欢迎来到后台管理 ！</view>
			<view class="list">
				<view class="list-call">
					<image class="img" src="/static/shilu-login/phone.png"></image>
					<input class="biaoti" v-model="phoneno" type="number" maxlength="11" placeholder="输入手机号" />
				</view>
				<view class="list-call" style="margin-top: 20upx;">
					<image class="img" src="/static/shilu-login/block.png"></image>
					<input class="biaoti" v-model="password" type="text" maxlength="32" placeholder="六位数密码"
						password="true" />
				</view>
			</view>

			<view class="dlbutton" hover-class="dlbutton-hover" @tap="bindLogin()">
				<text>登录</text>
			</view>

		</view>
		<image
			src="http://cd7.yesapi.net/0B4163C86181759DD5DE6C761AF719A5_20200629155530_4fdd81610bea6fdaabbe27637f116be6.png"
			mode="aspectFill" style="width: 100%;height: 100%;"></image>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				phoneno: '',
				password: '',
				people: []
			};
		},
		computed: {
			...mapState(['userInfo', 'isLogin'])
		},
		methods: {
			...mapMutations(['Login']),
			bindLogin() {
				uniCloud.callFunction({
					name: "admin",
					data: {
						action:'login',
						account: this.phoneno,
						password: this.password
					}
				}).then(res => {
					console.log(res)
					uni.showToast({
						title: res.result.msg,
						icon: 'none'
					})
					if (res.result.status == 0) {
						this.Login(res.result.data)
						uni.redirectTo({
							url: '../admin/admin'
						})
					}
				})

				// // 手机号正则
				// if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneno))) {
				//      uni.showToast({
				//         icon: 'none',
				//         title: '手机号不正确'
				//     });
				//     return;
				// }
				// // 密码正则
				//       if (!(/^\d{6}$/.test(this.password))) {
				//           uni.showToast({
				//               icon: 'none',
				//               title: '密码不是六位数字！'
				//           });
				//           return;
				//       } 

			}
		}
	}
</script>

<style>
	.content_all {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		height: 100vh;
		width: 100%;

	}

	.content_1 {
		width: 50%;
		height: 50%;
		margin-left: 100upx;

	}

	.content {
		display: flex;
		flex-direction: column;
		/* justify-content:center; */
		/* align-items: center; */


	}

	.header {
		font-size: 50px;
	}


	.list {
		display: flex;
		flex-direction: column;
		padding-top: 40upx;
		/* padding-left: 70upx;
		padding-right: 70upx; */
	}

	.list-call {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 20upx;
		color: #333333;
		width: 500upx;
		margin-bottom: 3upx;

		padding: 20upx;
		background-color: #F6F4FC;

	}

	.list-call .img {
		width: 20upx;
		height: 20upx;
	}

	.list-call .biaoti {
		flex: 1;
		text-align: left;
		font-size: 12upx;
		line-height: 100upx;
		margin-left: 16upx;
	}

	.dlbutton {
		color: #FFFFFF;
		font-size: 12upx;
		width: 200upx;
		height: 55upx;
		background-color: #1890FF;

		align-items: center;
		display: flex;
		justify-content: center;

		line-height: 100upx;
		text-align: center;
		/* margin-left: auto;
		margin-right: auto; */
		margin-top: 30upx;
	}

	.dlbutton hover {
		background-color: #1890cc;
	}

	.xieyi {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 22upx;
		margin-top: 80upx;
		color: #FFA800;
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}

	.xieyi text {
		font-size: 22upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
</style>
