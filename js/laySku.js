layui.define(['form', 'jquery', 'table','upload'], function(exports) {
	var $ = layui.$,
		upload = layui.upload,
		table = layui.table,
		form = layui.form;
	class laySku {
		constructor(arg) {
			this.id = 'SKU_TYPE'
			this.rowReturn = true
			this.container_id = 'skuTable'
			this.alreadySetSkuVals = {}
			Object.assign(this, arg)
		}
		init() {
			this.renderData();//渲染dom
			this.monitor(); //监听form改变
			this.rowspanMaster();//tr单击事件
			this.inputCancle();//取消input默认事件
			this.styleSet();//取消layui默认样式
			this.skuSubmit();//点击提交
		}
		styleSet(){
			var style = `
				.layui-table tbody tr:hover, .layui-table thead tr, .layui-table-click, .layui-table-header, .layui-table-hover, .layui-table-mend, .layui-table-patch, .layui-table-tool, .layui-table-total, .layui-table-total tr, .layui-table[lay-even] tr:nth-child(even) {
				    background-color: #fff;
				}
			`
			let $head = document.getElementsByTagName('head')[0]
			let $style = document.createElement('style')
			$style.innerHTML = style
			$head.append($style)
		}
		renderData(){
			var $html = '';
			layui.each(this.data, function(index, item) {
				$html += '<div class="layui-form-item">'
				$html += '<label class="layui-form-label SKU_TYPE" is_required=' + item.is_required +
					' propid="' + item.id + '" sku-type-name="' + item.name + '">' + item.name + '</label>'
				$html += '<div class="layui-input-block">'
				layui.each(item.propValueList, function(nIndex, nItem) {
					$html += '<input class="sku_value" lay-filter="checkbox" type="checkbox" data-id="' + nItem.keyId +
						'" value="' + nItem.id + '" name="' + nItem.name + '" lay-skin="primary" title="' + nItem.name + '">'
				})
				$html += '</div>'
				$html += '</div>'
			})
			$('#' + this.id).html($html);
			form.render('checkbox');
		}
		getAlreadySetSkuVals(call) {
			var alreadySetSkuVals = {};
			//获取设置的SKU属性值
			$("tr[class*='sku_table_tr']").each(function() {
				var skuPrice = $(this).find("input[type='text'][class*='setting_sku_price']").val(); //SKU价格
				var skuStock = $(this).find("input[type='text'][class*='setting_sku_stock']").val(); //SKU库存
				var imgArr = [],list = $(this).find('div.upload-list img'); //SKU图片
				layui.each(list,function(index,item){
					var src = $(item).attr('src');
					if(src){
						imgArr.push(src)
					}
				})
				var propvalids = $(this).attr("propvalids"); //SKU值主键集合
				var index = $(this).index()
				alreadySetSkuVals[propvalids] = {
					"skuPrice": skuPrice,
					"skuStock": skuStock,
					"skuImgs": imgArr,
					"index":index,
					"propvalids":propvalids,
					"propvalnames":$(this).attr('propvalnames'),
					"propnames":$(this).attr('propnames'),
					"propids":$(this).attr('propids'),
				}
			});
			this.alreadySetSkuVals = alreadySetSkuVals
			typeof call === 'function' && call(alreadySetSkuVals);
		}
		monitor() {
			var _this = this;
			var is_required_name = _this.is_required_name;
			//sku属性发生改变时,进行表格创建
			// var alreadySetSkuVals = {}; //已经设置的SKU值数据
			form.on('checkbox(checkbox)', function(data) {
				// console.log(data.elem); //得到checkbox原始DOM对象
				// console.log(data.elem.checked); //是否被选中，true或者false
				// console.log(data.value); //复选框value值，也可以通过data.elem.value得到
				// console.log(data.othis); //得到美化后的DOM对象
				_this.getAlreadySetSkuVals(); //获取已经设置的SKU值
				var b = true;
				var skuTypeArr = [],skuValueArr = []; //存放SKU类型的数组
				var totalRow = 1; //总行数
				//获取元素类型
				$(".SKU_TYPE").each(function() {
					//SKU类型节点
					var skuTypeNode = $(this);
					var skuTypeObj = {}; //sku类型对象
					//console.log($(this).attr("sku-type-name"))
					//SKU属性类型标题
					skuTypeObj.skuTypeTitle = skuTypeNode.attr("sku-type-name");
					//SKU属性类型主键
					var propid = skuTypeNode.attr("propid");
					skuTypeObj.skuTypeKey = propid;
					//是否是必选SKU 0：不是；1：是；
					var is_required = skuTypeNode.attr('is_required');
					skuValueArr = []; //存放SKU值得数组
					//SKU相对应的节点
					var skuValNode = $(this).next();
					//获取SKU值
					var skuValCheckBoxs = $(skuValNode).find("input[type='checkbox'][class*='sku_value']");
					var checkedNodeLen = 0; //选中的SKU节点的个数
					$(skuValCheckBoxs).each(function() {
						if ($(this).is(":checked")) {
							var skuValObj = {}; //SKU值对象
							skuValObj.skuValueTitle = $(this).attr('name'); //SKU值名称
							skuValObj.skuValueId = $(this).val(); //SKU值主键
							skuValObj.skuPropId = $(this).attr("data-id"); //SKU类型主键
							skuValueArr.push(skuValObj);
							checkedNodeLen++;
						}
					});
					//console.log(skuValueArr)
					if (is_required && "1" == is_required) { //必选sku
						if (checkedNodeLen <= 0) { //有必选的SKU仍然没有选中
							b = false;
							return false; //直接返回
						}
					}
					if (skuValueArr && skuValueArr.length > 0) {
						totalRow = totalRow * skuValueArr.length;
						skuTypeObj.skuValues = skuValueArr; //sku值数组
						skuTypeObj.skuValueLen = skuValueArr.length; //sku值长度
						skuTypeArr.push(skuTypeObj); //保存进数组中
					}
				});
				var SKUTableDom = ""; //sku表格数据
				//开始创建行
				if (b) { //必选的SKU属性已经都选中了
					SKUTableDom += "<table class='skuTable layui-table'><tr>";
					//创建表头
					for (var t = 0; t < skuTypeArr.length; t++) {
						SKUTableDom += '<th>' + skuTypeArr[t].skuTypeTitle + '</th>';
					}
					SKUTableDom += '<th>价格</th><th>库存</th><th>图片</th><th>操作</th>';
					SKUTableDom += "</tr>";
					//循环处理表体
					for (var i = 0; i < totalRow; i++) { //总共需要创建多少行
						var currRowDoms = "";
						var rowCount = 1; //记录行数
						var propvalidArr = []; //记录SKU值主键
						var propIdArr = []; //属性类型主键
						var propvalnameArr = []; //记录SKU值标题
						var propNameArr = []; //属性类型标题
						for (var j = 0; j < skuTypeArr.length; j++) { //sku列
							var skuValues = skuTypeArr[j].skuValues; //SKU值数组
							var skuValueLen = skuValues.length; //sku值长度
							rowCount = (rowCount * skuValueLen); //目前的生成的总行数
							var anInterBankNum = (totalRow / rowCount); //跨行数
							var point = ((i / anInterBankNum) % skuValueLen);
							propNameArr.push(skuTypeArr[j].skuTypeTitle);
							if (0 == (i % anInterBankNum)) { //需要创建td
								currRowDoms += '<td rowspan=' + anInterBankNum + '>' + skuValues[point].skuValueTitle + '</td>';
								propvalidArr.push(skuValues[point].skuValueId);
								propIdArr.push(skuValues[point].skuPropId);
								propvalnameArr.push(skuValues[point].skuValueTitle);
							} else {
								//当前单元格为跨行
								propvalidArr.push(skuValues[parseInt(point)].skuValueId);
								propIdArr.push(skuValues[parseInt(point)].skuPropId);
								propvalnameArr.push(skuValues[parseInt(point)].skuValueTitle);
							}
						}
						var propvalids = propvalidArr.toString()
						var alreadySetSkuPrice = ""; //已经设置的SKU价格
						var alreadySetSkuStock = ""; //已经设置的SKU库存
						var alreadySetSkuImgs = "";//已经设置的imgs
						//赋值
						var alreadySetSkuVals = _this.alreadySetSkuVals;
						if (alreadySetSkuVals) {
							var currGroupSkuVal = alreadySetSkuVals[propvalids]; //当前这组SKU值
							if (currGroupSkuVal) {
								alreadySetSkuPrice = currGroupSkuVal.skuPrice;
								alreadySetSkuStock = currGroupSkuVal.skuStock;
								layui.each(currGroupSkuVal.skuImgs,function(index,item){
									alreadySetSkuImgs += '<img style="width:38px;height:38px;object-fit:cover;" src="'+item+'">';
								})
							}
						}
						SKUTableDom += '<tr propvalids=\'' + propvalids + '\' propids=\'' + propIdArr.toString() +
							'\' propvalnames=\'' + propvalnameArr.join(";") + '\'  propnames=\'' + propNameArr.join(";") +
							'\' class="sku_table_tr">' + currRowDoms +
							'<td><input type="text" class="setting_sku_price layui-input" value="' + alreadySetSkuPrice +
							'"/></td><td><input type="text" class="setting_sku_stock layui-input" value="' + alreadySetSkuStock +
							'"/></td><td><div style="min-width:100px;" class="upload-list">'+ alreadySetSkuImgs +'</div></td><td><button class="upload-btn layui-btn layui-btn-normal">点击上传</button></td></tr>';
					}
					SKUTableDom += "</table>";
				}
				$("#" + _this.container_id).html(SKUTableDom);
				_this.uploadlist();
			});
		}
		rowspanMaster(){
			var _this = this,skuValObjSet="";
			if(!_this.rowReturn) return;
			$('body').on("click",'.skuTable tr',function(e){
				e.stopPropagation();//阻止事件冒泡
				var propvalids = $(this).attr('propvalids')
				_this.getAlreadySetSkuVals(function(setSkuVals){
					skuValObjSet = setSkuVals[propvalids]
					_this.rowMaster(skuValObjSet);
				});
			})
		}
		uploadlist(){
			var current = "";
			var elem = "";
			var _this = this;
			$('body').on('click','.skuTable button.upload-btn',function(e){
				e.stopPropagation();//阻止事件冒泡
				current = $(this).parent().parent().index();
				elem = $(this).parent().prev().find('.upload-list')
			})
			upload.render({
			    elem: '.upload-btn'
				,url: _this.uploadSrc
				,before: function(obj){
					//也可以写一些新的操作
					typeof _this.uploadBefore === 'function' && _this.uploadBefore(obj,elem);
				}
				,done: function(res){
					//上传成功 //也可以写一些新的操作
					typeof _this.uploadDone === 'function' && _this.uploadDone(res);
				}
				,error: function(){
					typeof _this.uploadError === 'function' && _this.uploadError();
				}
			})
		}
		inputCancle(){
			$('body').on('click','.skuTable .layui-input,.layui-upload-file',function(e){
				e.stopPropagation();//阻止事件冒泡
			})
		}
		skuSubmit(){
			var _this = this;
			$('body').on('click','#'+_this.btn,function(){
				_this.getAlreadySetSkuVals(function(setSkuVals){
					typeof _this.skuSubmitBind === 'function' && _this.skuSubmitBind(setSkuVals);
				});
			})
		}
	}



	exports('laySku', laySku);
})
