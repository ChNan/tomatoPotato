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
            timestamp: null,
            status: null
        },

        initialize: function(){

        },

        sync: function(method, model, options){

            switch (method){
                case 'read':
                    this.readModel();
                    break;
                case 'create':
                    this.createModel();
                    break;
                case 'update':
                    break;
                case 'delete':
                    this.deleteModel();
                    break;
            }
        },

        readModel: function(){

        },

        createModel: function(){

            window.dbHelper.insertTodo(this.toJSON());
        },

        deleteModel: function(){

            this.set({status: -1}, {silent: true});

            window.dbHelper.updateTodo(this);
        }

    });

    module.exports = todoModel;
});