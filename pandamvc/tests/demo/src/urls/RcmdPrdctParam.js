RcmdPrdctParam = (function(){
	name = "rcmd_prdct";
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
				},
				//配置请求参数
				RcmdPrdctList : {
					url	: 'http://222.74.204.45:9091/csp-info/rs/product/getFundList',		//url地址
					parameter : {					//url上传入的参数
						forumids : '226',
						pageSize : 5,
						starttime : '20100101'
					},
					//model : InfoModel,
					modelValue : []
				}
			}
	}

})();

URLParam.addParamObj(RcmdPrdctParam);