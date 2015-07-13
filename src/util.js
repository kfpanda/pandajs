/**
 * Util 为公共方法类
 * @file
 * @version 1.0.2
 * @copyright copyright
 * @author : liuhualuo@163.com
 */
(function(){

	/**
	 * Util 为公共方法类
	 * @name Util
	 * @class
	 * @property {string} this.name 
	 * @property {string} this.version
	 * @type object
	 * @author : liuhualuo@163.com
	 * @date : 2011-12-19
	 */
	var Util = function(){
		this.name = 'Util';
		this.version = '1.0.2';
	};
	this.Util = new Util();
	Util = this.Util;
	/**
	 * Util.emptyFn 空方法
	 * @class
	 * @name emptyFn
	 * @author : luhaining@163.com
	 * @date : 2013-05-22
	 */
	Util.emptyFn = function(){};
	
	Util.Browser = {
        browser: navigator.userAgent.toLowerCase(),
        version: (navigator.userAgent.toLowerCase().match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [ 0, "0" ])[1],
        safari: /webkit/i.test(navigator.userAgent.toLowerCase()) && !this.chrome,
        opera: /opera/i.test(navigator.userAgent.toLowerCase()),
        firefox: /firefox/i.test(navigator.userAgent.toLowerCase()),
        ie: /msie/i.test(navigator.userAgent.toLowerCase()) && !/opera/.test(navigator.userAgent.toLowerCase()),
        mozilla: /mozilla/i.test(navigator.userAgent.toLowerCase()) && !/(compatible|webkit)/.test(navigator.userAgent.toLowerCase()) && !this.chrome,
        chrome: /chrome/i.test(navigator.userAgent.toLowerCase()) && /webkit/i.test(navigator.userAgent.toLowerCase()) && /mozilla/i.test(navigator.userAgent.toLowerCase())
    };
        
	/**
	 * Util.Date 日期操作类
	 * @class
	 * @name Date
	 * @date : 2011-12-19
	 */
	Util.Date = {};
	/**
	 * 将日期格式转换为标准格式的字符串，例如"2013-05-06 10:13:27 616"
	 * @memberof Date
	 * @param date 日期，为null则默认为new Date();
	 * @author : liuhualuo@163.com
	 */
    Util.Date.getTime = function(date) {
        date = date ? date : new Date();
        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var S = date.getTime() % 1e3;
        var html = y + "-";
        if (M < 10) {
            html += "0";
        }
        html += M + "-";
        if (d < 10) {
            html += "0";
        }
        html += d + " ";
        if (h < 10) {
            html += "0";
        }
        html += h + ":";
        if (m < 10) {
            html += "0";
        }
        html += m + ":";
        if (s < 10) {
            html += "0";
        }
        html += s;
        html += " ";
        if (S < 100) {
            html += "0";
        }
        if (S < 10) {
            html += "0";
        }
        html += S;
        return html;
    };
    /**
	* 时间格式化工具
	* @memberof Date
	* @param date 日期
	* @param pattern 日期格式，例如yyyy-MM-dd，如果为null默认为 yyyy-MM-dd HH:mm:ss SSS格式
	* @author : luhaining@163.com
	*/
    Util.Date.format = function(date, pattern) {
        var formatSymbols = "yMdHmsS";
        if (pattern == null || pattern == undefined) {
            pattern = "yyyy-MM-dd HH:mm:ss SSS";
        }
        var time = Util.Date.getTime(date);
        // 标记存入数组
        var cs = formatSymbols.split("");
        // 格式存入数组
        var fs = pattern.split("");
        // 构造数组
        var ds = time.split("");
        // 标志年月日的结束下标
        var y = 3;
        var M = 6;
        var d = 9;
        var H = 12;
        var m = 15;
        var s = 18;
        var S = 22;
        // 逐位替换年月日时分秒和毫秒
        for (var i = fs.length - 1; i > -1; i--) {
            switch (fs[i]) {
              case cs[0]:
                fs[i] = ds[y--];
                break;

              case cs[1]:
                fs[i] = ds[M--];
                break;

              case cs[2]:
                fs[i] = ds[d--];
                break;

              case cs[3]:
                fs[i] = ds[H--];
                break;

              case cs[4]:
                fs[i] = ds[m--];
                break;

              case cs[5]:
                fs[i] = ds[s--];
                break;

              case cs[6]:
                fs[i] = ds[S--];
                break;
            }
        }
        return fs.join("");
    };
    /**
	* 时间格式解析工具
	* @memberof Date
	* @param date 日期
	* @param pattern 日期格式，例如yyyy-MM-dd，如果为null默认为 yyyy-MM-dd HH:mm:ss SSS格式
	* @author : luhaining@163.com
	*/
    Util.Date.parse = function(date, pattern) {
        var formatSymbols = "yMdHmsS";
        if (pattern == null || pattern == undefined) {
            pattern = "yyyy-MM-dd HH:mm:ss SSS";
        }
        var y = "";
        var M = "";
        var d = "";
        var H = "";
        var m = "";
        var s = "";
        var S = "";
        // 标记存入数组
        var cs = formatSymbols.split("");
        // 格式存入数组
        var ds = pattern.split("");
        // date   = "2005-08-22 12:12:12 888";
        // format = "yyyy-MM-dd HH:mm:ss SSS";
        // sign   = "yMdHmsS";
        var size = Math.min(ds.length, date.length);
        for (var i = 0; i < size; i++) {
            switch (ds[i]) {
              case cs[0]:
                y += date.charAt(i);
                break;
              case cs[1]:
                M += date.charAt(i);
                break;
              case cs[2]:
                d += date.charAt(i);
                break;
              case cs[3]:
                H += date.charAt(i);
                break;
              case cs[4]:
                m += date.charAt(i);
                break;
              case cs[5]:
                s += date.charAt(i);
                break;
              case cs[6]:
                S += date.charAt(i);
                break;
            }
        }
        if (y.length < 1) y = 0; else y = parseInt(y);
        if (M.length < 1) M = 0; else M = parseInt(M);
        if (d.length < 1) d = 0; else d = parseInt(d);
        if (H.length < 1) H = 0; else H = parseInt(H);
        if (m.length < 1) m = 0; else m = parseInt(m);
        if (s.length < 1) s = 0; else s = parseInt(s);
        if (S.length < 1) S = 0; else S = parseInt(S);
        var d = new Date(y, M - 1, d, H, m, s, S);
        return d;
    };

	/**
	 * Util.Decoder 编码格式转换类
	 * @class
	 * @name Decoder
	 * @author : liuhualuo@163.com
	 * @date : 2011-12-19
	 */
	Util.Decoder = (function() {
		/** @lends Decoder */
		return{
			/**
			 * native 转 ascii。
			 * @type function
			 * @param strNative 要转换的native。
			 * @author : liuhualuo@163.com
			 * @date : 2011-12-19
			 */
			native2ascii: function(strNative) {
				var output = "";
				for (var i = 0; i < strNative.length; i++) {
					var c = strNative.charAt(i);
					var cc = strNative.charCodeAt(i);
					if (cc > 255) output += "\\u" + this.toHex(cc >> 8) + this.toHex(cc & 255); else output += c;
				}
				return output;
			},
			/**
			 * native 转 hex
			 * @type function
			 * @param n 要转换的native。
			 * @author : liuhualuo@163.com
			 * @date : 2011-12-19
			 */
			toHex: function(n) {
				var hexChars = "0123456789ABCDEF";
				var nH = n >> 4 & 15;
				var nL = n & 15;
				return hexChars.charAt(nH) + hexChars.charAt(nL);
			},
			/**
			 * ascii 转 native
			 * @type function
			 * @param strAscii 要转换的ascii字符串。
			 * @author : liuhualuo@163.com
			 * @date : 2011-12-19
			 */
			ascii2native: function(strAscii) {
				var output = "";
				var posFrom = 0;
				var posTo = strAscii.indexOf("\\u", posFrom);
				while (posTo >= 0) {
					output += strAscii.substring(posFrom, posTo);
					output += this.toChar(strAscii.substr(posTo, 6));
					posFrom = posTo + 6;
					posTo = strAscii.indexOf("\\u", posFrom);
				}
				output += strAscii.substr(posFrom);
				return output;
			},
			/**
			 * 转换为字节。
			 * @type function
			 * @param str 要转换的字符串。
			 * @author : liuhualuo@163.com
			 * @date : 2011-12-19
			 */
			toChar: function(str) {
				if (str.substr(0, 2) != "\\u") return str;
				var code = 0;
				for (var i = 2; i < str.length; i++) {
					var cc = str.charCodeAt(i);
					if (cc >= 48 && cc <= 57) cc = cc - 48; else if (cc >= 65 && cc <= 90) cc = cc - 65 + 10; else if (cc >= 97 && cc <= 122) cc = cc - 97 + 10;
					code <<= 4;
					code += cc;
				}
				if (code < 255) return str;
				return String.fromCharCode(code);
			}
		};
	})();
	
	/**
	 * 中断进程 一段时间。
	 * @param numberMillis 时间毫秒数。
	 * @memberof Util
	 * @type function
	 * @author liuhualuo@163.com
	 * @date 2012-11-28
	 */
	Util.sleep = function(numberMillis) {
		var now = new Date();
		var exitTime = now.getTime() + numberMillis;
		while (true) {
			now = new Date();
			if (now.getTime() > exitTime) return;
		}
	}

	/**
	 * 封装装载XML的方法,并返回XML文档的根元素节点。
	 * @param isPath true时参数xml表示xml文档的名称；false时参数xml是一个字符串，其内容是一个xml文档
	 * @param xml 根据isPath参数的不同表示xml文档的名称或一个xml文档的字符串表示
	 * @type function
	 * @memberof Util
	 * @author : liuhualuo@163.com
	 * @date : 2012-11-28
	 */
	Util.loadXML = function(xml, isPath) {
		var xmlDoc;
		//针对IE浏览器
		if (window.ActiveXObject) {
			var aVersions = [ "MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom" ];
			for (var i = 0; i < aVersions.length; i++) {
				try {
					//建立xml对象
					xmlDoc = new ActiveXObject(aVersions[i]);
					break;
				} catch (oError) {}
			}
			if (xmlDoc != null) {
				//同步方式加载XML数据
				xmlDoc.async = false;
				//根据XML文档名称装载
				if (isPath === true) {
					xmlDoc.load(xml);
				} else {
					//根据表示XML文档的字符串装载
					xmlDoc.loadXML(xml);
				}
				//返回XML文档的根元素节点。
				return xmlDoc;
			}
		} else {
			//针对非IE浏览器
			if (document.implementation && document.implementation.createDocument) {
				/*
			 第一个参数表示XML文档使用的namespace的URL地址
			 第二个参数表示要被建立的XML文档的根节点名称
			 第三个参数是一个DOCTYPE类型对象，表示的是要建立的XML文档中DOCTYPE部分的定义，通常我们直接使用null
			 这里我们要装载一个已有的XML文档，所以首先建立一个空文档，因此使用下面的方式
			 */
				xmlDoc = document.implementation.createDocument("", "", null);
				if (xmlDoc != null) {
					//根据XML文档名称装载
					if (isPath === true) {
						//同步方式加载XML数据
						xmlDoc.async = false;
						xmlDoc.load(xml);
					} else {
						//根据表示XML文档的字符串装载
						var oParser = new DOMParser();
						xmlDoc = oParser.parseFromString(xml, "text/xml");
					}
					//返回XML文档的根元素节点。
					return xmlDoc;
				}
			}
		}
		return null;
	}
	/**
	 * 将字符串的首字母转换为大写。
	 * @param v 传入的字符串
	 * @memberof Util
	 * @author : liuhualuo@163.com
	 */
	Util.changeFirstCase = function(v) {
		v = String(v);
		return v.substring(0, 1).toUpperCase() + v.substring(1);
	}
	/**
	 * 将字节数据转换为带单位的格式。例如：10240 -> 10Kb
	 * @param bytes 传入字节整数，必须为number类型。
	 * @return 返回带单位格式字符串，如果bytes为非number类型，则返回为""
	 * @memberof Util
	 * @author : liuhualuo@163.com
	 */
	Util.bytesSize = function( bytes ) {
    	if( typeof bytes != "number" ){
			return "";
		}
		var i = 0;
		while(1023 < bytes){
		    bytes /= 1024;
		    ++i;
		};
		return  i ? bytes.toFixed(2) + ["", " Kb", " Mb", " Gb", " Tb"][i] : bytes.toFixed(2) + " bytes";
	};
	/**
	 * Util.Loop 循环执行类
	 * @class
	 * @memberof Util
	 * @author luhaining@163.com
	 * @date 2013-05-22
	 */
	Util.Loop = (function(){
		/** 
		 * 循环执行
		 * @lends Loop
		 */
		var _loop =  function( opt ){
			setTimeout(function(){
				if(opt.bool()){
					try{
						opt.fn.call(opt.scope);
						opt.success.call(opt.scope, opt);
					}catch(e){
						opt.fail.call(opt.scope, opt);
					}finally{
						opt = null;
						delete opt;
					}
				}else if(opt.tally >= opt.times){
					opt.timeout.call(opt.scope, opt);
					opt = null;
					delete opt;
				}else{
					opt.tally++;
					_loop(opt);
				}
			}, opt.interval);
		}
    	
		return {
			/**
			 * 循环执行（对外加工方法）
			 * @type function
			 * @param opt -> [key: 默认值]
			 *		{
			 *			bool: function(){ return true; };	// 执行条件
			 *			fn: Util.emptyFn;					// 执行方法
			 *			tally: 0;							// 初始化执行次数
			 *			times: Infinity;					// 执行次数上限
			 *			interval: 100;						// 执行间隔
			 *			scope: opt;							// 作用域
			 *			success: Util.emptyFn;				// 成功方法
			 *			fail: Util.emptyFn;					// 失败方法
			 *			timeout: Util.emptyFn;				// 超时方法
			 *		}
			 * @author luhaining@163.com
			 * @date 2013-05-22
			 */
			loop: function(opt){
				opt.tally = 0; // 初始化执行次数（计数器）
				opt.bool = opt.bool || function(){ return true; }; // 执行条件
				opt.fn = opt.fn || Util.emptyFn; // 执行方法
				opt.times = opt.times || Infinity; // 执行次数上限
				opt.interval = opt.interval || 100; // 执行间隔
				opt.scope = opt.scope || opt; // 作用域
				opt.success = opt.success || Util.emptyFn; // 成功方法
				opt.fail = opt.fail || Util.emptyFn; // 失败方法
				opt.timeout = opt.timeout || Util.emptyFn; // 超时方法
				_loop(opt);
			}
		}
	})();
	
})();