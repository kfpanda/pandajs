var FooterController = BaseController.extend({
	_data : {//配置模板数据
		pctlist : []
	},
	request : function() {
		var that = this;//获取正确的对象
		//Protocol.request
		this.sendRequest("rcmd_prdct.RcmdPrdctList",{
			parameter:{},//传递的参数
			resultWrapper:function(data){//过滤方法
				var result = [];
				result[0] ={"rname":"test1!"};
				result[1] ={"rname":"test2!"};
				return result;//必须要返回！！
			},
			success: that.mysuccess,
			scope : that,
			complete:that.complete,
			failure:that.failure
		});
	},

	mysuccess: function(options, result, textStatus){
		this._data.pctlist = result;
	},
	complete:function(){//请求完成后执行 这个是闭包
		//alert("complete");
	},
	failure:function(jqXHR, textStatus, errorThrown){//请求失败后执行
		//alert("ddd"+"失败");
	},
	addEventListener : function(){//
		$("#bodyDiv").delegate(".btn2","click",function(){//给模板上的元素添加监听
			alert("我被点击了");
		});
	}
});