/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-17
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){

    var backbone = require('backbone');
    var _ = require('underscore');
    var $ = jQuery = require('jquery');

    var template = require('js/template');
//    var message = require('js/notification');

    var mainView = backbone.View.extend({

        initialize: function(options){

            this.options = options || {};

            this._importCss();

            this._template = new template();

            this._regEvents();
        },

        _regEvents: function(){

            var that = this;

            this._template.on(this._template.triggerList.receive, function(data){

                that._importTemplate(data);
            });
        },

        _importTemplate: function(template){

            switch (template.name){
                case 'tomato-list':
                    $('.test').html(template.html);
                    break;
            }

        },

        _importCss: function(){

            require('css/bootstrap.min.css');
            require('css/bootstrap-responsive.min.css');
            require('css/main.css');
        },

        render: function(){

            this._template.getTemplate('tomato-list', {thing: 'world'});
        }
    });



    var main = new mainView();

    main.render();
});