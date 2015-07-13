/*
 * @Author	 : liuhualuo@myhexin.com
 * @Date	 : 2012-10-26
 * @Comments : 注册消息事件注册
 */
	
var Register = Class.create({

	visitorSeq: 0,
	/* 控制是否被踢下线 */
	userKickOffed : false,
	
	register : function() {
		if(!IMWin._fnList[IMWin._wid]){
			this.receiveMsg();
			this.receiveFileMsg();
			this.userStatusUpdate();
			this.userKickOff();
			this.getConversationTransferInfo();
			this.addNewVisitor();
			this.beTransfer();
			this.overTalk(); //结束服务
		}
	},

	/*
	 * @Author	 : liuhualuo@myhexin.com
	 * @Date	 : 2012-10-30
	 * @Comments : 消息事件注册
	 */
	receiveMsg : function() {
		//IM消息获取回调函数
		var receiveMsgCallBack = function(options, result, textStatus) {
			//alert($.toJSON(result));
			var data = [];
			data = data.concat(result.data);
			//UserMsg.putMsg(data[0].from, data);
			//不是当前聊天用户的记录， 则保存到未读消息记录表中。
			$.each(data, function(idx, value) {
				if ( value.from && $.trim(value.from)!='' ){
					// 添加正在会话中人员
					ClientCache.callFunc('IMFriend.addTalker', value.from);
				}
				
				if ( value.from && $.trim(value.from)!='' && !IMWin.isOpenChat(value.from)) {
					if(!IMWin._multichat && IMWin.isOpenChat('vimids') && value.from == IMWin._actVimid){
						// 单窗口时，已打开窗口vimids并且活动的imid为from
						return true;
					}
					if(!IMFriend.getFriend(value.from)){
						// 好友不存在时
						return true;
					}
					//聊天窗口未打开将记录到未读聊天记录表中。
					value.time = value.time * 1000;
					value.type = (value.type || {}).type;
					value.toimid = IMUser.getImid();
					//消息计数加1
					//TODO
					//将消息保存到库中
					DBModel.insertNewMsg(value, {chattime : "time", fromimid : "from",
								msg : "content", toimid : "toimid", type : "type"});
					
					WinCoruscate.soundForMsg();
					//闪烁主窗口
					WinCoruscate.mainWinCoruscate();
					//列表闪烁
					WinCoruscate.friendCoruscate(value.from, true);
				}
			});
		}

		Protocol.registerEvent("im_client.receiveMsg", {
			"success" : receiveMsgCallBack
		});
	},
	
	/*
	 * @Author	 : liuhualuo@myhexin.com
	 * @Date	 : 2012-10-30
	 * @Comments : 文件接收下载回调函数注册
	 */
	receiveFileMsg : function() {
		//文件下载回调函数
		var fileDownloadCallback = function(options, result, textStatus) {
			// logger.debug(result.data)
			var data = result.data || {};
						
			if ( data.from && $.trim(data.from) !='' && !IMWin.isOpenChat(data.from)) {
				if(!IMWin._multichat && IMWin.isOpenChat('vimids') && data.from == IMWin._actVimid){
					// 单窗口时，已打开窗口vimids并且活动的imid为from
					return;
				}
				if(!IMFriend.getFriend(data.from)){
					// 好友不存在时
					return;
				}
				//消息计数加1
				//TODO
				//将文件消息保存到库中
				DBModel.insertFileMsg(data, {fromimid : "from",
							filename : "filename", realname : "realname", filelength : "filelength"});
				
				WinCoruscate.soundForMsg();
				//闪烁主窗口
				WinCoruscate.mainWinCoruscate();
				//列表闪烁
				WinCoruscate.friendCoruscate(data.from, true);
			}
		}

		Protocol.registerEvent("im_client.downloadOver", {
			"success" : fileDownloadCallback
		});
	},

	/*
	 * @Author	 : liuhualuo@myhexin.com
	 * @Date	 : 2012-10-30
	 * @Comments : 状态变更事件注册
	 */
	userStatusUpdate : function() {
		//IM用户 状态变更回调函数
		var userStatusUpdateCallBack = function(options, result, textStatus) {
			var user = (result.data || {}).user;
			if (!$.isEmptyObject(user)) {
				if (user.imid == IMUser.get("imid")) {
					//更新登录用户的状态
					IMUser.updateStatus(user.status);
				} else {
					//更新登录用户的好友状态
					if($('[userid=' + user.imid + ']').parent().attr('groupid') == 'blackgroup'){
						return;
					}
					user.groupId = $('[userid=' + user.imid + ']').parent().attr('groupid');
					if(user.imid != 'V'){
						IMFriend.updateFriend(user);	
					}
				}
			}
		}

		Protocol.registerEvent("im_client.userStatusUpdate", {
			"success" : userStatusUpdateCallBack
		});
	},
	/*
	 * @Author	 : liuhualuo@myhexin.com
	 * @Date	 : 2012-10-30
	 * @Comments : IM用户 被踢下线事件注册
	 */
	userKickOff : function() {
		var that = this;
		//IM用户 被踢下线事件注册
		var userKickOffCallBack = function(options, result, textStatus) {
			//更新用户状态为 离线状态
			IMUser.updateStatus("offline");
			if(!that.userKickOffed){
				that.userKickOffed = true;
				alert("您的帐号在别处登录，您已被迫下线！");
			}
			IMWin.exit(true);
		}

		Protocol.registerEvent("im_client.userKickOff", {
			"success" : userKickOffCallBack
		});
	},
	/*
	 * @Author	 : wangyifeng@myhexin.com
	 * @Date	 : 2012-11-25
	 * @Comments : 接收其他客服转移来的用户
	 */
	getConversationTransferInfo : function() {
		var getConversationTransferInfoCallBack = function(options, result, textStatus) {
			var data = result.data;
			var content = "[客服]" + data.fromname + "\n请求将\n[客户]" + data.servicename + "\n的会话转移给你，是否接受？";
			var flag = confirm(content);
			/*
			 * 接受或拒绝均不是针对当前请求op返回
			 */
			if (flag) { // 接受
				var value = {};
				value.time = new Date().getTime();
				value.from = data.serviceid;
				value.content = data.history;
				value.toimid = IMUser.getImid();
				//将消息保存到库中
				DBModel.insertNewMsg(value, {
					chattime : "time",
					fromimid : "from",
					msg : "content",
					toimid : "toimid",
					type : "type"
				});
			
				var acceptParam = URLParam.getUrlParam('im_client.acceptForward');
				acceptParam.parameter.imid = IMUser.get('imid');
				acceptParam.parameter.name = IMUser.get('name');
				acceptParam.parameter.vimid = IMUser.get('vimid');
				acceptParam.parameter.toimid = data.from;
				acceptParam.parameter.serviceid = data.serviceid;
				acceptParam.parameter.servicename = data.servicename;
				Protocol.request(acceptParam);
				
				// 添加或更新用户到客户列表
				options.scope.queryUser(data.serviceid);
			} else { // 拒绝
				var denyParam = URLParam.getUrlParam('im_client.denyForward');
				denyParam.parameter.imid = IMUser.get('imid');
				denyParam.parameter.name = IMUser.get('name');
				denyParam.parameter.vimid = IMUser.get('vimid');
				denyParam.parameter.toimid = data.from;
				denyParam.parameter.serviceid = data.serviceid;
				denyParam.parameter.servicename = data.servicename;
				Protocol.request(denyParam);
			}
		}

		Protocol.registerEvent("im_client.getConversationTransferInfo", {
			'success' : getConversationTransferInfoCallBack,
			'scope' : this
		});
	},
	/*
	 * @Author	 : luhaining@myhexin.com
	 * @Date	 : 2012-12-5
	 * @Comments : 新游客登陆 添加用户到客户列表
	 */
	addNewVisitor : function() {
		var addNewVisitorCallBack = function(options, result, textStatus) {
			options.scope.queryUser(result.data.serviceid);
		}

		Protocol.registerEvent("im_client.visitorLogon", {
			"success" : addNewVisitorCallBack,
			'scope' : this
		});
	},
	
	/*
	 * @Author	 : yuanmiao@myhexin.com  
	 * @Date	 : 2013-08-08
	 * @param 	 : 无
	 * @return   : 无
	 * @Comments : 发送消息，并保存本地数据库
	 */		
	sendMsg : function() {
		var msgData = this.getSendMsg();
		var date = new Date();
		//发送请求
        this.sendMsgRequest(msgData, date);
		/*
		 * 取消显示客服端的问候语
		var msgContent = msgData.content;
		msgContent = $.trim(msgContent);     		
		
        date = date || new Date();
		//缓存历史记录
		var msgArr = [{
			"content" : msgContent,
            "text" : msgContent,	
			"time" : date.getTime(),
			"from" : IMUser.get("imid"),
			"toimid" : VMUser.get("imid"),
			"type" : VMUser.get("type")
		}];
		HistMsg.putMsg(msgArr);
		*/
	},
	
	/*
	 * @Author	 : yuanmiao@myhexin.com  
	 * @Date	 : 2013-08-08
	 * @param 	 : msgData  消息对象
	 * @return   : 无
	 * @Comments : 将消息对象数据进行封装，最后将封装的数据进行发送
	 */		
	sendMsgRequest: function(msgData, date, serviceid) {
        //校验时间
        if (ContextModel.delay >= 1e3 || ContextModel.delay <= -1e3) {
            date = new Date(date.getTime() + ContextModel.delay);
        }
        var sendMsgParam = URLParam.getUrlParam("im_client.sendMsg");
        sendMsgParam.parameter.imid = IMUser.get("imid");
        sendMsgParam.parameter.toimid = VMUser.get('imid');
        sendMsgParam.parameter.content = msgData.content;
        //Util.ascii2native(msgContent);
        sendMsgParam.parameter.embed = msgData.embed;
        sendMsgParam.parameter.time = date.getTime() / 1e3;
        // alert($.toJSON(sendMsgParam.parameter))
        //添加了发送消息的时间，需要除以一千，配合服务端的接收       yuanmiao@myhexin.com
        Protocol.request(sendMsgParam);
    },

	/*
	 * @Author	 : yuanmiao@myhexin.com  
	 * @Date	 : 2013-08-08
	 * @param 	 : 无
	 * @return   : 发送的消息
	 * @Comments : 获取需要发送的消息
	 */			
	getSendMsg	: function() {
		var data = {
			content: ''
		};
		
		var str = '您好  '+ VMUser.get('name') +'，请问有什么需要帮助吗？';
		// 包裹样式
		var pStyle = "font-style:"+ FontModel.get("style")+";"
					+ "font-family:"+ FontModel.get("family")+";"
					+ "font-size:"+ FontModel.get("size") + "pt"+";"
					+ "font-weight:"+ FontModel.get("weight")+";"
               		+ "text-decoration:"+ FontModel.get("decoration")+";"
                	+ "line-height:"+ FontModel.get("size") + "pt"+";"
                	+ "color:"+ FontModel.get("color")+";";
                	
		var style = ' style= ' + '"' + pStyle + '"';

		data.content = '<p' + style + '>' + str + '</p>';
		
		return data;		
	},
	
	queryUser : function(vimid) {
		var queryUserParam = URLParam.getUrlParam('im_client.queryUser');
		queryUserParam.parameter.queryimid = vimid;
		queryUserParam.scope = this;
		queryUserParam.success = this.getUserInfo;
		Protocol.request(queryUserParam);
	},
	
	getUserInfo : function(options, result, textStatus) {
		var that = this;
		var friend = {};
		friend.imid = options.parameter.queryimid;
		friend.status = 'online';
		friend.groupId = 'customgroup';
		friend.groupName = '客户列表';
		friend.isLastestContact = true;
		if(friend.imid.indexOf('V-') > -1){
			var tempVisitors = Visitors.data;
        	var visitors = Visitors.getData();
            if (visitors[friend.imid]) {
                friend.signed = true;
                $.each(tempVisitors[friend.imid], function(key, value) {
                    friend[key] = value;
                });
            }else if(tempVisitors[friend.imid]) {
                friend.signed = false;
                $.each(tempVisitors[friend.imid], function(key, value) {
                    friend[key] = value;
                });
            } else {
                this.visitorSeq++;
                friend.signed=false;
                friend.name = "游客" + this.visitorSeq;
                friend.createtime = new Date().getTime();
            }
            friend.type = "V";
            Visitors.data[friend.imid] = friend;
		}else{
			friend.name = result.data.name;
			friend.type = 'N';
		}
		// IMFriend.addFriendToGroup(friend,friend.groupId,friend.groupName);
		IMFriend.updateFriend(friend);
		
		// 添加正在会话中人员
		ClientCache.callFunc('IMFriend.addTalker', friend.imid);
		
		/*设置VMUser信息，发送消息	yuanmiao@myhexin.com*/
        VMUser.set(friend);
    	DBModel.openDB();
        setTimeout(function() {
            that.sendMsg();
        }, 2500);
        
		var sslParam = URLParam.getUrlParam('im_client.setServiceList');
		sslParam.parameter.cimid = friend.imid;
		sslParam.success = function(opts, rlt, status){
			//alert($.toJSON(rlt));
		};
		Protocol.request(sslParam);
	},
	/*
	 * @Author	 : luhaining@myhexin.com
	 * @Date	 : 2013-08-01
	 * @Comments : 会话被转移事件注册
	 */
	beTransfer : function() {
		var beTransferCallBack = function(options, result, textStatus) {
			//alert($.toJSON(result));
			if(result.status != 'success'){
				return;
			}
			var simid = result.data.imid;
			if(!simid && $.trim(simid) == ""){
				alert(result.data.errormsg);
				return ;
			}
			var params = {
				parameter:{
					'queryimid': simid
				}
			};
			params.success = function(opt, rlt, status){
				//alert($.toJSON(rlt));
				var sinfo = rlt.data;
				try{
					//心情中文编码
					sinfo.mood = Util.Decoder.ascii2native(sinfo.mood);
				}catch(e){ }
				sinfo.groupId = 'svrkindgroup';
				sinfo.groupName = '客服';
				sinfo.status = 'online';
				sinfo.updatetime = sinfo.updatetime.replace(/(.*-\d{2})/, '$1 ');
				IMWin.openChat4svr(sinfo.imid, sinfo);
			};
			Protocol.request("im_client.queryUser", params);
		}

		Protocol.registerEvent("im_client.getServiceImid", {
			"success" : beTransferCallBack,
			'scope' : this
		});
	},
	/*
	 * @Author	 : luhaining@myhexin.com
	 * @Date	 : 2013-08-20
	 * @Comments : 用户结束服务，删除正在会话列表
	 */
	overTalk : function() {
		var overTalkCallBack = function(options, result, textStatus) {
			//alert($.toJSON(result));
			if(result.code == 0){
				ClientCache.callFunc("IMFriend.delTalker", result.data.imid);
			}
		}

		Protocol.registerEvent("im_client.closeService", {
			"success" : overTalkCallBack,
			'scope' : this
		});
	}
});

new Register().register();

ClientRegister = Class.create({
	register : function(){
		this.delWinHandle();
		this.closeWindow();
		this.openChat();
		this.openSetWin();		
		this.updateFriend();
		this.getFriends();
		this.addTalker();
		this.delTalker();
	},
	
	delWinHandle : function(){
		ClientCache.addFunc("IMWin.delWinHandle", IMWin.delWinHandle);
	},
	
	openChat : function(){
		ClientCache.addFunc("IMWin.openChat", function(vimid){
			IMWin.openChat(vimid);
		});
	},
	
	openSetWin : function(){
		ClientCache.addFunc('IMWin.openSetWin', function(cfg){
			IMWin.openSetWin(cfg);
		});
	},
	
	closeWindow : function(){
		$(window).unload(function() {
			IMFriend.setCache();
		});
	},
	
	updateFriend : function(){
		ClientCache.addFunc('IMFriend.updateFriend', function(friend){
			IMFriend.updateFriend($.parseJSON(friend));	
		});		
	},
	
	getFriends : function(){
		ClientCache.addFunc('IMFriend.datas', function() {
            return IMFriend;
        });	
	},
	//添加会话中人员
	addTalker : function(){
		ClientCache.addFunc('IMFriend.addTalker', function(vimid) {
			var user = IMFriend.getFriend(vimid);
			//过滤用户不存在或客服联系客服的情况
			if( !!( user && !(user.type == "S" && IMUser.get("type") == "S") ) ){
				IMFriend._talking[vimid] = user;
				ClientCache.callFunc('Chat.addTalkerDom', $.toJSON(user));
			}
        });	
	},
	//删除会话中人员
	delTalker : function(){
		ClientCache.addFunc('IMFriend.delTalker', function(vimid) {
			ClientCache.callFunc('Chat.delTalkerDom', vimid);
			IMFriend._talking[vimid] = null;
			delete IMFriend._talking[vimid];
        });	
	}
});

if(IMWin._isMain){
	new ClientRegister().register();
}
