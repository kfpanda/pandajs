/**
 * @Comments : webservice soap请求协议。
 * @author   : liuhualuo@163.com
 * @create   : 2013-2-19
 */
WSProtocol = (function() {
	
	var getLen = function(str){
		var bCount=0;
		if( str ){
			bCount = str.length + str.replace(/[\u0000-\u00ff]/g, "").length;
		}
		return bCount;
	}
	
	var _xmlHttp = null;

	var createXmlHttp = function(){
		var xmlHttp = null;
		if( window.XMLHttpRequest ){ //如果浏览器直接支持window.XMLHttpRequest对象
			xmlHttp = new XMLHttpRequest();
			if (xmlHttp.overrideMimeType){
				xmlHttp.overrideMimeType('text/xml');
			}//防止有些版本的Mozilla
		}else if( window.ActiveXObject ){
			//如果浏览器支持window.ActiveXObject对象
			try{
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){}
			}
		}else{
			return null; //浏览器啥都不支持，我也只有啥都不干了:p
		}
		if( !xmlHttp ){
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return null;
		}
		return xmlHttp;
	}

	var WSValidateOptions = function(options){
		
	};
	
	/**
	 * @Comments : 请求参数转换。
	 * @param    : urlParam
	 * @author   : liuhualuo@163.com
	 * @create   : 2013-2-19
	 */
	var getWSOptions = function(urlParam){
		var opts = {};
		
		opts.targetNSpace = urlParam.targetNSpace;
		opts.url = urlParam.url;
		opts.method = urlParam.method;
		opts.failure = urlParam.failure;
		opts.complete = urlParam.complete;
		opts.type = urlParam.type;
		opts.resultWrapper = urlParam.resultWrapper;
		opts.dataType = urlParam.dataType;
		opts.scope = urlParam.scope;
		
		if( !$.isFunction(opts.resultWrapper) ){
			opts.resultWrapper = resultWrapper;
		}
		return opts;
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
		//result 数据结构 result={ Body:{ "%method%Response":{ return:["","",""] } } }
		data.data = ((result["soap:Body"] || {})[ "ns2:" + (result.method || "") + "Response" ] || {})["return"];
		return data;
	};
	

	var WSRequest = function(options){
		if( !_xmlHttp ){
			_xmlHttp = createXmlHttp();
		}
		var data;
		data = '<?xml version="1.0" encoding="utf-8"?>';
		data += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
		data += ' xmlns:xsd="http://www.w3.org/2001/XMLSchema" '
		data += ' xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
		data += '<soap:Body>';
		//data += '<'+method+' xmlns="'+targetNamespace+'" >';
		data += '<' + options.method + '>';
		for( var key in options.parameter ){
			data += '<' + key + '>' + options.parameter[key] + '</' + key + '>';
		}
		data += '</' + options.method + '>';
		data += '</soap:Body>';
		data += '</soap:Envelope>';

		//alert(data);
		_xmlHttp.open( options.type || "POST", options.url, true ); //若通过get方式传输只须将post改为get
		//处理结果数据方法
		_xmlHttp.onreadystatechange = function(){
			var result = {};
			if(_xmlHttp.readyState == 4){
				if(_xmlHttp.status == 200) {
					//HTTP状态码，未出错。可参考.statusText
					//alert(_xmlHttp.responseXML);
					//document.getElementById('xmlObj')的.firstChild.data也可换成.innerHTML
					//alert(_xmlHttp.responseText);
					var xmlData = _xmlHttp.responseText;

					try{
						result = $.xml2json(xmlData);
						
						//结果数据处理
						result.method = options.method;
						if( $.isFunction(options.resultWrapper) ){
							result = options.resultWrapper(result);
						}
						result.status = "success";
					}catch(e){
						result.status = "error";
						result.msg = "xml parse error.";
					}
				} else {
					result.status = "error";
					result.msg = "There was a problem with the request.";
				}
			}
			
			var textStatus = result.status || "error";
			if( textStatus === "success" ){
				if( $.isFunction(options.afterSuccess) ){
					options.afterSuccess(options, result, textStatus);
				}
				if( $.isFunction(options.success) ) {
					options.success.call(options.scope, options, result, textStatus); 
				}
			}else if(_xmlHttp.readyState == 4){
				var failure = function(result, textStatus){
				}
				textStatus = "error";
				failure(result, textStatus);
			}
			if ( $.isFunction(options.complete) ) {
				options.complete.call(options.scope, options, textStatus, _xmlHttp);
			}
		}

		_xmlHttp.setRequestHeader ("Content-Type","text/xml; charset=utf-8");
		//_xmlHttp.setRequestHeader ("Content-Length",getlen(data));
		_xmlHttp.setRequestHeader ("SOAPAction",options.targetNSpace + options.method);
		_xmlHttp.send(data);
	}
	
	Protocol.registerRequest("WS", {
		type : "IMClient",
		getOptions : getWSOptions,
		validateOptions : WSValidateOptions,
		request : WSRequest
		//registerEvent : registerEvent
	});
	
})();