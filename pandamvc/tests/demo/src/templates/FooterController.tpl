<div>
	<ul>
	获取的数据长度：<%=pctlist.length%>
	<%for(var i = 0 ; i < pctlist.length;i++){%>
		<li><%=pctlist[i].rname%><li>
	<%}%>
	</ul>
	<button class="btn2">测试监听</button>
</div>