/*! protocol - v2.0.1 - 2014-03-11 */(function(){var e=function(){this.name="URLParam",this.version="2.0.1"};this.URLParam=new e,e=this.URLParam;var t={},r=function(e){var r=e.getName(),a=e.paramList,n=a.defaultParam,o=function(e){return a[e]};!$.isEmptyObject(e)&&$.isFunction(e.getSpecificParam)&&(o=e.getSpecificParam),$.each(a,function(e){var a={},c=o(e);c.extend&&(a=o(c.extend)),c=$.extend(!0,{},n,a,c),t[r+"."+e]=c})};e.addParamObj=function(e){r(e)},e.getUrlParam=function(e){var r=$.extend(!0,{},t[e]);return r}})(),function(){var e=function(){this.name="Protocol",this.version="2.0.1"};this.Protocol=new e,e=this.Protocol,window.logger="object"!=typeof logger?{log:function(){},error:function(){}}:logger,e.Cache=function(){return{SetUp:!1,putCache:function(){},getCache:function(){return null}}}();var t=e.Cache.SetUp,r={};e.registerRequest=function(e,t){r[e]=t},e.getSpecificUrlParam=function(t){var o={};t=$.extend(!0,{},e.defaultParam,t);var s=t.requestType,u=r[s].getOptions;o="function"==typeof u?u(t):n(t),o=c(o,t),o.urlParam=t;var i=r[s].validateOptions;return"function"==typeof i?i(o):a(o),o},e.request=function(t,a){t=o(t,a);var n={};if(n=e.getSpecificUrlParam(t),!t.forceRefresh){var c=e.Cache.getCache(n,"result");if(!$.isEmptyObject(c))return $.isFunction(n.success)&&n.success.call(n.scope,n,c,"cache"),$.isFunction(n.complete)&&n.complete.call(n.scope,n,"cache"),c}n.afterSuccess=s;var u=n.requestType,i=r[u].request;return i(n)},e.registerEvent=function(t,a){t=o(t,a);var n={};n=e.getSpecificUrlParam(t);var c=n.requestType,s=r[c].registerEvent;s(n)};var a=function(){},n=function(e){return e},o=function(e,t){return"string"==typeof e&&(e=URLParam.getUrlParam(e)),$.isEmptyObject(e)?{}:(t&&(e=$.extend(!0,{},e,t)),e)},c=function(e,t){return e.requestType=t.requestType,e.external=t.external,e.url="function"==typeof t.url?t.url():t.url,e.parameter=t.parameter,e.success=t.success,e.model=t.model,e.forceRefresh=t.forceRefresh,e.storeTime=t.storeTime,e},s=function(r,a){if(!$.isEmptyObject(r.model)){var n=r.model.batData(a.data);a.data={},a.modelValue=n}return r.result=a,t&&e.Cache.putCache(r,a),r}}();