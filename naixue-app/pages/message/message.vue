<template>
	<view class="content">
		<view class="input_box">
			<textarea placeholder="请输入你要留言的内容" class="textarea border" v-model="message.content"></textarea>
			<input type="text" class="input_box border" v-model="message.name" placeholder="请输入用户名:" />
			<button @click="addMsg" class="submit">提交</button>
		</view>
		<view class="list">
			<view class="item" v-for="(item, index) in listData" :key="index">
				<view class="word">
					<text class="user_name">{{ item.name }}</text>
					<text class="content">{{ item.content }}</text>
				</view>
				<text class="delete" @click="removeMsg(item._id)">删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message: {
					name: '',
					content: ''
				},
				listData: [{
					_id: '',
					name: '',
					content: ''
				}]
			};
		},
		methods: {
			addMsg() {
				let data = this.message;
				uniCloud
					.callFunction({
						name: 'add',
						data: data
					})
					.then(res => {
						
						this.getData();
						this.message.name = '';
						this.message.content = '';
					});
			},
			getData() {
				uniCloud
					.callFunction({
						name: 'get'
					})
					.then(res => {
						this.listData = res.result.data;
					});
			},
			removeMsg(id) {
				console.log(id);
				let _id = id;
				uniCloud
					.callFunction({
						name: 'remove',
						data: {
							_id
						}
					})
					.then(res => {
						this.getData();
					});
			}
		},
		onLoad() {
			this.getData();
		}
	};
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		padding: 10rpx;
		width: 96%;
	}

	.input_box {
		margin-top: 10rpx;
		padding: 5rpx;
		margin-bottom: 20rpx;
	}

	.textarea {
		font-size: 30rpx;
		width: 100%;
		color: #474747;
	}

	.border {
		border: 1rpx solid rgba(170, 170, 127, 0.3);
	}

	.submit {
		margin-top: 20rpx;
		background-color: rgb(100, 167, 225);
		color: #ffffff;
		width: 80%;
	}

	.list {
		display: flex;
		flex-direction: column;
	}

	.item {
		width: 94%;
		padding: 20rpx;
		margin: 5rpx;
		display: flex;
		flex-direction: column;
		margin-bottom: 10rpx;
		border: 1rpx solid #ffe5de;
		border-radius: 10rpx;
	}

	.word {
		display: flex;
		height: 50rpx;
		line-height: 50rpx;
		align-items: center;
		align-content: center;
	}

	.avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin: 10rpx;
	}

	.user_name {
		color: rgb(100, 167, 225);
		font-size: 30rpx;
		display: flex;
		flex: auto;
		margin-right: 40rpx;
	}

	.content {
		/* color: #d8d8d8; */
		font-size: 30rpx;
	}

	.delete {
		width: 60rpx;
		height: 40rpx;
		background-color: rgb(100, 167, 225);
		color: #ffffff;
		border-radius: 10rpx;
		text-align: center;
		font-size: 30rpx;
		padding: 10rpx;
		margin-top: 10rpx;
		margin-top: 20rpx;
	}
</style>
