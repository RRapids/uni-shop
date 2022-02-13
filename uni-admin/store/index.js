/**
 * Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。
 * 它采用集中式存储管理应用的所有组件的状态，
 * 并以相应的规则保证状态以一种可预测的方式发生变化。
 * uni-app 内置了 Vuex 。
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) //vue的插件机制

// Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { // 存放状态
		isLogin: false,
		orderType: 'takein',
		userInfo: {

		},
		choseAddress: {},
		choseStore: {},
		orderCurrent: {}
	},
	// mutation 转变
	mutations: {
		//登录
		Login(state, res) {
			state.isLogin = true
			state.userInfo = res
			uni.setStorage({
				key: 'userinfo',
				data: res
			})
		},

		SET_LOGINSTATUS(state, status) {
			if (status == 'true') {
				state.isLogin = true
			}
		},
		SET_USERINFO(state, value) {
			state.userInfo = value
		},

		SET_ORDERTYPE(state, type) {
			state.orderType = type
		},


		SET_ADDRESS(state, address) {
			state.choseAddress = address
		},

		SET_STORE(state, store) {
			state.choseStore = store
		},
		SET_ORDERCURRENT(state, current) {
			state.orderCurrent = current
		},
		CHEAR_CURRENT(state) {
			state.orderCurrent = {}
		},
		SET_ORDERCURRENTSTATUS(state, status) {
			state.orderCurrent.status = status
		}
	},
	actions: {}
})
export default store
