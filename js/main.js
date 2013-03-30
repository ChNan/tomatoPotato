/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-17
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

window.background = chrome.extension.getBackgroundPage();

define(function(require, exports, module){

    var backbone = require('backbone');
    var _ = require('underscore');
    var $ = jQuery = require('jquery');
    var bootstrap = require('bootstrap');

    require('js/localStorage');
    var template = require('js/template');
    var todoCollection = require('js/todo-collection');
    var utility = require('js/utility');

    bootstrap($);

    var mainView = backbone.View.extend({

        initialize: function(options){

            this.options = options || {};

            this._importCss();

            this._template = new template();

            this._todoColl = new todoCollection();

            this._regEvents();
        },

        _regEvents: function(){

            var that = this;

            this._template.on(this._template.triggerList.receive, function(data){

                that._importTemplate(data);
            });

            this._todoColl.on(this._todoColl.triggerList.refresh, function(coll){

                // 设置图标上番茄个数
                chrome.browserAction.setBadgeText({text: coll.models.length.toString()});

                that._template.getTemplate('tomato-list', coll.toJSON());
            });

            this._todoColl.on('sync', function(){

                that._todoColl.fetch();
            });

            $('#add').click(function(){

                that._todoColl.create({
                    todo: new Date().toLocaleTimeString()
                },{wait: true});

                that.render();
            });
        },

        _importTemplate: function(template){

            switch (template.name){
                case 'tomato-list':
                    var list = $('.tomato-list');
                    list.empty();
                    list.html(template.html);
                    break;
            }

            var that = this;

            setTimeout(function(){

                var tr = $('table > tbody > tr');

                tr.find('.icon-trash').click(function(){

                    var id = $(this).parent().find('.hidden').text();

                    that.deleteTodo(id);
                });

                tr.find('.icon-play').click(function(){

                    var id = $(this).parent().find('.hidden').text();

                    if(background.tomatoTime){

                        background.tomatoTime.startTomato();
                    }
                });
            }, 10);
        },

        _importCss: function(){

            require('css/bootstrap.min.css');
            require('css/bootstrap-responsive.min.css');
            require('css/main.css');
        },

        setTomatoTime: function(time){

            $('.timer').html(time);
        },

        deleteTodo: function(id){

            _.each(this._todoColl.models, function(m, i){

                if(id === m.id){

                    m.destroy({wait: true});
                }

                return false;
            });
        },

        render: function(){

            if(this._todoColl.models.length > 0){

                this._todoColl.remove(this._todoColl.models);
            }
            this._todoColl.fetch();

            this.setTomatoTime('00:00');
        }
    });

    window.main = new mainView();

    main.render();

});