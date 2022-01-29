<template>
	<view>
		<uni-popup ref="popupType" type="center">
			<view
				style="width: 500upx;display: flex;background-color: #FFFFFF;flex-direction: column;box-shadow: 1px 1px 1px #808080;border-radius: 2upx;">
				<view
					style="border-bottom: 1px solid #DCDFE6;font-size: 18px;display: flex;flex-direction: row;padding: 20upx;width: 460upx;align-items: center;">
					<view>
						增加
					</view>
					<image class="alter_sure" @tap="add_cancel" src="@/static/close.png"
						style="margin-left: auto;height: 15upx;width: 15upx;"></image>
				</view>
				<view
					style="border-bottom: 1px solid #DCDFE6;color: #606266;font-size: 15px;width: 440upx;padding: 30upx;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 5upx;">

					<view style="width: 360upx;padding: 15upx;display: flex;flex-direction: row;align-items: center;">
						<view style="color: red;">
							*
						</view>
						店铺名
						<input v-model="form.storeName" @click=''
							:class="input_confirm==2?'input_confirm':'input_account'" class="" style="" />
					</view>
					<view style="width: 360upx;padding: 15upx;display: flex;flex-direction: row;align-items: center;">
						<view style="color: red;">
							*
						</view>
						电话
						<input v-model="form.storePhone" @click='' class=""
							:class="input_confirm==3?'input_confirm':'input_account'" style="" />
					</view>
					<view style="width: 360upx;padding: 15upx;display: flex;flex-direction: row;align-items: center;">
						<view style="color: red;">
							*
						</view>
						城市
						<input v-model="form.city" @click='' :class="input_confirm==2?'input_confirm':'input_account'"
							class="" style="" />
					</view>
					<view style="width: 360upx;padding: 15upx;display: flex;flex-direction: row;align-items: center;">
						<view style="color: red;">
							*
						</view>
						地址
						<input v-model="form.address" @click='' class=""
							:class="input_confirm==3?'input_confirm':'input_account'" style="" />
					</view>
				</view>
				<view style="width: 100%;display: flex;align-items: center;font-size: 12px;color: #FFFFFF;">
					<view style="width: 95%;display: flex;flex-direction: row;align-items: center;padding: 15upx;">
						<view @click="add_cancel"
							style="margin-left: auto;padding: 8upx 15upx 8upx 15upx;color: #606266;border: 1px solid #DCDFE6;">
							取 消
						</view>
						<view @click="add_sure"
							style="margin-left: 18upx;padding: 8upx 15upx 8upx 15upx;background-color:#1890FF">
							确 定
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		props: {
			popupType: {
				type: String,
				value: null
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
