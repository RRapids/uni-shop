'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	
	switch(event.action){
		case 'login':
		//event为客户端上传的参数
		console.log('event : ', event.password)
		
		const account = event.account
		const adminInDB = await db.collection('admin').where({
			account: account
		}).limit(1).get();
		
		//返回数据给客户端
		console.log("adminInDB", adminInDB)
		if (adminInDB.data && adminInDB.data.length === 0) {
			return {
				"status": -1,
				"msg": '账号不存在!'
			}
		} else {
			if ((event.account == adminInDB.data[0].account) && (event.password == adminInDB.data[0].password)) {
				return {
					"status": 0,
					"msg": '登录成功!',
					"data": adminInDB.data[0]
				}
			} else {
				return {
					"status": -2,
					"msg": '密码错误!'
				}
			}
		}
		break
	}
};
