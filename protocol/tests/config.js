/*! jrzd - v1.0.0 - 2013-03-12
* http://jrzd.com
* Copyright (c) 2013 liuhualuo@myhexin.com; Licensed MIT */
seajs.config({
	// 加载 shim 插件
	plugins: [],//'text', 'shim', 'warning', 'debug'],//, 'nocache'
	// 变量配置
	//vars: {
	//	'lhl': 'name',
	//},
	alias: {
		/*'jquery': {
			src: 'jquery/jquery/1.9.1/jquery',
			exports: "jQuery"
		},
		'jquery-json': {
			src: 'jquery/plugins/jquery.json-2.3',
			deps: ['jquery']
		},*/
		"logger": "log/logg.js",
		"class": "arale/class/1.0.0/class",
		'jquery': 'jquery/jquery/1.9.1/jquery-debug',
		'jquery-json': 'jquery/plugins/jquery.json-2.3',
		"jquery-xml2json": "jquery/plugins/jquery.xml2json",
		"jquery-cookie": "jquery/plugins/jquery.cookie",
		"jquery-easyui": "jquery/plugins/jquery.easyui",
		"jquery-uploadify": "jquery/plugins/jquery.uploadify",
		"hexin": "hexin/hexin/1.0.2/hexin-debug",
		"util": "hexin/hexin/1.0.2/util-debug",
		"pandamvc": "hexin/pandamvc/1.0.2/pandamvc-debug",
		"protocol": "hexin/protocol/1.0.2/protocol-debug",
		"basecontroller": "hexin/pandamvc/1.0.2/basecontroller-debug",

		"protocol": "hexin/protocol/1.0.2/protocol",
		"urlparam": "hexin/protocol/1.0.2/urlparam",
		"ajaxprotocol": "hexin/protocol/1.0.2/plugins/ajaxprotocol",
		"clientprotocol": "hexin/protocol/1.0.2/plugins/clientprotocol",
		"wsprotocol": "hexin/protocol/1.0.2/plugins/wsprotocol",
        "imclientprotocol": "hexin/protocol/1.0.2/plugins/imclientprotocol"
	},
	// 映射配置
	/*map: [
		['-debug.js', '-debug.js'],
		['.js', '-debug.js'],
		function(uri){
			// 结尾 不是.js,则 增加-debug.js
			if( !uri.match("\.js$") ){
			    return uri + "-debug.js";
			}
		}
	],*/
	
	// 设置路径，方便跨目录调用
	paths: {
		//'arale': 'https://a.alipayobjects.com/arale',
		//'jrzd': 'hexin/jrzd/1.0.0',
		'#tpl': 'hexin/im/2.2.0/template',
		'#controller': 'hexin/im/2.2.0/controller'
	},
	
	
	
	preload: ["jquery", "jquery-json"],
	
	// 配置 shim 信息，这样我们就可以通过 require('jquery') 来获取 jQuery
	
	debug: true,
	//base : "./assets",
	charset: 'utf-8'
});

//seajs.use('hexin/jrzd/1.0.0/jrzd-debug');
