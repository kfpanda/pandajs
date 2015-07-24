/**
 * @comment : 简单的框架实现类
 * @author   : liuhualuo@163.com
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
    //所有模版缓存的内容
	mvc.template = "";

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
	
	mvc.URI = URI;
	var tempCache = {};
	
    var reg = new RegExp("([^&]*)=([^&]*)(&|$)", "g");
    var parseUri = function(uri){
        //var r = uri.match(reg)
        var param = {};
        while( (arr = reg.exec(uri)) != null){
            if(arr.length >2){
                param[arr[1]] = arr[2];
            }
        }
        return param;
    }

    /**
	 * @Comments : uri跳转
	 * @author   : liuhualuo@163.com
	 * @create   : 2015-7-23
	 */
    mvc.href = function(uri){
        if(uri && typeof uri == "string"){
            if(uri.indexOf("#") == 0){
                window.location.hash = uri;
            }else{
                window.location.href = uri;
            }
        }
    }

    /**
	 * @Comments : mvc 路由
	 * @author   : liuhualuo@163.com
	 * @create   : 2015-6-23
	 */
	mvc.routeRun = function(uri){
        
        var params = {};
        if(uri && typeof uri == "string"){
            //去除uri上的参数
            if(uri.indexOf("?") > -1){
                //解析url中的参数
                params = parseUri(uri.substring(uri.indexOf("?") + 1, uri.length));
                uri = uri.substring(0, uri.indexOf("?"));
            }
        }else{
            logger.error("uri is " + uri);
            return ;
        }
		
		var uriItem = mvc.URI.getURI(uri);
		if(typeof uriItem != "object"){
			//未找到匹配的uri路由
			logger.error(uri + " is not match route.");
			return ;
		}
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
			
			if( !mvc.URI.isRefresh(URI.getQueryString("refresh"))
				&& uriItem.request ){
                logger.log("render cache page.");
				//不刷新页面
				var tempHtml = tempCache[lItem.id];
				if(tempHtml && lItem.selector){
					$(lItem.selector).html(tempHtml);
				}
			}else{
				//预先将模版放入到sammy缓存中 seajs 模式添加
				
				var controller = lItem.controller;
				controller = new controller({
					params : params || {},
					append : lItem.append,
					selector : lItem.selector,
					template : lItem.template
				});
				
				try{
					controller.server();
				}catch(e){
                    controller.destroy();
                    controller = null;
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
	
	window.mvc = mvc;

    window.onhashchange = function(){
        mvc.routeRun(window.location.hash);
    }
})(jQuery);