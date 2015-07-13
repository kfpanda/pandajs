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
		var defaultParam = objParams["defaultParam"];
		
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
