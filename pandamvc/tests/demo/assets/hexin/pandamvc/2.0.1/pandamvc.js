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
})();
/**
 * @comment : uri配置规范实现类
 * @author   : liuhualuo@myhexin.com
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
		return Hexin.isObject(uriList[uri]);
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
	 * @author   : liuhualuo@myhexin.com
	 * @create   : 2012-7-23
	 */
	URI.getURIS = function(){
		return uriList;
	}
	
	URI.getURI = function(uri){
		return uriList[uri];
	}
	
	URI.addURI = function(uris){
		$.each(uris, function(key, value){
			parentValue = {};
			//如果有继承父类，获取父类继承。
			if( !$.isEmptyObject(value.extend) ){
				parentValue = uris[value.extend];
			}
			uriList[key] = $.extend(true, parentValue, value);
		});
	}
	//	}
	//})();
})(jQuery);
/**
 * @comment : 框架控制类
 * @author   : liuhualuo@myhexin.com
 * @create   : 2012-7-18
 */
(function($) {
	
	var pandamvc = function(){
		this.name = 'pandamvc';
		this.version = '2.0.1';
	};
	this.pandamvc = new pandamvc();
	pandamvc = this.pandamvc;
	
	window.logger = (typeof logger != "object") ? 
					{log:function(){}, error:function(){}} : logger;

	var mvc={}, tempCache = {};
	mvc = pandamvc;

	mvc.URI = URI;
	mvc.app = null;
	mvc.initApp = function(){
		var uriList = mvc.URI.getURIS();
		var sammyApp = $.sammy(function() {
			this.use(Sammy.Template, mvc.URI.getTemplateSuffix());
			var that = this;
			$.each(uriList, function(key, value){
				if( $.isEmptyObject(value.uri) && $.isEmptyObject(value.layout) ){
					return ;//实现continue功能
					//return false;//实现break功能
				}
				
				/*if (value.beginController || value.layoutTpl) {
                    //初始化 指定uri 的beginController方法
                    that.before(value.uri, function(context) {
						if(value.layoutTpl){
							//that.swap( require(value.layoutTpl) );
							//that.swap(value.layoutTpl);
						}
						if( value.beginController ){
							//var controller = require(value.beginController);
							controller = new controller({
								sammyApp: that,
								context: context,
								params: this.params
							});
							controller.server();
						}
                    });
                }*/

				value.method = value.method || "get";//默认请求方法为get
				that[value.method](value.uri, function(context) {
					var _self = this;
					var layout = value.layout;
					for( var i in layout ){
						var lItem = layout[i];
						if( !lItem.id ){
							//给每个controller 分配一个 id.
							lItem.id = getItemId();
						}
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
						/*	if(lItem.template){
								that.templateCache( lItem.template, require(lItem.template) );
							}*/

							var controller = lItem.controller;
							if( $.isEmptyObject(controller) ){
								controller = value.controller;
							}
							//获取 controller 对象  seajs 模式添加
							//controller = require(controller);
							controller = new lItem.controller({
								sammyApp : that,
								context	: context,
								params : _self.params,
								append : lItem.append,
								selector : lItem.selector,
								template : lItem.template
							});
							
							try{
								controller.server();
							}catch(e){
								//捕获控制器执行异常
								logger.error([e,lItem]);
							}
						}
						
						$(lItem.selector).attr("uuid", lItem.id);
						
						if(value.endController){
							//初始化 指定uri 的endController方法
							var endController = new value.endController();
							endController.server();
						}
					}
					//标记该uri 已经请求过
					value.request = true;
				});
			});
		});
		
		//所有URI请求执行前，执行该方法。
		if(mvc.URI.getBeforeController()){
			var beforeController = mvc.URI.getBeforeController();
			sammyApp.before(function(){
				var that = this;
				var controller = new beforeController({
								sammyApp : that,
								params : that.params
							});
				controller.server();
			});
		}
		
		//所有URI请求执行完后，执行该方法。
		if(mvc.URI.getAfterController()){
			var afterController = mvc.URI.getAfterController();
			sammyApp.after(function(){
				var that = this;
				var controller = new afterController({
								sammyApp : that,
								params : that.params
							});
				controller.server();
			});
		}
		
		this.app = sammyApp;
		
	}

	mvc.appRun = function(){
		if (!this.app) {
            this.initApp();
        }
		this.app.setLocation(mvc.URI.getHomeURI());
        this.app.run();

		//sammyApp.runRoute("get", mvc.URI.getHomeURI());
		//sammyApp.refresh();
		//this.get('#/item/:id'
		//this.get('#/item/:id', function(context) {
		//this.item = this.items[this.params['id']];
		
		//alert(mvc.URI.getHomeURI());
		//sammyApp.run(mvc.URI.getHomeURI());
		//sammyApp.runRoute("get", mvc.URI.getHomeURI(),{id:'tt'});
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
	
	window.mvc = mvc;
})(jQuery);
/**
 * @comment : 基础控制器类
 * @author   : liuhualuo@myhexin.com
 * @create   : 2012-7-18
 */
(function($) {
		
	var BaseController = Class.extend({

		sammyApp : null,
		context : null,
		params : null,
		append : null,
		selector : null,
		template : null,
		_data : null,
		requestCount : 0,

/*		initialize : function(config) {
			$.extend(this, config);     
		},*/
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
					urlParam.scope.complete(avg1, avg2, avg3, avg4, avg5);
					that.requestCount--;
					if( that.requestCount === 0 ){
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
			this.request();
			if( this.requestCount < 1 ){
				this.render();
			}
		},
		
		render : function(){
			if( this.template && this.selector ){
				//渲染模版
				if(this.append){
					this.context.render(this.template, this._data).appendTo(this.selector);
				}else{
					this.context.render(this.template, this._data).replace(this.selector);
				}
			}

			this.addEventListener();
		},
		
		destroy : function(){
			this.sammyApp = null;
			this.append = null;
			this.context = null;
			this.params = null;
			this.selector = null;
			this.template = null;
			this._data = null;
			this.requestCount = 0;
		}
	});
	
	window.BaseController = BaseController;
})(jQuery);