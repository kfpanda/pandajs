/**
 * @Comments : 系统通讯对象。
 * @author   : liuhualuo@myhexin.com
 * @create   : 2012-7-18
 */
AjaxProtocol = (function() {
	
	/**
	 * @Comments : 校验传入的ajax请求的options参数，设置默认值。
	 * @param    : {Object}    options 参数选项对象
	 * @author   : liuhualuo@myhexin.com
	 * @create   : 2012-7-18
	 */
    var ajaxValidateOptions   = function(options) {
        if ($.isEmptyObject(options.type)) {
            options.type = 'GET';
        }
        if ($.isEmptyObject(options.dataType)) {
            options.dataType = 'json';
        }
        if ($.isEmptyObject(options.async)) {
            options.async = true;
        }
        if ($.isEmptyObject(options.cache)) {
            options.cache = false;
        }
        if ($.isEmptyObject(options.timeout)) {
            options.timeout = 18000;
        }
        if ($.isEmptyObject(options.showErr)) {
            options.showErr = false;
        }
    };
    
	/**
	 * @Comments : 将urlParam参数，转化为ajax请求的options参数形式。
	 * @param    : urlParam ==> { 为在URLParam中返回的urlParam。
	 *		askType
	 *		parameter	: 请求参数
	 *		resultWrapper
	 *		forceRefresh
	 *		dataType
	 *		scope		 : 请求作用域
	 *      data         : 传递的参数
	 *      success      : 加载成功的回调函数
	 *      failure      : 加载失败的回调函数
	 *      complete     : 请求结束后回调函数
	 *		url			 : 请求url
	 * }
	 * @author   : liuhualuo@myhexin.com
	 * @create   : 2012-7-18
	 */
	var getAjaxOptions = function(urlParam){
		var opts = {};
		opts.askType = urlParam.askType;
		opts.dataType = urlParam.dataType;
		opts.type = urlParam.type;
		opts.refreshTime = urlParam.refreshTime
		
		opts.data = urlParam.parameter;
		opts.failure = urlParam.failure;
		opts.complete = urlParam.complete;
		opts.resultWrapper = urlParam.resultWrapper;
		
		opts.scope = urlParam.scope;
		if( !$.isFunction(opts.resultWrapper) ){
			opts.resultWrapper = function(result){
				//console.log('P.resultWrapper');
				/*
				result = $.xml2json(result);
				if( $.isEmptyObject(result) ){
					return {};
				}
				result.data = result.result;
				result.result = {};
				*/
				return result;
			};
		}
		return opts;
	};

	/**
	 * @Comments : ajax请求数据接口。
	 * @param    : options ==> {
	 *      data         : 传递的参数
	 *      success      : 加载成功的回调函数
	 *      failure      : 加载失败的回调函数
	 *      complete     : 请求结束后回调函数
	 *		url			 : 请求url
	 *      ........
	 * }
	 * @author   : liuhualuo@myhexin.com
	 * @create   : 2012-7-19
	 */
    var ajaxRequest = function(options) {
        var result = $.ajax({
			accepts		 : options.accepts,
			async		 : options.async,			//默认为true，请求以同步的形式发送。 该选项不支持 跨域请求和jsonp请求。jQuery 1.8, the use of async: false is deprecated.
            beforeSend   : options.beforeSend,		//在请求之前调用方法。参数（jqXHR, settings）。如果方法返回false，请求将不会被发送。
			cache        : options.cache,			//如设置false，则强制刷新，在url上添加参数"_=[TIMESTAMP]"。
			contents	 : options.contents,			//一个map参数，作为请求相应的content type。
			contentType  : options.contentType,		//默认值'application/x-www-form-urlencoded'，ata will always be transmitted to the server using UTF-8 charset;
			context		 : options.context,
			converters	 : options.converters,		//默认值{"* text": window.String, "text html": true, "text json": jQuery.parseJSON, "text xml": jQuery.parseXML}。每个转换值对应一个转换方法。
			crossDomain  : options.crossDomain,		//当设置为true时，强制跨域请求。
			data         : options.data,				//发送请求参数。
			dataFilter   : options.dataFilter,		//返回数据过滤方法。参数（data,type),data为从服务器返回过来的数据，type为数据类型。
			dataType     : options.dataType, //'jsonp',	//默认是系统智能猜测(xml, json, script, or html)。
			global		 : options.global,			//默认值为true
			headers		 : options.headers,			//默认值为{}, 一个map参数，在beforeSend方法调用前设置header。
			ifModified	 : options.ifModified,		//默认值为false，
			isLocal		 : options.isLocal,			//默认依赖当前本地协议。
			jsonp		 : options.jsonp,			//jsonp请求
			jsonpCallback: options.jsonpCallback,
			mimeType	 : options.mimeTyp,
			username	 : options.username,
			password	 : options.password,
			processData  : options.processData,		//默认值为true，
			scriptCharset: options.scriptCharset,
			statusCode	 : options.statusCode,		//默认值为{} statusCode: {	404: function() {	alert("page not found");	}	}
			timeout		 : options.timeout,
			traditional	 : options.traditional,
			url          : options.url,
            type         : options.type,
            error        : function(jqXHR, textStatus, errorThrown) {
				if ( $.isFunction(options.failure) ) {
					options.failure.call(options.scope, textStatus, errorThrown);
				}
            },
            success : function(result, textStatus, jqXHR) {
				if ( $.isFunction(options.resultWrapper) ) { 
					result = options.resultWrapper(result);
				}
				if( $.isFunction(options.afterSuccess) ){
					options.afterSuccess(options, result, textStatus);
				}
				if ( $.isFunction(options.success) ){
					options.success.call(options.scope, options, result, textStatus);
				}
            },
			complete : function(jqXHR, textStatus){		//在请求完后，调用的方法（无论请求是否成功都会调用）。参数（jqXHR=XMLHTTPRequest, textStatus="success", "notmodified", "error", "timeout", "abort", or "parsererror"）。
				if ( $.isFunction(options.complete) ) {
					options.complete.call(options.scope, options, textStatus);
				}
			}
        });
		return result;
    };
	
	var ajaxRegisterEvent = function(options){
		ajaxRequest(options);
		setTimeout(function(){
			ajaxRegisterEvent(options);
		}, options.refreshTime || 2000);
	};
	
	Protocol.registerRequest("ajax", {
		type : "ajax",
		getOptions : getAjaxOptions,
		validateOptions : ajaxValidateOptions,
		request : ajaxRequest,
		registerEvent : ajaxRegisterEvent
	});
	
})();

