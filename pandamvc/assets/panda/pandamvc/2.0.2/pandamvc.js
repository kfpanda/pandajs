/**
 * @comment : 框架控制类
 * @author   : liuhualuo@163.com
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

			//所有URI请求执行前，执行该方法。
			if(mvc.URI.getBeforeController()){
				var beforeController = mvc.URI.getBeforeController();//返回一个名字
				that.before(function(){
					var that = this;
					var controller = new beforeController({
									sammyApp : that,
									params : that.params
								});
					return controller.server();
				});
			}
			
			//所有URI请求执行完后，执行该方法。
			if(mvc.URI.getAfterController()){
				var afterController = mvc.URI.getAfterController();
				that.after(function(){
					var that = this;
					var controller = new afterController({
									sammyApp : that,
									params : that.params
								});
					return controller.server();
				});
			}


			$.each(uriList, function(key, value){
				if( $.isEmptyObject(value.uri) && $.isEmptyObject(value.layout) ){
					return ;//实现continue功能
					//return false;//实现break功能
				}
				
				if (value.beginController || value.layoutTpl) {
                    //初始化 指定uri 的beginController方法
                    that.before(value.uri, function(context) {
						if(value.layoutTpl){
							//that.swap( require(value.layoutTpl) );
							that.swap(value.layoutTpl);
						}
						if( value.beginController ){
							//var controller = require(value.beginController);
							var controller = value.beginController;
							controller = new controller({
								sammyApp: that,
								context: context,
								params: this.params
							});
							return controller.server();
						}
                    });
                }				

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
		
		this.app = sammyApp;
		
	}

	mvc.appRun = function(){
		if (!this.app) {
            this.initApp();
        }
		this.app.setLocation(mvc.URI.getHomeURI());

        this.app.run();
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