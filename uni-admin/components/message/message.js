import vue from 'vue';
// 引入上面写好的组件
import Message from './message/message.vue';

const MsgClass = vue.extend(Message);

const MsgMain = {
	show(message, type, duration) {
		// 实例化这个组件
		const instance = new MsgClass();
		// 将组件实例挂在到一个元素上面，如果不传参数就是挂载到body，或者也可以传入其他已经存在的元素的选择器
		instance.$mount(document.createElement('div'));
		// 通过组件实例的$el属性，可以访问到这个组件元素，然后把它拼接到body上。
		document.body.appendChild(instance.$el);
		// 给这个实例传入参数
		instance.type = type;
		instance.message = message;
		instance.isShow = true;
		
		// 设置一个延迟，过了时间弹窗消失
		setTimeout(() => {
			instance.isShow = false;
		}, duration);
	},
	// 成功时调用这个方法
	success(text, duration = 2000) {
		this.show(text, 'success', duration);
	},
	// 失败时调用这个方法
	error(text, duration = 2000) {
		this.show(text, 'error', duration);
	},
};
// 全局注册
function Msg() {
	vue.prototype.$msg = MsgMain;
	// 最终调用就是this.$msg.success() 或者this.$msg.error()
}

export default Msg;
