var BeforeController = BaseController.extend({

	request : function() { 
		//alert("TestBeforeController");
		
		//URI.set
	},

	addEventListener : function(){
			
	},

	server :function(){
		this.request();
		//alert("BeforeController的Server方法");
	}
});