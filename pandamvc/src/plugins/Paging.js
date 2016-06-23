/**
 * @comment : 分页基类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function($) {
    
	var Paging = Class.extend({
		_page : {
			pageSize : 20,
			totalPage : 0,
			currPage : 1,
			data : []
		},
		
		initialize : function(page){
			this._page.pageSize = page.pageSize > -1 ? page.pageSize : this._page.pageSize;
			this._page.totalPage = page.totalPage ? page.totalPage : this._page.totalPage;
			this._page.currPage = page.currPage ? page.currPage : this._page.currPage;
			this._page.data = page.data || [];
		},
		
		getPage : function(){
			return this._page;
		},
		
		sort : function(data, tiao){
			
		},
		
		paging : function(currNum){
			
		}

	});
	
	window.Paging = Paging;
})();