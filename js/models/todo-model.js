/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-21
 * Time: 下午9:10
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var backbone = require('backbone');

    var todoModel = backbone.Model.extend({

        defaults: {
            id: null,
            todo: null,
            tomato: null,
            timestamp: null,
            status: null
        },

        sync: function(method, model, options){

            switch (method){
                case 'create':
                    this.createModel(options);
                    break;
                case 'update':
                    this.updateModel(options);
                    break;
                case 'delete':
                    this.deleteModel();
                    break;
            }
        },

        createModel: function(options){

            var that = this;

            window.dbHelper.insertTodo(this.toJSON(), function(){

                that._success(that, options);
            });
        },

        updateModel: function(options){

            var that = this;

            window.dbHelper.updateTodo(this, function(){

                that._success(that, options);
            });
        },

        deleteModel: function(options){

            var that = this;

            this.set({status: -1}, {silent: true});

            window.dbHelper.updateTodo(this, function(){

                that._success(that, options);
            });
        },

        _success: function(model, options){

            if(options && options.success){

                options.success(model.toJSON());
            }
        }

    });

    module.exports = todoModel;
});