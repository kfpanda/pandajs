SammyCache = (function() {
	
	var sammyStore = {
		type : 'memory',
		storeTime : 300000 // 5 * 60 * 1000 5分钟。
	};

	var createStore = function(options){
		var storeName = options.url + "?" + $.toJSON(options.paramter);
		var store = new Sammy.Store({name: storeName, type: sammyStore.type});
		return store;
	};

	//在放入store之前，检测一下全局store是否达到目标的容量，如果达到出发store清理事件。
	var setStore = function(options, result){
		var store = createStore(options);
		store.set('result', result);
		var time = options.storeTime;
		if( time == null ){
			//如果没有设定时间，则以默认的sammy配置的 storeTime时间。
			time = (new Date()).getTime() + sammyStore.storeTime;
		}
		store.set('dateTime', time);
		return store;
	};

	var getStore = function(options, key){
		var store = createStore(options);

		if( !store.exists('dateTime') ){
			return null;
		}
		var dateTime = store.get('dateTime');
		var time = (new Date()).getTime();
		if( time > dateTime ){
			//数据缓存已经超期，清除缓存。
			store.clearAll();
			return null;
		}
		return store.get(key);
	};


	SammyCache.putCache = function(urlParam, data){
		setStore(urlParam, data);
	}
	
	SammyCache.getCache = function(urlParam, key){
		return getStore(urlParam, key);
	}
	
	Protocol.Cache = SammyCache;
	
})();
