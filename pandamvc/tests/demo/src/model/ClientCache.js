ClientCache = Base.extend({
	
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @comment : 不管原先Cache里是否已存在相同的Key 都设置成value
	 * @param : key为键  value为要缓存的值，类型必须为 string。
	 * @return : 添加是否成功。
	 */
	setValue : function(key, value) {
		return Protocol.request("im_client.cache_setValue", {
			"parameter" : [key, value]
		});
	},
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @comment : 往Cache里增加一个值, 如果对应的Key已经存在过，那么不做处理。
	 * @param : key为键 
	 * @param : value值
	 * @return : 添加是否成功。
	 */
	addValue : function(key, value){
		return Protocol.request("im_client.cache_addValue", {
			"parameter" : [key, value]
		});
	},
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @param : key为键  .
	 * @comment : 从缓存Cache中获取key的值。
	 * @return : 获取到的值
	 */
	getValue : function(key) {
		return Protocol.request("im_client.cache_getValue", {
			"parameter" : key
		});
	},
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @param : key为键  .
	 * @comment : 从缓存Cache中删除key的值。
	 * @return : 删除是否成功。
	 */
	delValue : function(key){
		return Protocol.request("im_client.cache_delValue", {
			"parameter" : key
		});
	},
	
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @comment : 往Cache里增加一个函数。
	 * @param : name，和 对应的func.
	 * @return : 是否 添加 成功。
	 */
	addFunc : function(name, func){
		return Protocol.request("im_client.cache_addFunc", {
			"parameter" : {
				"name" : name,
				"func" : func
			}
		});
	},
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @comment : 往Cache里增加一个函数。
	 * @param : name，方法的名称.
	 * @param : params 方法的参数。
	 * @return : 是否 调用 成功。
	 */
	callFunc : function(name, params){
		return Protocol.request("im_client.cache_callFunc", {
			"parameter" : {
				"name" : name,
				"param" : params
			}
		});
	},
	/**
	 * @date : 2012-10-10
	 * @author : liuhualuo@myhexin.com
	 * @comment : 从Cache里删除一个函数。
	 * @param : name，方法的名称
	 * @return 是否删除成功
	 */
	delFunc : function(name){
		return Protocol.request("im_client.cache_delFunc", {
			"parameter" : {
				"name" : name
			}
		});
	}
});
window.ClientCache = new ClientCache();
