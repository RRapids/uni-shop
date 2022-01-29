<template>
	<view class="scroll_container flex_center">
		<view class="scroll_card">
			<!-- 功能栏 -->
			<view class="top_card">
				<view class="card_1">
					<!-- 添加 -->
					<view @click="add_data" class="manageBtn add_color flex_center">
						<setButton btnType="add"></setButton>
					</view>
					<!-- 删除 -->
					<view @click="delete_all" class="manageBtn back_color flex_center">
						<setButton btnType="delete"></setButton>
					</view>
					<!-- 输入框 -->
					<input v-model="keywords" placeholder="输入店铺名搜索" class="queryInput" />
					<!-- 查询 -->
					<view @click="search" class="queryBtn add_color flex_center">
						<setButton btnType="search"></setButton>
					</view>
				</view>
			</view>

			<!-- uni-table -->
			<uni-table border stripe emptyText="暂无更多数据" type="selection" @selection-change="change">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center">ID</uni-th>
					<uni-th align="center">店铺名</uni-th>
					<uni-th align="left">电话</uni-th>
					<uni-th align="left">城市</uni-th>
					<uni-th align="center">地址</uni-th>
					<uni-th align="center">设置</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<!-- 三元表达式是为了解决props内容不能直接修改问题 -->
				<uni-tr v-for="(item,index) in (StoreListData ? StoreListData : StoreList)" :key='index'>
					<uni-td>{{index+1}}</uni-td>
					<uni-td>{{item.name}}</uni-td>
					<uni-td>{{item.mobile}}</uni-td>
					<uni-td>{{item.city_name}}</uni-td>
					<uni-td>{{item.street}}</uni-td>
					<uni-td style="display: flex;">
						<button type="primary" size="mini" @click="editStore(item)">修改</button>
						<button type="warn" size="mini" @click="deleteStore(item)">删除</button>
					</uni-td>
				</uni-tr>
			</uni-table>
			<!-- 分页 -->
			<view class="fenyeStyle">
				<uni-pagination @change="handlePage" show-icon="true" :total="(sotres_total ? sotres_total : total)"
					:current="page_current" :pageSize="pageSize">
				</uni-pagination>
			</view>
		</view>

		<!-- 增加弹出层 -->
		<uni-popup ref="addPopup" type="center">
			<view class="popupTop">
				<!-- 上 -->
				<view class="popupTitle">
					<view>
						增加
					</view>
				</view>
				<!-- 中 -->
				<view class="popupCenter">
					<view class="center">
						<view style="color: red;">*</view>
						店名
						<input v-model="form.storeName" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						电话
						<input v-model="form.storePhone" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						城市
						<input v-model="form.city" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						地址
						<input v-model="form.address" class="input_account" />
					</view>
				</view>
				<!-- 下 -->
				<view class="popupUnder">
					<view class="underButton">
						<button type="default" size="mini" @click="add_cancel">取 消</button>
						<button type="primary" size="mini" @click="add_sure">确 定</button>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 修改弹出层 -->
		<uni-popup ref="editPopup" type="center">
			<view class="popupTop">
				<!-- 上 -->
				<view class="popupTitle">
					<view>
						修改
					</view>
				</view>
				<!-- 中 -->
				<view class="popupCenter">
					<view class="center">
						<view style="color: red;">*</view>
						店名
						<input v-model="form.storeName" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						电话
						<input v-model="form.storePhone" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						城市
						<input v-model="form.city" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						地址
						<input v-model="form.address" class="input_account" />
					</view>
				</view>
				<!-- 下 -->
				<view class="popupUnder">
					<view class="underButton">
						<button type="default" size="mini" @click="edit_cancel">取 消</button>
						<button type="primary" size="mini" @click="edit_sure">确 定</button>
					</view>
				</view>
			</view>

		</uni-popup>

		<!-- 删除弹出层 -->
		<!-- 		<uni-popup ref="alertPopup" type="dialog">
			<uni-popup-dialog type="info" cancelText="关闭" confirmText="确定" content="确定要删除吗？" @confirm="delete_sure"
				@close="delete_cancel">
			</uni-popup-dialog>
		</uni-popup> -->
	</view>
</template>

<script>
	import setButton from "@/components/admin-components/SetButton/SetButton.vue"

	export default {
		name: 'stores',
		components: {
			setButton
		},
		data() {
			return {
				keywords: '',
				realKeywords: '',
				sotres_total: this.total,
				StoreListData: "",
				selectArr: [],
				current:1,
				pageSize: 5,

				form: {
					id: "",
					storeName: '',
					storePhone: "",
					city: "",
					address: ""
				}
			}
		},
		// 此处定义传入的数据
		props: {
			StoreList: {
				type: Array,
				value: null
			},
			total: {
				type: Number,
				value: null
			},
			page_current: {
				type: Number,
				value: null
			}
		},
		onLoad() {
			this.StoreListData = this.StoreList
		},

		methods: {
			// 获取store列表
			getStoreList() {
				uniCloud
					.callFunction({
						name: 'adminStores',
						data: {
							action: 'getList',
							keywords: this.realKeywords, // 筛选条件,格式{sex:'女'}
							pageIndex: this.current, // 第几页
							pageSize: this.pageSize // 每页条数
						}
					})
					.then(res => {
						uni.hideLoading()
						this.sotres_total = res.result.total
						this.StoreListData = res.result.res.data

					});
			},
			// 点击分页按钮
			handlePage(params) {
				this.current = params.current
				this.getStoreList()
			},
			// 搜索
			search() {
				this.realKeywords = this.keywords
				uni.showLoading({
					title: '数据加载中...'
				});
				this.getStoreList()
			},
			// 打开"添加"弹出层
			add_data() {
				this.form = {
					id: "",
					storeName: '',
					storePhone: "",
					city: "",
					address: ""
				}
				this.$refs.addPopup.open()
			},
			// 打开"修改"弹出层
			editStore(item) {
				this.$refs.editPopup.open()
				this.form.id = item._id,
					this.form.storeName = item.name,
					this.form.storePhone = item.mobile,
					this.form.city = item.city_name,
					this.form.address = item.street
			},
			// 打开"删除"弹出层
			deleteStore(item) {
				uni.showModal({
					title: '提示',
					content: '确定要删除 ' + item.name + " 吗?",
					success: res => {
						if (res.confirm) {
							return uniCloud
								.callFunction({
									name: 'adminStores',
									data: {
										id: item._id,
										action: 'deleteStores'
									}
								})
								.then(res => {
									if (res.result.status === 0) {
										this.getStoreList();


									}
									uni.showToast({
										title: res.result.msg,
										icon: 'success'
									});
								});
						}
					}
				});
			},
			// 增加弹出层退出
			add_cancel() {
				this.$refs.addPopup.close()
			},
			// 修改弹出层退出
			edit_cancel() {
				this.$refs.editPopup.close()
			},

			// 删除弹出层退出
			delete_cancel() {
				this.$refs.alertPopup.close()
			},

			// 确定增加
			add_sure() {

				let data = this.form;
				return uniCloud
					.callFunction({
						name: 'adminStores',
						data: {
							data: data,
							action: 'addStore'
						}
					})
					.then(res => {
						if (res.result.status === 0) {
							uni.showToast({
								title: '添加成功'
							});
							this.$refs.addPopup.close()
							this.getStoreList()
						} else {
							uni.showModal({
								content: res.result.msg,
								showCancel: false
							});
						}
					});
			},

			// 确定修改
			edit_sure() {
				console.log(this.form.id)

				let data = this.form;
				return uniCloud
					.callFunction({
						name: 'adminStores',
						data: {
							data: data,
							action: 'editStore'
						}
					})
					.then(res => {
						if (res.result.status === 0) {
							uni.showToast({
								title: '修改成功'
							});
							this.$refs.editPopup.close()
							this.getStoreList()
						} else {
							uni.showModal({
								content: res.result.msg,
								showCancel: false
							});
						}
					});
			},
			// 点击"批量操作"
			change(e) {
				console.log(e.detail)
				this.selectArr = e.detail.index

			},
			// 确定多选删除
			delete_all() {
				if (this.selectArr.length == 0) {

					uni.showToast({
						title: "还未选择",
						icon: "error"
					})

				} else {
					uni.showModal({
							title: '提示',
							content: '确定要删除吗？',
							success: (res) => {
								if (res.confirm) {
									uni.showLoading({
										title: "删除中..."
									})
									//实现全选删除和多选删除
									let arr = [];
									let len = this.StoreListData.length;

									// 还未执行其余操作，就直接多选，此时StoreListData还未赋值		
									if (len == 0 || len == "") {
										let len_2 = this.StoreList.length;
										for (let i = 0; i < len_2; i++) {
											if (this.selectArr.indexOf(i) >= 0) {
												arr.push({
													id: this.StoreList[i]._id
												})
											}
										}
									} else { // 点击分页后，StoreListData有值
										for (let i = 0; i < len; i++) {
											if (this.selectArr.indexOf(i) >= 0) {
												arr.push({
													id: this.StoreListData[i]._id
												})
											}
										}

									}
									console.log(arr)
									uniCloud.callFunction({
										name: 'adminStores',
										data: {
											data: arr,
											action: 'deleteMoreStores'
										}
									}).then(res => {
										uni.hideLoading()
										if (res.result.status === 0) {
											
											this.getStoreList();
										}
										uni.showToast({
											title: res.result.msg,
											icon: 'success'
										});
									});
								}
				
						
						}
					})

			}
		}
	}
	}
</script>

<style lang="scss" scoped>
</style>
