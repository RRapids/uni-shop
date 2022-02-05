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
					<uni-th align="left">账号</uni-th>
					<uni-th align="left">手机</uni-th>
					<uni-th align="center">角色</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<!-- 三元表达式是为了解决props内容不能直接修改问题 -->
				<uni-tr v-for="(item,index) in (AdminListData ? AdminListData : PersonList)" :key='index'>
					<uni-td>{{index+1}}</uni-td>
					<uni-td>{{item.name}}</uni-td>
					<uni-td>{{item.account}}</uni-td>
					<uni-td>{{item.phone}}</uni-td>
					<uni-td>{{item.role==1 ?'超级管理员':'管理员'}}</uni-td>
					<uni-td style="display: flex;">
						<button type="primary" size="mini" @click="editStore(item)">修改</button>
						<button type="warn" size="mini" @click="deleteStore(item)">删除</button>
					</uni-td>
				</uni-tr>
			</uni-table>
			<!-- 分页 -->
			<view class="fenyeStyle">
				<uni-pagination @change="handlePage" show-icon="true" :total="(admin_total ? admin_total : total)"
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
						账号
						<input v-model="form.account" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						密码
						<input v-model="form.password" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						手机
						<input v-model="form.phone" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						角色
						<input v-model="form.role" class="input_account" />
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
						账号
						<input v-model="form.account" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						密码
						<input v-model="form.password" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						手机
						<input v-model="form.phone" class="input_account" />
					</view>
					<view class="center">
						<view style="color: red;">*</view>
						角色
						<input v-model="form.role" class="input_account" />
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
	</view>
</template>

<script>
	import setButton from "@/components/admin-components/SetButton/SetButton.vue"

	export default {
		name: 'admin',
		components: {
			setButton
		},
		data() {
			return {
				keywords: '',
				realKeywords: '',
				admin_total: 0,
				AdminListData: "",
				selectArr: [],
				current: 1,
				pageSize: 5,

				form: {
					id: "",
					name: '',
					account: "",
					password: '',
					avatar: '',
					phone: "",
					role: "",
					createrTime: ''
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
			this.AdminListData = this.PersonList
		},

		methods: {
			// 获取store列表
			getAdminList() {
				uniCloud
					.callFunction({
						name: 'admin',
						data: {
							action: 'getList',
							keywords: this.realKeywords, // 筛选条件,格式{sex:'女'}
							pageIndex: this.current, // 第几页
							pageSize: this.pageSize // 每页条数
						}
					})
					.then(res => {
						uni.hideLoading()
						this.admin_total = res.result.total
						this.AdminListData = res.result.res.data


					});
			},
			// 点击分页按钮
			handlePage(params) {
				this.current = params.current
				this.getAdminList()
			},
			// 搜索
			search() {
				this.realKeywords = this.keywords
				uni.showLoading({
					title: '数据加载中...'
				});
				this.getAdminList()
			},
			// 打开"添加"弹出层
			add_data() {
				this.form = {
					id: "",
					name: '',
					account: "",
					password: '',
					avatar: '',
					phone: "",
					role: "",
				}
				this.$refs.addPopup.open()
			},
			// 打开"修改"弹出层
			editStore(item) {
				this.$refs.editPopup.open()
				this.form.id = item._id,
					this.form.name = item.name,
					this.form.account = item.account,
					this.form.password = item.password,
					this.form.phone = item.phone,
					this.form.role = item.role
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
									name: 'admin',
									data: {
										id: item._id,
										action: 'deleteUsers'
									}
								})
								.then(res => {
									if (res.result.status === 0) {
										this.getAdminList();
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
						name: 'admin',
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
							this.getAdminList()
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
						name: 'admin',
						data: {
							data: data,
							action: 'edit'
						}
					})
					.then(res => {
						if (res.result.status === 0) {
							uni.showToast({
								title: '修改成功'
							});
							this.$refs.editPopup.close()
							this.getAdminList()
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
								let len = this.AdminListData.length;

								// 还未执行其余操作，就直接多选，此时AdminListData还未赋值		
								if (len == 0 || len == "") {
									let len_2 = this.PersonList.length;
									for (let i = 0; i < len_2; i++) {
										if (this.selectArr.indexOf(i) >= 0) {
											arr.push({
												id: this.PersonList[i]._id
											})
										}
									}
								} else { // 点击分页后，AdminListData有值
									for (let i = 0; i < len; i++) {
										if (this.selectArr.indexOf(i) >= 0) {
											arr.push({
												id: this.AdminListData[i]._id
											})
										}
									}

								}
								console.log(arr)
								uniCloud.callFunction({
									name: 'admin',
									data: {
										data: arr,
										action: 'deleteMoreUsers'
									}
								}).then(res => {
									uni.hideLoading()
									if (res.result.status === 0) {
										this.getAdminList();
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
					})

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
