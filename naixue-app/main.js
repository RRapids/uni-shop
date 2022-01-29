import Vue from 'vue'
import App from './App'
//引入vuex
import store from './store'

Vue.config.productionTip = false

//设置vuex为全局组件
Vue.prototype.$store = store

App.mpType = 'app'

// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
const app = new Vue({
	store,
	...App

})
// 手动挂载实例
app.$mount()