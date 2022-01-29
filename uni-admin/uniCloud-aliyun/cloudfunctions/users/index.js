'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	switch (event.action) {
		case 'getList':
			// 模糊查询
			// 筛选条件，默认为空，格式 {key:'values'}
			var keywords = event.keywords ? {
				nickName: new RegExp(event.keywords)
			} : {};
			console.log("keywords", keywords)


			var pageIndex = event.pageIndex ? event.pageIndex : 1; //当前第几页，默认为第一页
			var pageSize = event.pageSize ? event.pageSize : 5; //每页取多少条记录，默认为10条  

			const countResult = await db.collection('users').where(keywords).count() //获取集合中的总记录数
			const total = countResult.total //得到总记录数 
			const totalPage = Math.ceil(total / pageSize) //计算页数
			console.log("totalPage", pageIndex, total, totalPage)

			// 查询数据并返回给前端
			return db.collection('users')
				.where(keywords)
				.skip((pageIndex - 1) * pageSize)
				.limit(pageSize)
				.get()
				.then(res => {
					return {
						res,
						total
					}; // 返回json给客户端
				})

			break;

			// 增加
		case 'addUsers':
			let date = new Date()
			
			let field = {
				nickName: event.data.name,
				gender: event.data.gender,
				city: event.data.city,
				createTime: date,
				lastLoginTime: '',
				avatarUrl: ''
			}

			const name = event.data.name
			const resultDB = await db.collection('users').where({
				name: name
			}).get()


			if (resultDB.data.length === 0) {
				const res = await db.collection('users').add(field)
				return {
					status: 0,
					msg: '添加成功'
				}
			}
			return {
				status: -1,
					msg: '已存在'
			}
			break;

			// 修改
		case 'edit':
			let edit_field = {
				nickName: event.data.name,
				gender: event.data.gender,
				city: event.data.city,
				createTime: event.data.createTime,
				lastLoginTime: event.data.lastLoginTime,
				avatarUrl: event.data.avatarUrl
			}

			const editId = event.data.id
			const res = await db.collection('users').where({
				_id: editId
			}).update({
				...edit_field
			})
			if (res.updated === 1) {
				return {
					status: 0,
					msg: "数据修改成功"
				}
			} else if (res.updated === 0) {
				return {
					status: -1,
					msg: '数据修改失败'
				}
			}

			break;

			// 删除
		case 'deleteUsers':
			const _id = event.id
			const result = await db.collection('users').where({
				_id
			}).remove()

			if (result.deleted === 1) {
				return {
					status: 0,
					msg: '删除成功'
				}
			} else {
				return {
					status: -1,
					msg: '删除失败'
				}
			}
			break

			// 批量删除
		case 'deleteMoreUsers':
			let flag;

			for (let i = 0; i < event.data.length; i++) {
				const result = await db.collection('users').where({
					_id: event.data[i].id
				}).remove()
				if (result.deleted === 1) {
					flag = 0

				} else {
					flag = -1
				}
			}

			if (flag === 0) {
				return {
					status: 0,
					msg: '删除成功'
				}
			} else {
				return {
					status: -1,
					msg: '删除失败'
				}
			}
			break
	}
};
