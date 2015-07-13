var AfterController = BaseController.extend({

	request : function() { 
		alert("TestAfterController");
	},

	addEventListener : function(){
			
	},
	server :function(){
		this.request();
		alert("AfterController的Server方法");
	}
});