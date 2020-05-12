layui.define(function(exports) {
	//is_required 是否是必选的 1是0否
	//id,name,is_required,propValueList是一层数据必要参数
	//propValueList中id,name是必要参数
	var server = {
		"success": null,
		"code": 0,
		"data": [{
			"id": "5942768577949877525",
			"is_required":1,
			"name": "颜色",
			"sort": 1,
			"remark": null,
			"shopId": "24067562883074797",
			"propValueList": [{
				"id": "1153355001239653666",
				"keyId": "5942768577949877525",
				"name": "白色",
				"sort": "1",
				"remark": "1",
				"shopId": "24067562883074797",
				"propKey": null
			}, {
				"id": "3476663502563787178",
				"keyId": "5942768577949877525",
				"name": "红色",
				"sort": "1",
				"remark": "1",
				"shopId": "24067562883074797",
				"propKey": null
			}]
		}, {
			"id": "7004885251889806887",
			"is_required":1,
			"name": "尺寸",
			"sort": 1,
			"remark": null,
			"shopId": "24067562883074797",
			"propValueList": [{
				"id": "3697573256632223615",
				"keyId": "7004885251889806887",
				"name": "1寸",
				"sort": "1",
				"remark": "1",
				"shopId": "24067562883074797",
				"propKey": null
			}, {
				"id": "7247064376898044469",
				"keyId": "7004885251889806887",
				"name": "2寸",
				"sort": "1",
				"remark": "1",
				"shopId": "24067562883074797",
				"propKey": null
			}]
		}, {
			"id": "8539195543055021490",
			"is_required":0,
			"name": "产地",
			"sort": 1,
			"remark": null,
			"shopId": "24067562883074797",
			"propValueList": [{
				"id": "638785769989161217",
				"keyId": "8539195543055021490",
				"name": "中国",
				"sort": "1",
				"remark": "1",
				"shopId": "24067562883074797",
				"propKey": null
			}, {
				"id": "968453847158640353",
				"keyId": "8539195543055021490",
				"name": "香港",
				"sort": "1",
				"remark": "1",
				"shopId": "24067562883074797",
				"propKey": null
			}]
		}],
		"msg": "根据商品分类获取属性名集合！"
	}
	exports('server', server);
})
