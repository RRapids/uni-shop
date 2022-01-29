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
					<input v-model="keywords" placeholder="输入搜索" class="queryInput" />
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
					<uni-th align="center">姓名</uni-th>
					<uni-th align="left">性别</uni-th>
					<uni-th align="left">城市</uni-th>
					<uni-th align="center">注册时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<!-- 三元表达式是为了解决props内容不能直接修改问题 -->
				<uni-tr v-for="(item,index) in (UserListData ? UserListData : PersonList)" :key='index'>
					<uni-td>{{index+1}}</uni-td>
					<uni-td>{{item.nickName}}</uni-td>
					<uni-td>{{item.gender == 1?'男':'女'}}</uni-td>
					<uni-td>{{item.city}}</uni-td>
					<uni-td>{{item.createTime}}</uni-td>
					<uni-td style="display: flex;">
						<button type="primary" size="mini" @click="editStore(item)">修改</button>
						<button type="warn" size="mini" @click="deleteStore(item)">删除</button>
					</uni-td>
				</uni-tr>
			</uni-table>
			<!-- 分页 -->
			<view class="fenyeStyle">
				<uni-pagination @change="handlePage" show-icon="true" :total="(users_total ? users_total : total)"
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
						姓名
						<input v-model="form.name" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						性别
						<input v-model="form.gender" class="input_account" placeholder="男1女0" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						城市
						<input v-model="form.city" class="input_account" />
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
						姓名
						<input v-model="form.name" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						性别
						<input v-model="form.gender" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						城市
						<input v-model="form.city" class="input_account" />
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
		name: 'users',
		components: {
			setButton
		},
		data() {
			return {
				keywords: '',
				realKeywords: '',
				users_total: this.total,
				UserListData: "",
				selectArr: [],
				current: 1,
				pageSize: 5,

				form: {
					id: "",
					name: '',
					gender: "",
					city: "",
					createTime: ""
				}
			}
		},
		// 此处定义传入的数据
		props: {
			PersonList: {
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
			this.UserListData = this.PersonList
			
		},

		methods: {
			// 获取store列表
			getUserList() {
				uniCloud
					.callFunction({
						name: 'users',
						data: {
							action: 'getList',
							keywords: this.realKeywords, // 筛选条件,格式{sex:'女'}
							pageIndex: this.current, // 第几页
							pageSize: this.pageSize // 每页条数
						}
					})
					.then(res => {
						uni.hideLoading()
						this.users_total = res.result.total
						this.UserListData = res.result.res.data


					});
			},
			// 点击分页按钮
			handlePage(params) {
				this.current = params.current
				this.getUserList()
			},
			// 搜索
			search() {
				this.realKeywords = this.keywords
				uni.showLoading({
					title: '数据加载中...'
				});
				this.getUserList()
			},
			// 打开"添加"弹出层
			add_data() {
				this.form = {
					id: "",
					name: '',
					gender: "",
					city: "",
					createTime: ""
				}
				this.$refs.addPopup.open()
			},
			// 打开"修改"弹出层
			editStore(item) {
				this.$refs.editPopup.open()
				this.form.id = item._id,
					this.form.name = item.name,
					this.form.gender = item.gender,
					this.form.city = item.city,
					this.form.createTime = item.createTime
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
									name: 'users',
									data: {
										id: item._id,
										action: 'deleteUsers'
									}
								})
								.then(res => {
									if (res.result.status === 0) {
										this.getUserList();
										uni.showToast({
											title: res.result.msg,
											icon: 'success'
										});
									} else {
										uni.showToast({
											title: res.result.msg,
											icon: 'error'
										});
									}

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
						name: 'users',
						data: {
							data: data,
							action: 'addUsers'
						}
					})
					.then(res => {
						if (res.result.status === 0) {
							uni.showToast({
								title: '添加成功'
							});
							this.$refs.addPopup.close()
							this.getUserList()
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
						name: 'users',
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
							this.getUserList()
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
								let len = this.UserListData.length;

								// 还未执行其余操作，就直接多选，此时UserListData还未赋值		
								if (len == 0 || len == "") {
									let len_2 = this.PersonList.length;
									for (let i = 0; i < len_2; i++) {
										if (this.selectArr.indexOf(i) >= 0) {
											arr.push({
												id: this.PersonList[i]._id
											})
										}
									}
								} else { // 点击分页后，UserListData有值
									for (let i = 0; i < len; i++) {
										if (this.selectArr.indexOf(i) >= 0) {
											arr.push({
												id: this.UserListData[i]._id
											})
										}
									}

								}
								console.log(arr)
								uniCloud.callFunction({
									name: 'users',
									data: {
										data: arr,
										action: 'deleteMoreUsers'
									}
								}).then(res => {
									uni.hideLoading()
									if (res.result.status === 0) {
										this.getUserList();
										uni.showToast({
											title: res.result.msg,
											icon: 'success'
										});
									}else{
										uni.showToast({
											title: res.result.msg,
											icon: 'error'
										});
									}

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
