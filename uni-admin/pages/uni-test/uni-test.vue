<template>
	<view>
		<view>123</view>
		<button @click="openpopup()">开</button>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" message="成功消息" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		methods: {
			openpopup() {
				this.$refs.popup.open()
			}
		},
		onLoad() {
			
		}
	}
</script>

<style>

</style>
