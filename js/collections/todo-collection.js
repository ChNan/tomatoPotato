/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-22
 * Time: 下午11:05
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var backbone = require('backbone');
    var todoModel = require('js/models/todo-model');

    var todoCollection = backbone.Collection.extend({

        model: todoModel,

        sync: function(method, model, options){

            this.options = options || {};

            this._getAllTodo(this.options);
        },

        _getAllTodo: function(options){

            window.dbHelper.getTodo(null, function(results){

                var data = [];

                for(var i= 0, length = results.rows.length; i < length; i++){

                    data.push(results.rows.item(i));
                }

                if(options && options.success){

                    options.success(data);
                }
            });
        }
    });

    module.exports = todoCollection;
});