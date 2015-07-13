UserInfoParam = (function(){
	
	name = "user_info";//命名空间
	
	return {
		
		getName : function(){
			return name;
		},

		paramList : {
			defaultParam : {
				url : '',									
				parameter : {								
					expressId:'6001',
					pageNo:1
				},
				requestType : 'ajax',
				forceRefresh : false,					
				dataType : 'json',				
				type : 'GET',							
				result : {}
			}
		}
	}
})();

URLParam.addParamObj(UserInfoParam);

