define(function(require, exports, module) {
	
	var monitor = (function() {
		function bind(b) {
			var queue = this.__MSG_QS__ = this.__MSG_QS__ || {};
			if (!queue[b]) {
				queue[b] = []
			}
			for (var a = 1, X = arguments.length, Y; a < X; a++) {
				queue[b].push(arguments[a])
			}
		}

		function live(b) {
			var queue = this.prototype.__STATIC_MSG_QS__;
			if (!queue[b]) {
				queue[b] = []
			}
			for (var a = 1, X = arguments.length, Y; a < X; a++) {
				queue[b].push(arguments[a])
			}
		}

		function trigger(Y) {
			var queue = [];
			var qs = this.__MSG_QS__ || {};
			var sqs = this.__STATIC_MSG_QS__ || {};
			queue = queue.concat(qs[Y.type] || []);
			queue = queue.concat(sqs[Y.type] || []);
			for (var a = 0, X = queue.length; a < X; a++) {
				if (queue[a].handler) {
					queue[a].handler(Y, this)
				} else {
					queue[a].call(this, Y, this);
				}
			}
		}
		return {
			ini : function(X) {
				if (Object.prototype.toString.call(X) == "[object Function]") {
					var proto = X.prototype;
					proto.__STATIC_MSG_QS__ = {};
					proto.bind = bind;
					proto.trigger = trigger;
					X.live = live;
				}
				X.bind = bind;
				X.trigger = trigger;
				return X
			}
		}
	})();
	
	var Plugin = (function() {
	
		function addPlugs(name, plug) {
			var __plugs = this.__plugs = this.__plugs || {};
			if (name && plug) {
				__plugs[name] = {
					installed : false,
					instance : plug
				};
			}
	
		}
	
		function installPlugs() {
			var plugs = this.__plugs = this.__plugs || {};
			for (var i in plugs) {
				var plug = plugs[i];
				if (!plug.installed) {
					plug.instance.install(this);
					plug.installed = true;
				}
			}
		}
	
		return {
			ini : function(X) {
				X = monitor.ini(X);
				if (X.live) {
					var proto = X.prototype;
					proto.addPlugs = addPlugs;
					proto.installPlugs = installPlugs;
				}
				X.__plugs = {};
				X.addPlugs = addPlugs;
				X.installPlugs = installPlugs;
			}
		}
	})();
	
	var Protocol = require("../protocol");
	Plugin.ini(Protocol);
	
	module.exports = Plugin;
});