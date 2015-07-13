endController = BaseController.extend({

	request : function() { 
		
	},

	addEventListener : function(){
		this.addNavStyle();
	},

	addNavStyle : function(){
		var askPath = document.location.href;
		var result = askPath.split("#");
		//alert("dddddd");
		$("li","#nav").each(function(){
			//去除所有
			$(this).removeClass("active");
			var $aHref = $(this).find("a").attr("href");
			if($aHref == "#"+result[1]){
				$(this).addClass("active");
			}
	 	});
	}
});