/**
 * @comment  : PandaPaging实现类
 * @author   : liuhualuo@163.com
 * @create   : 2012-7-18
 */
(function($) {
    
	var PandaPaging = Paging.extend({
		
		initialize : function(page){
			SamplePaging.superclass.initialize.call(this, page);
		},
		
		compare : function(data1, data2, ruleList) {
			ruleList = ruleList || [];
			for (var i = 0; i < ruleList.length; i++) {
				var rule = ruleList[i];
				if (data1[rule.key] > data2[rule.key] && rule.order != "desc") {
					//小的排在前面
					return true;
				} else if (data1[rule.key] < data2[rule.key] && rule.order == "desc") {
					//大的 排在前面
					return true;
				} else if (data1[rule.key] == data2[rule.key]) {
					continue;
				} else {
					break;
				}
			}
			return false;
		},
		
		//快速排序算法实现排序
		quickSort : function(arr, rules) {
			
			if (arr.length <= 1) {
				return arr;
			}

			var pivotIndex = Math.floor(arr.length / 2);
			var pivot = arr.splice(pivotIndex, 1)[0];
			var left = [];

			var right = [];
			for (var i = 0; i < arr.length; i++) {
				if( this.compare(pivot, arr[i], rules) ){
					left.push(arr[i]);
				}else{
					right.push(arr[i]);
				}
			}
			return this.quickSort(left, rules).concat([pivot], this.quickSort(right, rules));
		},
		
		/**
		 * 
		 * @param {Object} data
		 * @param {Object} sortRule : {
		 * 		prePage : 10, //表示要排好前面几页的顺序。
		 * 		sufPage : 10, //表示要排好后面几页的顺序。
		 * 		rule : [{
		 * 			key : "",
		 * 			order : asc,//asc or desc
		 * 		}]	//排序规则。
		 * }
		 */
		sort : function(dataList, sortRule){
			sortRule = sortRule || {};
			dataList = dataList || [];
			
			//设置总页数
			var totalPage = dataList.length / this.getPage().pageSize;
			totalPage = totalPage > 0 ? parseInt(totalPage) : 0;
			totalPage = (dataList.length % this.getPage().pageSize > 0) ? (totalPage + 1) : totalPage;
			this.getPage().totalPage = totalPage;
			
			if (!sortRule.rule) {
				//没有排序规则
				this.getPage().data = dataList;
				return;
			}
			
			var preCount = sortRule.prePage || 10000000;
			var sufCount = sortRule.sufCount || 10000000;
			//用小的记录数
			var count = (preCount > sufCount ? sufCount : preCount) * this.getPage().pageSize;
			
			return this.getPage().data = this.quickSort(dataList, sortRule.rule);
		},
		
		paging : function(currPage){
			currPage = currPage < 1 ? 1 : currPage;
			currPage = currPage > this.getPage().totalPage ? this.getPage().totalPage : currPage;
			this.getPage().currPage = currPage;
			
			var beginNum = (currPage - 1) * this.getPage().pageSize;
			var endNum = currPage * this.getPage().pageSize;
			
			this.getPage().currPage = currPage;
			var page = {
				pageSize : this.getPage().pageSize,
				totalPage : this.getPage().totalPage,
				currPage : this.getPage().currPage,
				data : this.getPage().data.slice(beginNum, endNum)
			}
			return page;
		}

	});
	
	window.PandaPaging = PandaPaging;
})();
