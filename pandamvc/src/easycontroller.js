/**
 * @comment : 基础控制器类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function($) {
		
	var EasyController = Class.extend({
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
			this.append = null;
			this.selector = null;
			this.template = null;
			this._data = null;
			this.requestCount = 0;
		}
	});
	
	window.EasyController = EasyController;
})(jQuery);