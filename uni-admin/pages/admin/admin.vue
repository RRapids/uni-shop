<template>
	<view style="display: flex;flex-direction: row;">
		<!-- <router-view /> -->
		<!-- 管理功能选项栏 -->
		<view class="left_container">
			<image src="../../static/admin.png" mode="aspectFill" class="admin_pic"></image>
			<scroll-view scroll-y="true">
				<view v-for="(item,index) in functionList" :key=index>
					<view>
						<uni-collapse>
							<uni-collapse-item :title="item.name" :open="true" :thumb="item.icon">
								<view v-for="(items,indexs) in item.page" @click="menu_change(items)" :key=indexs
									:class="menu_id==items.id?'choose_detail':'detail'">
									{{items.name}}
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 管理功能选项栏end -->
		<!-- 管理具体界面 -->
		<scroll-view scroll-y='true' style="background-color: #F6F8F9;width: 100%;height: 100vh;">
			<!-- 顶部栏 -->
			<view
				style="box-shadow: -1px -1px 5px #888888;width: 100%;background-color: #FFFFFF;height: 50upx;display: flex;flex-direction: row;align-items: center;font-size: 17px;">
				<image src="../../static/admin1.png" style="width: 20upx;height: 20upx;margin-left: 25upx;"></image>
				<view style="margin-left: 5upx;">
					后台管理
				</view>
				<view style="margin-left: 5upx;" class="sorw">
					<image src="../../static/arrow1.png" class="arrow1"></image>
				</view>
				<view style="margin-left: 5upx;">
					{{name}}
				</view>

				<image :src="isLogin ? userInfo.avatar:'/static/images/mine/default.png'"
					style="width: 40upx;height: 40upx;border-radius: 50%;margin-left: auto;"></image>
				<view v-if="isLogin">
					<view style="color: #6C6E72;font-weight: bold;padding: 0 10upx 0 10upx;">
						{{userInfo.name}}
					</view>
				</view>
				<view v-else>
					<view style="color: #6C6E72;font-weight: bold;padding: 0 10upx 0 10upx;" @click="goLogin">
						登录
					</view>
				</view>
			</view>

			<!-- 滑块 -->
			<swiper :current='menu_id' disable-touch=true style="width: 100%;height: 100%;" class="sorw">
				<swiper-item class="sorw">
					<scroll-view scroll-y="true" style="height: 98vh;">
						<!-- 人员管理id=0 -->
						<!-- 用户管理 -->
						<personAdmin :PersonList='PersonList' :total="user_total" :page_current="page_current">
						</personAdmin>
						<!-- 人员管理end-->
					</scroll-view>

				</swiper-item>

				<swiper-item class="sorw">
					<scroll-view scroll-y="true" style="height: 98vh;">
						<personAdmin :PersonList='PersonList' :total="total" :page_current="page_current">

						</personAdmin>
					</scroll-view>

				</swiper-item>

				<swiper-item class="sorw">
					<scroll-view scroll-y="true" style="height: 98vh;">
					</scroll-view>
				</swiper-item>

				<swiper-item class="sorw">
					<scroll-view scroll-y="true" style="height: 98vh;">
					</scroll-view>
				</swiper-item>


				<swiper-item class="sorw">
					<scroll-view scroll-y="true" style="height: 98vh;">
					</scroll-view>
				</swiper-item>


				<!-- 店铺管理 -->
				<swiper-item class="sorw">
					<scroll-view scroll-y="true" style="height: 98vh;">
						<stores :StoreList="storeList" :total="store_total" :page_current="page_current">
						</stores>
					</scroll-view>
				</swiper-item>
			</swiper>

		</scroll-view>
		<!-- 管理具体界面end -->
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import personAdmin from "@/components/admin-components/personAdmin.vue"
	import shopping_admin from "@/components/admin-components/shopping_admin"
	import RecomAdmin from "@/components/admin-components/RecomAdmin"
	import stores from "@/components/admin-components/stores.vue"
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			uniPopup,
			personAdmin,
			shopping_admin,
			RecomAdmin,
			stores
		},
		computed: {
			...mapState({
				userInfo: state => state.userInfo,
				isLogin: state => state.isLogin
			})
		},
		data() {
			return {
				current: 1,
				menu_id: 0,
				name: '人员管理',
				loginFlag: false,

				functionList: [{
						name: '系统管理',
						icon: '/static/personAdmin.png',
						open: false,
						page: [{
								name: '用户管理',
								id: 0
							},
							{
								name: '角色管理',
								id: 1
							}, {
								name: '权限管理',
								id: 2
							},
						]
					},
					{
						name: '商城管理',
						icon: '/static/shopAdmin.png',
						open: false,
						page: [
							{
								name: '类别管理',
								id: 3
							},
							{
								name: '菜品管理',
								id: 4
							},{
								name: '订单管理',
								id: 5
							}
						]
					},
					{
						name: '店铺管理',
						icon: '/static/shopAdmin.png',
						open: false,
						page: [{
							name: '店铺列表',
							id: 6,
							path: '@/components/admin-components/stores.vue'
						}]
					}
				],
				// 人员管理数据
				PersonList: [],
				user_total: 0,

				// 人员管理数据end

				// 商品管理数据
				ShopList: [],
				Num_shop: 1,
				PageNum_shop: 1,
				// 商品管理数据end
				pageList: [],
				AdminList: [],
				RecomList: [],

				// 店铺管理数据
				storeList: [],
				store_total: 0,
				page_current: 1,

			}
		},
		onLoad() {
			this.getData()

			// if (this.isLogin) {
			// 	uni.showToast({
			// 		title: "登录成功"
			// 	})
			// }
			// 获取本地缓存
			const value = uni.getStorageSync('userinfo');
			if (value) {
				// this.$store.commit('SET_LOGINSTATUS','true')
				// this.isLogin = true
				// this.loginSet
			} else {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		},
		methods: {
			getData() {
				// 获取店铺列表
				uniCloud
					.callFunction({
						name: 'adminStores',
						data: {
							action: 'getList',
							filter: {}, // 筛选条件,格式{sex:'女'}
							pageIndex: this.page_current, // 第几页
							pageSize: 5 // 每页条数
						}
					})
					.then(res => {
						this.store_total = res.result.total
						this.storeList = res.result.res.data
					});

				// 获取用户列表
				uniCloud
					.callFunction({
						name: 'users',
						data: {
							action: 'getList',
							filter: {}, // 筛选条件,格式{sex:'女'}
							pageIndex: this.page_current, // 第几页
							pageSize: 5 // 每页条数
						}
					})
					.then(res => {
						this.user_total = res.result.total
						this.PersonList = res.result.res.data
					});
			},
			goLogin() {
				// this.$router.push({
				// 	path:'/login'
				// })
				uni.navigateTo({
					url: '../login/login'
				})
			},

			menu_change: function(e) {
				console.log(e)
				var that = this
				that.menu_id = e.id
				that.name = e.name
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sorw {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.sorw_view {
			// margin-top: -30upx;
			width: 100%;
			height: 90%;
		}
	}

	.left_container {
		display: flex;
		flex-direction: column;
		width: 220upx;
		background-color: #001529;
	}

	.collpase {
		margin-top: 20upx;
		padding: 20upx;
		width: 180upx;
		display: flex;
		flex-direction: row;
		color: #FFFFFF;
		font-size: 15px;
		align-items: center;
	}

	.add_color {
		background-color: #1890FF;

	}

	.add_color:hover {
		background-color: #46A6FF;
	}

	.admin_pic {
		width: 180upx;
		height: 50upx;
		padding: 20upx;
	}

	.admin_pic:hover {
		background-color: #2C405A;
	}

	.arrow {
		height: 20upx;
		width: 20upx;

		margin-left: auto;
	}

	.arrow1 {
		height: 18upx;
		width: 18upx;

	}

	.choose_detail {
		padding: 20upx 20upx 20upx 40upx;
		width: 160upx;
		display: flex;
		flex-direction: row;
		color: #FFFFFF;
		font-size: 15px;
		align-items: center;
		background-color: #1890FF;
	}

	.detail {
		padding: 20upx 20upx 20upx 40upx;
		width: 160upx;
		display: flex;
		flex-direction: row;
		color: #FFFFFF;
		font-size: 15px;
		align-items: center;
	}

	.detail:hover {
		background-color: #1890FF;
	}

	.list_detail {
		border-bottom: 1px solid #EBEEF5;
		display: flex;
		flex-direction: row;
		width: 100%;
		padding: 10upx;
	}

	.list_detail:hover {
		background-color: #F5F7FA;
	}

	.alter {
		color: #1890FF;
	}

	.alter:hover {
		text-decoration: underline;
		color: #DD524D;
	}

	.delete {
		color: #1890FF;
		margin-left: 10upx;
	}

	.delete:hover {
		text-decoration: underline;
		color: #DD524D;
	}

	.left {
		background-color: #F4F4F5;
		width: 15upx;
		height: 15upx;
		padding: 10upx;
	}

	.page {
		color: #FFFFFF;
		background-color: #1890FF;
		width: 32upx;
		height: 32upx;
		font-size: 15px;
		border-radius: 3upx;
		text-align: center;
		justify-content: center;
		display: flex;
		align-items: center;
		margin-left: 10upx;
	}

	.nopage {
		color: #FFFFFF;
		background-color: #F4F4F5;
		width: 32upx;
		height: 32upx;
		font-size: 15px;
		border-radius: 3upx;
		text-align: center;
		justify-content: center;
		display: flex;
		align-items: center;
		margin-left: 10upx;
		color: #606270;
	}

	.right {
		margin-left: 10upx;
		background-color: #F4F4F5;
		width: 15upx;
		height: 15upx;
		padding: 10upx;
	}

	.input_account {
		padding: 5upx 15upx 5upx 15upx;
		border: 1px solid #DCDFE6;
		width: 250upx;
		font-size: 13px;
		margin-left: 20upx;
	}

	.input_account:hover {
		border: 1px solid #C8C7CC;
	}

	.input_account1 {
		padding: 5upx 15upx 5upx 15upx;
		border: 1px solid #DCDFE6;
		width: 227upx;
		font-size: 13px;
		margin-left: 20upx;
	}

	.input_confirm {
		border: 1px solid #1890FF;
		padding: 5upx 15upx 5upx 15upx;
		width: 250upx;
		font-size: 13px;
		margin-left: 20upx;
	}

	.back_color {
		background-color: #FF4D4F;
	}

	.back_color:hover {
		background-color: #FF7172;
	}
</style>
