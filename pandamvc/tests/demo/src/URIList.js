URIList = {
	
	context : {
		homeURI : '#/home', //主页地址配置
		templateSuffix : "tpl", //模版后缀名配置
		//before_controller : BeforeController, //所有uri请求执行之前执行的controller
		before_controller : null,
		//after_controller : AfterController, //所有uri请求执行之后执行的controller
		after_controller : null,
		refresh : false, //uri跳转，如果uri已经访问过是否刷新。
		refreshFlag : "true"	//uri参数中存在该参数，则将会刷新页面，否则不刷新。
	},
	//home
	home_uri : {
		extend : null,
		uri : '#/home',
		layout : [{
			selector : '#content',
			template : "src/templates/homeController.tpl",
			controller : HomeController,
			append:false
		},{
			selector:"#advimg",
			template:'src/templates/advimg.tpl',
			controller:AdvController
		},{
			selector : '#recomPct',
			template : "src/templates/HttjcpController.tpl",
			controller : HttjcpController,
			append:false
		}],
		endController:endController
	},
	//资讯中心
	zxzx_uri : {
		extend : null,
		uri : '#/zxzx',
		layout : [{
			selector : '#content',
			template : "src/templates/zxzxController.tpl",
			controller : ZxzxController,
			append:false
		}],
		endController:endController
	},
	//产品中心
	cpzx_uri : {
		extend : null,
		uri : '#/cpzx',
		layout : [{
			selector : '#content',
			template : "src/templates/cpzxController.tpl",
			controller : CpzxController,
			append:false
		}],
		endController:endController
	},
	//资管产品
	zgcp_uri:{
		extend : null,
		uri : '#/zgcp',
		layout : [{
			selector : '#content',
			template : "src/templates/ZgcpController.tpl",
			controller : ZgcpController,
			append:false
		}]
	},
	//基金产品
	jjcp_uri:{
		extend : null,
		uri : '#/jjcp',
		layout : [{
			selector : '#content',
			template : "src/templates/JjcpController.tpl",
			controller : JjcpController,
			append:false
		}]
	},
	//恒泰资讯日刊
	htzxrk_uri:{
		extend : null,
		uri : '#/htzxrk',
		layout : [{
			selector : '.right',
			template : "src/templates/HtzxrkController.tpl",
			controller : HtzxrkController,
			append:false
		}]
	},
	//恒泰资讯周刊
	htzxzk_uri:{
		extend : null,
		uri : '#/htzxzk',
		layout : [{
			selector : '.right',
			template : "src/templates/HtzxzkController.tpl",
			controller : HtzxzkController,
			append:false
		}]
	},
	//今日提示
	jrts_uri:{	
		extend : null,
		uri : '#/jrts',
		layout : [{
			selector : '.right',
			template : "src/templates/JrtsController.tpl",
			controller : JrtsController,
			append:false
		}]
	}
};

URI.addURI(URIList);