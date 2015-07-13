/*! protocol - v2.0.1 - 2014-03-11 */AjaxProtocol=function(){var e=function(e){$.isEmptyObject(e.type)&&(e.type="GET"),$.isEmptyObject(e.dataType)&&(e.dataType="json"),$.isEmptyObject(e.async)&&(e.async=!0),$.isEmptyObject(e.cache)&&(e.cache=!1),$.isEmptyObject(e.timeout)&&(e.timeout=18e3),$.isEmptyObject(e.showErr)&&(e.showErr=!1)},t=function(e){var t={};return t.askType=e.askType,t.dataType=e.dataType,t.type=e.type,t.refreshTime=e.refreshTime,t.data=e.parameter,t.failure=e.failure,t.complete=e.complete,t.resultWrapper=e.resultWrapper,t.scope=e.scope,$.isFunction(t.resultWrapper)||(t.resultWrapper=function(e){return e}),t},a=function(e){var t=$.ajax({accepts:e.accepts,async:e.async,beforeSend:e.beforeSend,cache:e.cache,contents:e.contents,contentType:e.contentType,context:e.context,converters:e.converters,crossDomain:e.crossDomain,data:e.data,dataFilter:e.dataFilter,dataType:e.dataType,global:e.global,headers:e.headers,ifModified:e.ifModified,isLocal:e.isLocal,jsonp:e.jsonp,jsonpCallback:e.jsonpCallback,mimeType:e.mimeTyp,username:e.username,password:e.password,processData:e.processData,scriptCharset:e.scriptCharset,statusCode:e.statusCode,timeout:e.timeout,traditional:e.traditional,url:e.url,type:e.type,error:function(t,a,s){$.isFunction(e.failure)&&e.failure.call(e.scope,a,s)},success:function(t,a){$.isFunction(e.resultWrapper)&&(t=e.resultWrapper(t)),$.isFunction(e.afterSuccess)&&e.afterSuccess(e,t,a),$.isFunction(e.success)&&e.success.call(e.scope,e,t,a)},complete:function(t,a){$.isFunction(e.complete)&&e.complete.call(e.scope,e,a)}});return t},s=function(e){a(e),setTimeout(function(){s(e)},e.refreshTime||2e3)};Protocol.registerRequest("ajax",{type:"ajax",getOptions:t,validateOptions:e,request:a,registerEvent:s})}();