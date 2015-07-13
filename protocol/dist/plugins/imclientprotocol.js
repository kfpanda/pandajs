/**
 * @Comments : 系统通讯对象。
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
IMClientProtocol = (function() {
	
	var urlParamList = {};
	var externalList = {};
	var __IM__ = external.createObject('InstantMessager');

	externalList['InstantMessager'] = __IM__;
	
	var failure = function(result, textStatus){
	}
	
	/*
	 * @Comments : 加工多条不同类型或同类型op返回结果集，并逐条调用callback方法（包含result属性的记录不加工直接调用）
	 * @author   : luhaining@myhexin.com
	 * @create   : 2013-04-08
	 */
	var filter = function(op, xmlData) {
		logger.log("IMClient请求(" + op + "),返回结果：" + xmlData);
		var result = {};
		try {
			//转换格式
			result = $.xml2json(xmlData);
		}catch(e){
			logger.error(["IMClient请求(" + op + "), $.xml2json(xmlData) 解析出错：", e]);
		}
		if(result.result){
			callback(result);
			return;
		}
		for(o in result){
			if(typeof result[o] == 'string'){ continue; }
			var tmp = {};
			if($.isArray(result[o])){
				for(var i=0; i<result[o].length; i++){
					tmp[o] = result[o][i];
					tmp.op = o;
					callback(tmp);
				}
			}else{
				tmp[o] = result[o];
				tmp.op = o;
				callback(tmp);
			}
		}
	};
	
	var callback = function(result){
		var textStatus = "success";
		var uuid = "";
		var options = {};
		try{
			uuid = (result.result || {}).id;
			if(urlParamList[uuid]){
				options = urlParamList[uuid];
			}else if(urlParamList["op_" + result.op]){
				//回调注册的回调函数。
				options = urlParamList["op_" + result.op];
			}else{
				options = {};
			}
			
			if( $.isFunction(options.resultWrapper) ){
				result = options.resultWrapper(result);
			}
			result.status = "success";
		}catch(e){
			result = e;
			result.status = "error";
			textStatus = "error";
		}
		
		if( textStatus === "success" ){
			if( $.isFunction(options.afterSuccess) ){
				options.afterSuccess(options, result, textStatus);
			}
			if( $.isFunction(options.success) ) {
				options.success.call(options.scope, options, result, textStatus); 
			}
		}else{
			textStatus = "error";
			failure(result, textStatus);
		}
		if ( $.isFunction(options.complete) ) {
			options.complete.call(options.scope, options, textStatus); 
		}
		//清除urlparam
		urlParamList[uuid] = undefined;
	}
	
	//注册回调函数
	__IM__.registerEvent(filter);

	/**
	 * @Comments : 客户端对象暴露的通讯方式。
	 * @param    : options ==> {
	 *      data         : 传递的参数
	 *      dataType     : 请求返回的数据类型。
	 *		url          : 客户端暴露的请求方法。
	 *		client       : 客户端暴露的请求对象。
	 *      success      : 加载成功的回调函数
	 *      failure      : 加载失败的回调函数
	 *      complete     : 请求结束后回调函数
	 *		url			 : 请求url
	 *      ........
	 * }
	 *	   result为请求成功后返回的数据。
	 *	   textStatus="success", "error"。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-24
	 */
	var IMClientRequest = function(options){
		var clientObj = externalList[options.external];
		if( !clientObj ){
			clientObj = external.createObject(options.external);
			externalList[options.external] = clientObj;
		}
		var result = null;
		if( (options.parameter || {}).id ){
			//如果 id为一个方法，则执行id 返回作为结果。
			options.parameter.id = (typeof options.parameter.id == "function") 
								? options.parameter.id() : options.parameter.id;
			//将参数放入全局对象，等待回调方法中使用。
			urlParamList[options.parameter.id] = options;
			result = clientObj[options.url](options.parameter);
			logger.log(["调用url：" + options.url + "， 请求参数：", options.parameter]);
		}else{
			//id为null直接返回结果，该方法没有回调函数
			(options.parameter || {}).id = undefined;
			if(!!options.parameter){
				(options.parameter || {}).id = undefined;
				result = clientObj[options.url](options.parameter);
			}else{
				result = clientObj[options.url]();
			}
			logger.log(["调用url：" + options.url + "， 请求参数：", options.parameter, " 直接结果返回：", result]);
		}
		return result;
	};

	/**
	 * @Comments : 将结果数据类型转化为标准的数据类型。
	 * @param    : result
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-24
	 */
	var resultWrapper = function(result){
		var data = {};
		if( $.isEmptyObject(result) ){
			return data;
		}
		if( !$.isEmptyObject(result.result) ){
			$.each(result.result, function(p_key, p_value){
				data[p_key] = p_value;		
			});
			result.result = undefined;
		}
		data.op = result.op;
		data.data = result[data.op];
		return data;
	};

	var IMClientValidateOptions = function(options){
		
	};
	
	/**
	 * @Comments : 请求参数转换。
	 * @param    : urlParam
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-24
	 */
	var getIMClientOptions = function(urlParam){
		var opts = {};
		
		opts.external = urlParam.external;
		opts.failure = urlParam.failure;
		opts.complete = urlParam.complete;
		opts.resultWrapper = urlParam.resultWrapper;
		opts.dataType = urlParam.dataType;
		opts.scope = urlParam.scope;
		
		if( !$.isFunction(opts.resultWrapper) ){
			opts.resultWrapper = resultWrapper;
		}
		return opts;
	};
	
	var registerEvent = function(urlParam){
		urlParamList["op_" + urlParam.parameter.op] = urlParam;
	};

	
	Protocol.registerRequest("IMClient", {
		type : "IMClient",
		getOptions : getIMClientOptions,
		validateOptions : IMClientValidateOptions,
		request : IMClientRequest,
		registerEvent : registerEvent
	});
	
})();
