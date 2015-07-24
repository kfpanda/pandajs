/**
 * @comment : 请求参数提供类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function() {
	
	var URLParam = function(){
		this.name = 'URLParam';
		this.version = '2.0.1';
	};
	this.URLParam = new URLParam();
	URLParam = this.URLParam;
	
	//包含所有的参数的列表。
	var paramList = {};
	
	/**
	 * @Comments : 将参数添加到全局的paramList变量中。
	 * @param    :  prmObj 为参数名, 为ParamInf的一个实现类
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-8-10
	 */
	var addParamList = function(prmObj){
		var oName = prmObj.getName();
		// alert(oName);
		var objParams = prmObj.paramList;
		var defaultParam = objParams["defaultParam"] || {};
		
		//处理获取参数规则
		var specFunc = function(paramName){
			return objParams[paramName];
		};
		if( !$.isEmptyObject(prmObj) && $.isFunction(prmObj.getSpecificParam) ){
			specFunc = prmObj.getSpecificParam;
		}
		
		//遍历所有params 将param放入到paramList全局变量中。
		$.each(objParams, function(key, value){
			var extendParam = {};
			var specParam = specFunc(key);
			if( specParam["extend"] ){
				extendParam = specFunc(specParam["extend"]);
			}
			
			specParam = $.extend(true, {}, defaultParam, extendParam, specParam);
			paramList[oName + "." + key] = specParam;
			
		});
	};

	URLParam.addParamObj = function(prmObj){
		addParamList(prmObj);
	}
		
	/**
	 * @Comments : 获得特定的请求参数。
	 * @param    :  paramName 为参数名, paramType为ParamType对象中属性。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-23
	 */
	URLParam.getUrlParam = function(paramName){
		/*如果Param类已经提供了 getSpecificParam 方法则直接调用该方法。
		if( !$.isEmptyObject(paramType) && $.isFunction(paramType.getSpecificParam) ){
			return paramType.getSpecificParam(paramName);
		}
		var specParam = $.extend(true, {}, paramType["defaultParam"], paramType[paramName]);
		return specParam;
		*/
		var specParam = $.extend(true, {}, paramList[paramName]);
		return specParam;
	}

})();
;/**
 * @comment : 请求提供类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function() {
	
	var Protocol = function(){
		this.name = 'Protocol';
		this.version = '2.0.1';
	};
	this.Protocol = new Protocol();
	Protocol = this.Protocol;
	
	window.logger = (typeof logger != "object") ? 
					{log:function(){}, error:function(){}} : logger;
	
	//请求缓存
	Protocol.Cache = (function() {
		return {
			SetUp : false,

			putCache : function(opts, data) {

			},
			getCache : function(urlParam, key) {
				return null;
			}
		}
	})();
	
	var requestCache = Protocol.Cache.SetUp;		//默认全局缓存的开启。
	
	/*缓存请求类型, 
	 格式	ajax : {
    		type : "ajax",
    		getOptions : getAjaxOptions,
    		validateOptions : validateOptions,
    		request : ajaxRequest,
    		registerEvent : ajaxRegisterEvent
    	}
    */
	var typeRequest = {
		
	};
	
	Protocol.registerRequest = function(type, request){
		typeRequest[type] = request;
	},

	/**
	 * @Comments : 获得特定的RequestWay参数。
	 * 参数处理顺序->  getAjaxOptions -> putOptions -> ajaxValidateOptions
	 * @param    : urlParam 为在URLParam中返回的urlParam。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-18
	 */
	Protocol.getSpecificUrlParam = function(urlParam){
		var opts = {};
		urlParam = $.extend(true, {}, Protocol.defaultParam, urlParam);
		var rqType = urlParam.requestType;
		// var Type = Protocol.RequestType;
		var getOpts = typeRequest[rqType]["getOptions"];
		if( typeof getOpts == "function" ){
			opts = getOpts(urlParam);
		}else{
			opts = getDefaultOptions(urlParam);
		}
		//放入所有请求必须要有的参数。
		opts = putOptions(opts, urlParam);
		
		//把urlParam放入到请求项中。
		opts.urlParam = urlParam;
		
		var validateOpts = typeRequest[rqType]["validateOptions"];
		if( typeof validateOpts == "function" ){
			validateOpts(opts);
		}else{
			defaultValidateOptions(opts);
		}
		return opts;
	},

    /**
	 * @Comments : request请求数据接口。
	 * @param    : urlParam ==> {
	 *      parameter    : 传递的参数
	 *      success      : 请求成功的回调函数
	 *      complete     : 请求完成后的回调函数
	 *      failure      : 请求失败的回调函数
	 *		url			 : 请求url
	 *      ........
	 * }
	 * 		params 中的参数将会覆盖urlParam中参数。 
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-19
	 */
    Protocol.request = function(urlParam, params) {
    	urlParam = getUrlParam(urlParam, params);
		var options = {};
		options = Protocol.getSpecificUrlParam(urlParam);
		
		//如果不是强制刷新，则先从缓存中取。
		if( !urlParam.forceRefresh){
			//缓存中存在，则直接获取缓存中的数据。
			var store = Protocol.Cache.getCache(options, "result");
			if( !$.isEmptyObject(store) ){
				if ( $.isFunction(options.success) ) {
					options.success.call(options.scope, options, store, "cache");
				}
				if ( $.isFunction(options.complete) ) {
					options.complete.call(options.scope, options, "cache"); 
				}
				return store;
			}
		}
		
		//成功之后首先执行的方法。
		options.afterSuccess = afterSuccess;
		
        var rqType = options.requestType;
		
		var sendRequest = typeRequest[rqType]["request"];
		//执行请求
		return sendRequest(options);
    },
        
     /**
	 * @Comments : 事件注册
	 * @param    : options ==> {
	 *      parameter    : 传递的参数
	 *      success      : 请求成功的回调函数
	 *      complete     : 请求完成后的回调函数
	 *      failure      : 请求失败的回调函数
	 *		url			 : 请求url
	 *      ........
	 * }
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-10-8
	 */
    Protocol.registerEvent = function(urlParam, params){
		urlParam = getUrlParam(urlParam, params);
		var options = {};
		options = Protocol.getSpecificUrlParam(urlParam);
		
    	var rqType = options.requestType;
		
		var registerEvent = typeRequest[rqType]["registerEvent"];
		registerEvent(options);
    }
    
    /**
	 * @Comments : 默认请求校验方法。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-18
	 */
	var defaultValidateOptions = function(options){
		
	};
	
	/**
	 * @Comments : 默认请求参数转换方法。
	 * @author   : liuhualuo@163.com
	 */
	var getDefaultOptions = function(options){
		return options;
	};
    
    //urlParam 转换.
    var getUrlParam = function(urlParam, params){
    	//如果urlParam为字符串，则将先转化成UrlParam对象。
    	if( typeof urlParam === "string"){
    		urlParam = URLParam.getUrlParam(urlParam);
    	}
		if( $.isEmptyObject(urlParam) ){
			return {};
		}
		if(params){
			urlParam = $.extend(true, {}, urlParam, params);
		}
		return urlParam;
    }
    
    /**
	 * @Comments : options选项必定有的参数。
		options ==> {
	 *      model		 : 模型对象。
	 *      storeTime    : 启用缓存有效时间。
	 *      success      : 加载成功的回调函数
	 *      forceRefresh : 是否强制刷新对象。
	 *      parameter    : 请求参数
	 * 		external	 : 客户端对象
	 *		url			 : 请求url
	 * @author   : liuhualuo@163.com
	 */
	var putOptions = function(opts, urlParam){
		opts.requestType = urlParam.requestType;
		opts.external = urlParam.external;
		opts.url = (typeof urlParam.url == "function") ? urlParam.url() : urlParam.url;
		opts.parameter = urlParam.parameter;
		opts.success = urlParam.success;
		opts.model = urlParam.model;
		opts.forceRefresh = urlParam.forceRefresh;
		opts.storeTime = urlParam.storeTime;
		return opts;
	}
	
	/**
	 * @Comments : 请求成功后第一个执行的方法。
	 * @param    : options ajax请求中的参数。
				   data为请求成功后返回的数据。
				   textStatus="success", "notmodified", "error", "timeout", "abort", or "parsererror"。
				   jqXHR=XMLHTTPRequest。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-18
	 */
	var afterSuccess = function(options, result, textStatus, jqXHR){
		//将返回数据封装成模型对象。
		if ( !$.isEmptyObject(options.model) ) {
			var modelArr = options.model.batData(result.data);
			result.data = {};
			result.modelValue = modelArr;
		}
		options.result = result;
		//开启缓存
		if( requestCache ){
			var store = Protocol.Cache.putCache(options, result);
		}
		
		return options;
	}
    
})();

