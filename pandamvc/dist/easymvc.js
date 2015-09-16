// create by John Resig(Jquery 创始人)
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();;/**
 * @comment : uri配置规范实现类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function($) {
	
	var URI = function(){
		this.name = 'URI';
		this.version = '2.0.1';
	};
	this.URI = new URI();
	URI = this.URI;
	
	var homeURI = '#/home';
	var templateSuffix = "tpl";
	var uriList = {};
	
	//this.URI = (function(){

	//	return {
	/**
	 * uriList是否包含uri路径
	 * @params {Sting} "#/im/home"
	 */
	URI.hasURI = function(str) {
		if(typeof str != 'string' ||  str.length == 0){
			return false;
		}
		var uri = '';
		try{
			uri = str.substr(2).replace('/', '_') + '_uri'; // #/im/home -> im_home_uri
		}catch(e){}
		if( typeof uriList[uri] == "object" ){
			return true;
		}
		return false;
	}
	
	URI.setHomeURI = function(uri) {
		if(this.hasURI(uri)){
			uriList.context.homeURI = uri;
		}
	}
	
	URI.getHomeURI = function(){
		var context = uriList.context || {};
		return context.homeURI || homeURI;
	}
	
	URI.getTemplateSuffix = function(){
		var context = uriList.context || {};
		return context.templateSuffix || templateSuffix;
	}
	
	//获取BeforeController
	URI.getBeforeController = function(){
		var context = uriList.context || {};
		return context.before_controller;
	}
	
	//获取afterController
	URI.getAfterController = function(){
		var context = uriList.context || {};
		return context.after_controller;
	}
	//获取url的参数
	URI.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null){
			return unescape(r[2]);
		}
		return null;
	}
	
	URI.isRefresh = function(refreshFlag){
		var context = uriList.context || {};
		if( context.refresh && context.refreshFlag != refreshFlag ){
			return true;//刷新
		}
		return false;//不刷新
	}
	
	/**
	 * @Comments : 获得特定的请求参数。
	 * @param    :  paramName 为参数名, paramType为ParamType对象中属性。
	 * @author   : liuhualuo@163.com
	 * @create   : 2012-7-23
	 */
	URI.getURIS = function(){
		return uriList;
	}
	
	URI.getURI = function(uri){
		if(uri && uri != ""){
			return uriList[uri];
		}else{
			return URI.getLocationURI();
		}
	}
	/**
	 * @Comments : 通过地址栏uri，获取对应的item。
	 * @author   : liuhualuo@163.com
	 * @create   : 2015-7-14
	 */
	URI.getLocationURI = function(){
		//url中#后面的一段参数
		var hash = window.location.hash;
		if(hash && hash != ""){
			return uriList[hash];
		}
		//window.location.pathname 为url 不带?的url
		return uriList[window.location.pathname];
	}
	
	URI.addURI = function(uris){
		$.each(uris, function(key, value){
			parentValue = {};
			//如果有继承父类，获取父类继承。
			if( !$.isEmptyObject(value.extend) ){
				parentValue = uris[value.extend];
			}
			if(key == "context"){
				uriList[key] = $.extend(true, parentValue, value);
			}else{
				uriList[value.uri] = $.extend(true, parentValue, value);
			}
		});
	}
	//	}
	//})();
})(jQuery);;/**
 * @comment : 基础控制器类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function($) {
	
    window.logger = (typeof logger != "object") ? 
					{log:function(){}, error:function(){}} : logger;

	var EasyController = Class.extend({
        params : null,
		append : null,
		selector : null,
		template : null,
		_data : null,
		requestCount : 0,

		init : function(config) {
	        $.extend(this, config);
	        //this.addEventListener();
	    },
		request : function(){
			
		},

		addEventListener : function(){

		},

		sendRequest : function(urlParam, params){
			//如果urlParam为字符串，则将先转化成UrlParam对象。
			if($.type(urlParam) === "string"){
				urlParam = URLParam.getUrlParam(urlParam);
			}
			if( $.isEmptyObject(urlParam) ){
				//请求未发出
				return {};
			}
			if(params){
				urlParam = $.extend(true, {}, urlParam, params);
			}
			var that = this;
			var succFuc = urlParam.success;
			if( $.isFunction(urlParam.complete) ){
				that.requestCount++;
				urlParam.complete = function(avg1, avg2, avg3, avg4, avg5){
					urlParam.scope.complete(avg1, avg2, avg3, avg4, avg5);//调用的是对象的complete方法
					that.requestCount--;
					if( that.requestCount === 0 ){//只有请求都完成了再调用render渲染模板
						that.render();
					}
				}
			}else{
				if( $.isFunction(urlParam.success) ){
					that.requestCount++;
					urlParam.success = function(options, result, textStatus, avg4, avg5){
						succFuc.call(options.scope, options, result, textStatus, avg4, avg5);
						that.requestCount--;
						if( that.requestCount === 0 ){
							that.render();
						}
					}
				}
			}
			return Protocol.request(urlParam);
		},
		
		server : function(){
			this.request();//先执行request
			if( this.requestCount < 1 ){
				this.render();//不一定渲染成功
			}
		},
		
		render : function(){
			var that = this;
			if( this.template && this.selector ){
				//渲染模版
                var tmpl = $(mvc.template).find("#" + this.template).text();
				if(this.append){
					$(this.selector).append(mvc.Tmpl(tmpl, this._data));
				}else{
					$(this.selector).html(mvc.Tmpl(tmpl, this._data));
				}
			}

			this.addEventListener();
		},
		afterRender:function(){

		},
		destroy : function(){
            this.params = null;
			this.append = null;
			this.selector = null;
			this.template = null;
			this._data = null;
			this.requestCount = 0;
		}
	});
	
	window.EasyController = EasyController;
})(jQuery);;/**
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
     * @param uri 跳转uri
     * @param refresh 不传默认为刷新页面.
	 * @author   : liuhualuo@163.com
	 * @create   : 2015-7-23
	 */
    mvc.href = function(uri, refresh){
        if(uri && typeof uri == "string"){
            if(!refresh){
                //增加时间戳
                var t = new Date().getTime();
                uri = uri.indexOf("?") > -1 ? uri + "&t=" + t 
                    : uri + "?t=" + t;
            }
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