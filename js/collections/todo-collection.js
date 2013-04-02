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

            this._getAllTodo();
        },

        _getAllTodo: function(){

            var that = this;

            window.dbHelper.getTodo(null, function(results){

                for(var i= 0, length = results.rows.length; i < length; i++){

                    that.add(results.rows.item(i));
                }
            });
        }
    });

    module.exports = todoCollection;
});