function SQLite(cfg) {
  var sqlite = external.createObject('Sqlite');
  if(sqlite == null){
	  return;
  }
  /*if (typeof window.openDatabase === 'undefined') {
    return;
  }*/

  /**
   * 判断值是否是数字
   */
  function isNumber(val) {
    switch (typeof val) {
    case 'number':
      return true;
    case 'string':
      //return (/^\d+$/).test(val);
      return false;
    case 'object':
      return false;
    }
  }

  // Default Handlers
  function nullDataHandler(results) { }

  function errorHandler(error) {
    logger.error('Oops. ' + error.message + ' (Code ' + error.code + ')');
  }

  var config = cfg || {}, db;
  
  //config.path = "";
  config.shortName = config.shortName || 'mydatabase';
  config.version = config.version || '1.0';
  config.displayName = config.displayName || 'My SQLite Database';
  config.maxSize = 65536;
  config.defaultErrorHandler = config.defaultErrorHandler || errorHandler;
  config.defaultDataHandler = config.defaultDataHandler || nullDataHandler;

  var result = sqlite.createDataBase(config.path);
  if(result == "-2"){
	logger.error("打开数据库失败，参数错误。");
    return ;
  }else if(result == "-3"){
  	logger.error("打开数据库失败.");
  	return ;
  }

  function execute(query, values, dataHandler){
	if(!query){
  		return null;
  	}
  	query = query.split("?");
  	var newQuery = query[0];
  	var index = 0;
	for(var idx = 0; idx < values.length; idx++){
		var value = values[idx] || "";
		if( !isNumber(value) && ( value.indexOf("desc") < 0 && value.indexOf("asc")) ){
			//将value值的 引号 进行转义
			//sqlite 数据库单引号不可用
			value = (value || "").replace(/\'/g, "''").replace(/\"/g, '\\"');
			//加引号
			value = "'" + value + "'";
		}
		//query = query.replace("=?", "="+value); 
		// newQuery = query.replace("?", value);
		newQuery += value;
		newQuery += (index + 1) < query.length ? query[index+1] : "";
		index ++;
	}
	var dHandler = function(rownum, data){
		try{
			data = eval("(" + data + ")");
		}catch(e){
		}
		dataHandler(rownum, data);
	}
	logger.log("SQLITE执行sql语句:" + newQuery);
	return sqlite.execSql(newQuery, dHandler);
  }
  /*
  function execute(query, v, d, e) {
    var values = v || [],
      dH = d || config.defaultDataHandler,
      eH = e || config.defaultErrorHandler;

    if (!query || query === '') {
      return;
    }

    function err(t, error) {
      eH(error, query);
    }

    function data(t, result) {
      dH(result, query);
    }

    db.transaction(
      function (transaction) {
        transaction.executeSql(query, values, data, err);
      }
    );
  }*/

  function buildConditions(conditions) {
    var results = [], values = [], x;

    if (typeof conditions === 'string') {
      results.push(conditions);
    } else if (typeof conditions === 'number') {
      results.push("id=?");
      values.push(conditions);
    } else if (typeof conditions === 'object') {
      for (x in conditions) {
        if (conditions.hasOwnProperty(x)) {
          if (isNumber(x)) {
            results.push(conditions[x]);
          } else {
            results.push(x + '=?');
            values.push(conditions[x]);
          }
        }
      }
    }

    if (results.length > 0) {
      results = " WHERE " + results.join(' AND ');
    } else {
      results = '';
    }

    return [results, values];
  }
  
  function createIndexSQL(idxName, tableName, cols) {
    var query = "CREATE INDEX IF NOT EXISTS " + idxName + " ON " + tableName + "(" + cols + ");";
    return [query, []];
  }
  
  function createTableSQL(name, cols) {
    var query = "CREATE TABLE IF NOT EXISTS " + name + "(" + cols + ");";

    return [query, []];
  }

  function dropTableSQL(name) {
    var query = "DROP TABLE " + name + ";";

    return [query, []];
  }

  function insertSQL(table, map) {
    var query = "INSERT INTO " + table + " (#k#) VALUES(#v#);", keys = [], holders = [], values = [], x;

    for (x in map) {
      if (map.hasOwnProperty(x)) {
        keys.push(x);
        holders.push('?');
        values.push(map[x]);
      }
    }

    query = query.replace("#k#", keys.join(','));
    query = query.replace("#v#", holders.join(','));

    return [query, values];
  }
  
  function replaceSQL(table, map) {
    var query = "REPLACE INTO " + table + " (#k#) VALUES(#v#);", keys = [], holders = [], values = [], x;

    for (x in map) {
      if (map.hasOwnProperty(x)) {
        keys.push(x);
        holders.push('?');
        values.push(map[x]);
      }
    }

    query = query.replace("#k#", keys.join(','));
    query = query.replace("#v#", holders.join(','));

    return [query, values];
  }

  function updateSQL(table, map, conditions) {
    var query = "UPDATE " + table + " SET #k##m#", keys = [], values = [], x;

    for (x in map) {
      if (map.hasOwnProperty(x)) {
        keys.push(x + '=?');
        values.push(map[x]);
      }
    }

    conditions = buildConditions(conditions);

    values = values.concat(conditions[1]);

    query = query.replace("#k#", keys.join(','));
    query = query.replace("#m#", conditions[0]);

    return [query, values];
  }

  function selectSQL(table, columns, conditions, options) {
    var query = 'SELECT #col# FROM ' + table + '#cond#', values = [];

    if (typeof columns === 'undefined') {
      columns = '*';
    } else if (typeof columns === 'object') {
      columns.join(',');
    }

    conditions = buildConditions(conditions);

    values = values.concat(conditions[1]);

    query = query.replace("#col#", columns);
    query = query.replace('#cond#', conditions[0]);

    if (options) {
      if (options.order) {
        query = query + ' ORDER BY ?';
        values.push(options.order);
      }
      if (options.limit) {
        query = query + ' LIMIT ?';
        values.push(options.limit);
      }
      if (options.offset) {
        query = query + ' OFFSET ?';
        values.push(options.offset);
      }
    }

    query = query + ';';

    return [query, values];
  }

  function destroySQL(table, conditions) {
    var query = 'DELETE FROM ' + table + '#c#;';

    conditions = buildConditions(conditions);

    query = query.replace('#c#', conditions[0]);

    return [query, conditions[1]];
  }

  return {
    database: sqlite,
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 索引创建操作, 如果索引已经存在则不创建索引。
     * @param {Object} name 表名
	 * @param {Object} cols 列名及列类型，多个以逗号隔开。
	 * @param {Object} data 无用
	 * @param {Object} error 目前无用
     */
    createIndex : function(idxName, tableName, cols, data, error){
    	var sql = createIndexSQL(idxName, tableName, cols);
    	return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 表创建操作, 如果表已经存在则不创建表。
     * @param {Object} name 表名
	 * @param {Object} cols 列名及列类型，多个以逗号隔开。
	 * @param {Object} data 无用
	 * @param {Object} error 目前无用
     */
    createTable: function (name, cols, data, error) {
      var sql = createTableSQL(name, cols);
      return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 表删除操作
     * @param {Object} name 表名
	 * @param {Object} data 无用
	 * @param {Object} error 目前无用
     */
    dropTable: function (name, data, error) { 
      var sql = dropTableSQL(name);
      return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 添加记录操作。
     * @param {Object} table 表名
     * @param {Object} map 插入的净值对。如{name:"刘化罗", email:"liuhualuo@163.com"}
	 * @param {Object} data 无用
	 * @param {Object} error 目前无用
     */
    insert: function (table, map, data, error) {
      var sql = insertSQL(table, map);
      return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 记录替换操作，如果记录存在则替换记录信息，如果不存在则添加记录。
     * @param {Object} table 表名
     * @param {Object} map 插入的净值对。如{name:"刘化罗", email:"liuhualuo@163.com"}
	 * @param {Object} data 无用
	 * @param {Object} error 目前无用
     */
    replace : function(table, map, data, error){
    	var sql = replaceSQL(table, map);
    	return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 更新记录操作。
     * @param {Object} table 表名
     * @param {Object} map 表名
	 * @param {Object} data 无用
	 * @param {Object} error 目前无用
     */
    update: function (table, map, conditions, data, error) {
      var sql = updateSQL(table, map, conditions);
      return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : sqlite 查询方法。
	 * @param {Object} table 表名
	 * @param {Object} columns 列名，多个以逗号隔开。
	 * @param {Object} conditions 条件，查询参数。
	 * @param {Object} options 选项， limit， order， offset。
	 * @param {Object} data 成功回调方法，参数，row，和 data。 
	 * @param {Object} error 目前无用
     */
    select: function (table, columns, conditions, options, data, error) {
      var sql = selectSQL(table, columns, conditions, options);
      return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 删除表操作。
	 * @param {Object} table
	 * @param {Object} conditions
	 * @param {Object} data
	 * @param {Object} error
     */
    destroy: function (table, conditions, data, error) {
      var sql = destroySQL(table, conditions);
      return execute(sql[0], sql[1], data, error);
    },
    /**
     * @date : 2012-09-27
	 * @author : liuhualuo@163.com 
     * @comment : 关闭sqlite，连接。
     */
    close : function(){
    	sqlite.close();
    }
  };
}
