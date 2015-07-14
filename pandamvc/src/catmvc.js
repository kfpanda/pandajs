/**
 * @comment : 简单的框架实现类
 * @author   : liuhualuo@myhexin.com
 * @create   : 2012-7-18
 */
(function(){
	
	window.logger = (typeof logger != "object") ? 
					{log:function(){}, error:function(){}} : logger;
	
	var mvc = function(){
		this.name = 'mvc';
		this.version = '1.0.2';
	};
	this.mvc = new mvc();
	mvc = this.mvc;
	
	var Clone = function(object) {
        var clone = {};
        var cloneOf = function(item) {
            switch ( typeof item ) {
              case "array":
                return Clone(item);

              case "object":
                return Clone(item);

              default:
                return item;
            }
        };
        for (var key in object) clone[key] = cloneOf(object[key]);
        return clone;
    };
	
	mvc.URI = (function(){
		
		var homeURI = '#/home';
		var templateSuffix = "tpl";
		var uriList = {};
		
		var hasURI = function(str){
			return (typeof uriList[str] == "object");
		}
		
		return {
			/**
			 * uriList是否包含uri路径
			 * @params {Sting} "#/im/home"
			 */
			hasURI: function(str) {
	            return hasURI(str);
	        },
			
			setHomeURI: function(uri) {
				if( hasURI(str) ){
					uriList.context.homeURI = uri;
				}else{
					logger.error("mvc.setHomeURI error: mvc.context not exist uri(" + uri + ")");
				}
	        },
			
			getHomeURI : function(){
				var context = uriList.context || {};
				return context.homeURI || homeURI;
			},
			
			getTemplateSuffix : function(){
				var context = uriList.context || {};
				return context.templateSuffix || templateSuffix;
			},
			
			//获取BeforeController
			getBeforeController : function(){
				var context = uriList.context || {};
				return context.before_controller;
			},
			
			//获取afterController
			getAfterController : function(){
				var context = uriList.context || {};
				return context.after_controller;
			},
			
			isRefresh : function(refreshFlag){
				var context = uriList.context || {};
				if( context.refresh && context.refreshFlag != refreshFlag ){
					return true;//刷新
				}
				return false;//不刷新
			},
			
			/**
			 * @Comments : 获得特定的请求参数。
			 * @param    :  paramName 为参数名, paramType为ParamType对象中属性。
			 * @author   : liuhualuo@myhexin.com
			 * @create   : 2012-7-23
			 */
			getURIS : function(){
				return uriList;
			},
			
			getURI : function(uri){
				return uriList[uri];
			},
			
			addURI : function(uris){
				for( key in uris ){
					var value = uris[key];
					parentValue = {};
					//如果有继承父类，获取父类继承。
					if( typeof value.extend == "object" && value.extend != null ){
						parentValue = uris[value.extend];
					}
					uriList[key] = $.extend(true, {}, parentValue, value);
				}
			}
		}
	});
	
	var tempCache = {};
	
	mvc.routeRun = function(uri){
		
		var uriItem = mvc.URI.getURI(uri);
		var _self = this;
		
		var layout = uriItem.layout;
		for( var i in layout ){
			var lItem = layout[i];
			lItem.id = lItem.id || getItemId();
			
			//保存上次请求的div的页面模版。
			var uuid = $(lItem.selector).attr("uuid");
			if(uuid){
				tempCache[uuid] = $(lItem.selector).html();
			}
			
			if( !mvc.URI.isRefresh(_self.params["refresh"])
				&& value.request ){
				//不刷新页面
				var tempHtml = tempCache[lItem.id];
				if(tempHtml && lItem.selector){
					$(lItem.selector).html(tempHtml);
				}
			}else{
				//预先将模版放入到sammy缓存中 seajs 模式添加
				
				var controller = lItem.controller;
				controller = new controller({
					// context	: context,
					// params : _self.params,
					append : lItem.append,
					selector : lItem.selector,
					template : lItem.template
				});
				
				try{
					controller.server();
				}catch(e){
					logger.error([e, lItem]);
				}
			}
			
			$(lItem.selector).attr("uuid", lItem.id);
			
		}
		//标记该uri 已经请求过
		uriItem.request = true;
	}
	
	var idArr = ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", 
				"b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", 
				"c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", 
				"d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", 
				"e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", 
				"f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9",
				"g0", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9",
				"h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9"];
	
	var getItemId = function(){
		return idArr.pop();
	}
	
	var cache = {};
	mvc.Tmpl = function tmpl(str, data) {
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ? cache[str] = cache[str] || mvc.Tmpl(document.getElementById(str).innerHTML) :

		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +

		// Introduce the data as local variables using with(){}
		"with(obj){p.push('" +

		// Convert the template into pure JavaScript
		str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};

})();