'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	switch (event.action) {
		case 'getList':
			// 模糊查询
			// 筛选条件，默认为空，格式 {key:'values'}
			var keywords = event.keywords ? {
				roleName: new RegExp(event.keywords)
			} : {};
			console.log("roleName", keywords)

			var pageIndex = event.pageIndex ? event.pageIndex : 1; //当前第几页，默认为第一页
			var pageSize = event.pageSize ? event.pageSize : 5; //每页取多少条记录，默认为10条  

			const countResult = await db.collection('role').where(keywords).count() //获取集合中的总记录数
			const total = countResult.total //得到总记录数 
			const totalPage = Math.ceil(total / pageSize) //计算页数
			console.log("totalPage", pageIndex, total, totalPage)

			// 查询数据并返回给前端
			return db.collection('role')
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
		case 'add':
			let date = new Date().toUTCString()

			let field = {
				roleId: event.data.roleId,
				roleName: event.data.roleName,
				permission: event.data.permission,
				createTime: date,
				note: event.data.note
			}

			const name = event.data.roleName
			const resultDB = await db.collection('role').where({
				roleName: name
			}).get()


			if (resultDB.data.length === 0) {
				const res = await db.collection('role').add(field)
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
				roleId: event.data.roleId,
				roleName: event.data.roleName,
				permission: event.data.permission,
				createTime: event.data.createTime,
				note: event.data.note
			}

			const editId = event.data.id
			const res = await db.collection('role').where({
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
		case 'delete':
			const _id = event.id
			const result = await db.collection('role').where({
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
		case 'deleteMore':
			let flag;

			for (let i = 0; i < event.data.length; i++) {
				const result = await db.collection('role').where({
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
