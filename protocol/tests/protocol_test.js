define(function(require) {
	//让jquery 支持跨域请求
	$.support.cors = true;
	var ajaxParam = {
			
		getName : function(){
			return "ajax";
		},
		
		paramList : {
			defaultParam : {
				url : '',									//ajax请求的url。
				requestType : "ajax",	//默认请求方式，请求类型(HexinExeType:调用客户端程序, HexinRequestType:调用长连接, NormalRequestType:调用短连接)
				forceRefresh : false,						//是否强制刷新,
				dataType : 'json',						//(HexinRequestType、NormalRequestType)数据类型(默认json)
				type : 'GET'								//GET,POST请求 dataType : 'string',
			},
	
			leaveMessageRs	: {
				url	: 'data/ajax.json',
				parameter : {
					vimid : '', //请求客服类型
					reimid : ''
				}
			}
		}
	}
	
	var URLParam = require('urlparam');
    var protocol = require('protocol');
    require("ajaxprotocol");

    describe('protocol', function() {
    	URLParam.addParamObj(ajaxParam);
    	
		it('URLParam.addParamObj usage', function() {
        	var param = URLParam.getUrlParam("ajax.leaveMessageRs");
        	expect(param).to.eql({
				url	: 'data/ajax.json',
				requestType : "ajax",
				forceRefresh : false,
				dataType : 'json',
				type : 'GET',
				parameter : {
					vimid : '',
					reimid : ''
				}
			});
        });
        
        it('protocol.request usage', function() {
        	var param = URLParam.getUrlParam("ajax.leaveMessageRs");
        	protocol.request(param, {success:function(options, result, textStatus){
        		expect(result).to.eql({
        			"data" : "data",
					"msg" : "OK"
        		});
        	}});
        });
    });

});

