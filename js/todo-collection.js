/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-22
 * Time: 下午11:05
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var backbone = require('backbone');
    var _ = require('underscore');
    var todoModel = require('js/todo-model');

    var todoCollection = backbone.Collection.extend({

        model: todoModel,

        triggerList: {
            refresh: 'TodoCollection:refresh'
        },

        initialize: function(){

            this.options = {};

            _.extend(this, backbone.Events);

            this._regEvents();
        },

        _regEvents: function(){

            this.on('add', this._refresh);
            this.on('reset', this._refresh);
            this.on('remove', this._refresh);
            this.on('change', this._refresh);
        },

        _refresh: function(){

            this.trigger(this.triggerList.refresh, this);
        },

        sync: function(method, model, options){

            _.extend(this.options, options || {});

            switch (method){
                case 'read':
                    this._getAllTodo();
                    break;
            }
        },

        _getAllTodo: function(){

            var that = this;

            window.dbHelper.getTodo(null, function(results){

                for(var i= 0, length = results.rows.length; i < length; i++){

                    that.add(_.extend(results.rows.item(i), {no: i + 1}), {silent: true});
                }

                that.trigger(that.triggerList.refresh, that);
            });
        }
    });

    module.exports = todoCollection;
});