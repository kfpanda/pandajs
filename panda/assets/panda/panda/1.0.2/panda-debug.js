/**
 * panda 为公共方法类
 * @file
 * @version 1.0.2
 * @copyright copyright
 * @author : liuhualuo@163.com
 */
(function(){
	var global = this,
		objectPrototype = Object.prototype,
		toString = objectPrototype.toString,
		enumerables = true,
		enumerablesTest = { toString: 1 },
		emptyFn = function(){},
		i;
	
	if (typeof Panda === 'undefined') {
		var Panda = function(){
			this.name = 'Panda';
			this.version = '1.10'; 
		};
		Panda = new Panda();
        global.Panda = Panda;
    }
	
	for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    Panda.enumerables = enumerables;

    /**
     * 
     */
    Panda.apply = function(object, config, defaults) {
        if (defaults) {
            Panda.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };
	
	Panda.apply(Panda, {
		isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            // 检查 ownerDocument 排除DOM节点
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        }
	});
	
})();
