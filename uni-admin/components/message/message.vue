<template>
	<view>
		<uni-popup ref="popup" type="message">
			<uni-popup-message :type="type" :message="message" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "message",
		props: {
			type: {
				type: String,
				default: 'success',
			},
			message: {
				type: String,
				default: '',
			},
		},
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
