/**
 * @Comments : 系统通讯对象。
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
ClientProtocol = (function() {
	
	//保存客户端对象。
	var externalList = {};
	
	/**
	 * @Comments : 将请求转换过来的数据类型，转换成json格式。
	 * @param    : result 结构数据。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-18
	 */
	var dataParse = function(result, dataType){
		switch( dataType ){
			case 'string' :
				result = $.parseJSON(result);
				break ;
			case 'json' :
				break ;
			default :
				break ;
		}
		return result;
	};
	
	var clientRequestValidateOptions = function(options){
		
	};
	
	/**
	 * @Comments : 客户端请求参数转换。
	 * @param    : urlParam
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-24
	 */
    var getClientRequestOptions = function(urlParam){
		var opts = {};
		opts.dataType = urlParam.dataType;
		opts.scope = urlParam.scope || opts;
		opts.failure = urlParam.failure;
		opts.complete = urlParam.complete;
		opts.resultWrapper = urlParam.resultWrapper;
		opts.beforeUrl = urlParam.beforeUrl;
		opts.callName = urlParam.callName;

		if( !$.isFunction(opts.resultWrapper) ){
			opts.resultWrapper = function(result){
				result.data = result.result.data;
				result.result.data = {};
				return result;
			};
		}
		return opts;
	};
	
	/**
	 * @Comments : 客户端回调函数封装。
	 * 统一结果数据格式：result={ data:{}, status:'error' }
	 * @param    : options, callName回调函数名称。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-8-24
	 */
	 var clientCallBack = function(options, params){
		params[options["callName"]] = function(result){
			logger.log("hexinAjax请求返回结果：" + result);
			var textStatus = "success";
			try{
				result = dataParse(result, options.dataType);
				//result = eval('(' + result + ')');
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
					options.afterSuccess.call(options.scope, options, result, textStatus);
				}
				if( $.isFunction(options.success) ) {
					options.success.call(options.scope, options, result, textStatus); 
				}
			}else{
				textStatus = "error";
				if( $.isFunction(options.failure) ){
					options.failure.call(options.scope, options, result, textStatus);
				}
			}
			if ( $.isFunction(options.complete) ) {
				options.complete.call(options.scope, options, textStatus); 
			}
		};
	};
	
	var clientFuncRun = function(obj, funcName, params){
		var len = params.length;
		var result = null;
		if(len == 0){
			result = obj[funcName]();
		}else if( len == 1){
			result = obj[funcName](params[0]);
		}else if( len == 2){
			result = obj[funcName](params[0], params[1]);
		}else if( len == 3){
			result = obj[funcName](params[0], params[1], params[2]);
		}else if( len == 4){
			result = obj[funcName](params[0], params[1], params[2], params[3]);
		}
		return result;
	};
	
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
	var clientRequest = function(options){
		var clientObj = externalList[options.external];
		if( !clientObj ){
			clientObj = external.createObject(options.external);
			externalList[options.external] = clientObj;
		}
		//参数是否为数组,不是数组将参数转换为数组。 这样可以支持多个参数。
		var params = [];
		if( options.parameter ){
			if( $.isArray(options.parameter) ){
				params = options.parameter;
			}else{
				params[0] = options.parameter;
			}
		}
		
		//如果没有回调函数名，则不生成回调函数。
		if( options.callName ){
			clientCallBack(options, params[0]);
		}
		
		if( !$.isEmptyObject(options.beforeUrl) ){
			logger.log("调用前置beforeUrl：" + options.external + "." + options.beforeUrl);
			clientFuncRun(clientObj, options.beforeUrl, params);
			//clientObj[options.beforeUrl](params[0], params[1], params[2], params[3]);
		}
		logger.log("调用url：" + options.external + "." + options.url);
		
		var result = clientFuncRun(clientObj, options.url, params);
		//var result = clientObj[options.url](
					//params[0], params[1], params[2], params[3]);
		return result;
	};
	
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
	 
	var clientRequest = function(options){
		var clientObj = externalList[options.external];
		if( !clientObj ){
			clientObj = external.createObject(options.external);
			externalList[options.external] = clientObj;
		}
		
		clientOnready(options);
		
		if( $.isEmptyObject(options.beforeUrl) ){
			logger.debug("调用前置beforeUrl：" + options.external + "." + options.beforeUrl);
			clientObj[options.beforeUrl](options);
		}
		logger.debug("调用url：" + options.external + "." + options.url);
		
		var result = clientObj[options.url](options);
		return result;
	};*/
	
	/**
	 * @Comments : 将结果数据类型转化为标准的数据类型。
	 * @param    : result
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-24
	 
	var resultWrapper = function(result){
		result.data = result.result;
		result.result = {};
		return result;
	};*/

	var hexinAjaxValidateOptions = function(options){

	};
	
	/**
	 * @Comments : TCP请求参数转换。
	 * @param    : urlParam
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-24
	 */
	var getHexinAjaxOptions = function(urlParam){
		var opts = {};

		opts.type = urlParam.type;
		opts.dataType = urlParam.dataType;
		
		opts.callName = urlParam.callName;
		opts.failure = urlParam.failure;
		opts.complete = urlParam.complete;
		opts.resultWrapper = urlParam.resultWrapper;

		opts.scope = urlParam.scope;

		//将结果数据类型转化为标准的数据类型。
		//标准的数据类型格式：result={ data:{}, status:'error' }
		if( !$.isFunction(opts.resultWrapper) ){
			opts.resultWrapper = function(result){
				if( $.isEmptyObject(result) ){
					return {};
				}
				result.data = result.result;
				result.result = {};
				return result;
			};
		}
		return opts;
	};

	/**
	 * @Comments : 核新同花顺Ajax的通讯方式。
	 * @param    : urlParam ==> { 为在URLParam中返回的urlParam。
	 *		askType
	 *		parameter	: 请求参数
	 *		resultWrapper
	 *		forceRefresh
	 *		dataType
	 *		scope		 : 请求作用域
	 *      data         : 传递的参数
	 *		type		 : 'GET' or 'POST'
	 *      success      : 加载成功的回调函数
	 *      failure      : 加载失败的回调函数
	 *      complete     : 请求结束后回调函数
	 *		url			 : 请求url
	 *      ........
	 * }
	 * @author	 : yekongling@myhexin.com
	 * @modifyAuthor   : liuhualuo@163.com
	 * @create   : 2012-7-19
	 */
    var hexinAjax  = function(options) {
    	var clientObj = externalList[options.external];
		if( !clientObj ){
			clientObj = external.createObject(options.external);
			externalList[options.external] = clientObj;
		}
		
    	var url  = options.url || '';
    	if(url[url.length - 1] == '&'){
    	    url  = url.substr(0, url.length - 1);
    	}
    	var datas= [];
    	var data = null;
    	if(options.type == 'GET'){
    		$.each(options.parameter, function(key, val){
    			datas.push(key,'=',val,'&')
        	});
        	if(datas.length){
        	    datas.pop();
        	}
        	if(url.indexOf('?') < 0 && datas.length >0){
        	    datas.unshift('?');
        	}
        	url += datas.join('');
    	}else if(options.type == 'POST'){
    		$.each(options.parameter, function(key, val){
    			if(!$.isEmptyObject(val)){
    				datas.push(key,'=',val,'&')
    			}
        	});
        	if(datas.length){
        	    datas.pop();
        	}
        	data = datas.join('');
    	}
		
		options.callName = "onready";
		clientCallBack(options, options);
		logger.log("hexinAjax请求发送：(" + url + "), 参数(" + data + ")");
     	var result = clientObj.request({
    		'onready' 	: options[options.callName],
    		'url'		: url,
    		'type'		: 49,
    		'post'		: data
    	});
    	return result;
    };
	
	Protocol.registerRequest("hexinAjax", {
		type : "hexinAjax",
		getOptions : getHexinAjaxOptions,
		validateOptions : hexinAjaxValidateOptions,
		request : hexinAjax,
		registerEvent : null
	});
	
	Protocol.registerRequest("client", {
		type : "client",
		getOptions : getClientRequestOptions,
		validateOptions : clientRequestValidateOptions,
		request : clientRequest,
		registerEvent : null
	});
	
})();
