(function(){
	var global = this,
		objectPrototype = Object.prototype,
		toString = objectPrototype.toString,
		enumerables = true,
		enumerablesTest = { toString: 1 },
		emptyFn = function(){},
		i;
	
	if (typeof Hexin === 'undefined') {
		var Hexin = function(){
			this.name = 'Hexin';
			this.version = '1.10'; 
		};
		Hexin = new Hexin();
        global.Hexin = Hexin;
    }
	
	for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    Hexin.enumerables = enumerables;

    /**
     * 
     */
    Hexin.apply = function(object, config, defaults) {
        if (defaults) {
            Hexin.apply(object, defaults);
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
	
	Hexin.apply(Hexin, {
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





