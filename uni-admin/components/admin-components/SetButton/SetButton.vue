<template>
	<view>
		<image :src="img" :class="btnType=='search'?'queryImg':'manageImg'">
		</image>
		{{name}}
		<p>{{start}}</p>
	</view>
</template>

<script>
	export default {
		props: {
			btnType: {
				type: String,
				value: null
			}
		},
		data() {
			return {
				btnList: [{
						type: 'add',
						name: '添加',
						img: '@/static/add.png'
					},
					{
						type: 'delete',
						name: '批量删除',
						img: '@/static/delete.png'
					}, {
						type: 'search',
						name: '查询',
						img: '@/static/search.png'
					}
				],
				name: '',
				img: ''
			}
		},
		computed: {
			start() {
				this.btnList.forEach((item, index) => {
					if ((item.type) == (this.btnType)) {
						this.name = item.name
						this.img = require('@/static/' + item.type + '.png')
					}
				})
			}
		}
	}
</script>

<style>
	.queryImg {
		width: 13upx;
		height: 13upx;
		margin-right: 5upx;

	}
</style>
