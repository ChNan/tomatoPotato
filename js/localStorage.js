/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-22
 * Time: 下午9:04
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var _ = require('underscore');
    var utility = require('js/utility');

    var dbHelper = {

        _db: null,

        init: function(){

            this._db = this._openDB();

            this._createTable();
        },

        _openDB: function(){

            return openDatabase('todo', '', 'todo DB', 2 * 1024 * 1024);
        },

        _executeSql: function(sql, params, successCallback){

            this._db.transaction(function(t){

                t.executeSql(sql, params,
                    function(t, results){
                        if(successCallback) successCallback(results);
                    },
                    function(t, error){
                        throw new Error('error: ' + error.message);
                    }
                );
            });
        },

        _createTable: function(){

            var createTableSql = 'create table if not exists todoList ' +
                '(id TEXT, todo TEXT, timestamp DATETIME, status INT) ';

            this._executeSql(createTableSql, []);
        },

        getTodo: function(where, successCallback){

            var params = [];

            var sql = 'select * from todoList where status <> -1 ';

            if(where && !_.isEmpty(where.todo)){

                sql = sql + 'and todo like "%?%" ';

                params.push(where.todo);
            }

            if(where && !_.isEmpty(where.date)){

                sql = sql + 'and date(timestamp) = date(?) ';

                params.push(where.date);
            }

            sql = sql + 'order by timestamp desc';

            this._executeSql(sql, params, successCallback);
        },

        insertTodo: function(model, successCallback){

            var sql = "insert into todoList (id, todo, timestamp, status)values (?, ?, ?, ?)";

            var params = [utility.getGUID(), model.todo, utility.getDatetime(), 0];

            this._executeSql(sql, params, successCallback);
        },

        updateTodo: function(model, successCallback){

            var sql = 'update todoList set status = ? where id = ?';

            var params = [model.get('status'), model.get('id')];

            this._executeSql(sql, params, successCallback);
        }
    };

    window.dbHelper = window.dbHelper || dbHelper;

    window.dbHelper.init();
});