/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-17
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    window.background = chrome.extension.getBackgroundPage();

    var backbone = require('backbone');
    var _ = require('underscore');
    var $ = jQuery = require('jquery');
    var bootstrap = require('bootstrap');

    require('js/localStorage');
    var todoCollection = require('js/collections/todo-collection');
    var utility = require('js/utility');
    var todoView = require('js/views/todo-view');

    bootstrap($);

    var mainView = backbone.View.extend({

        el: $('.main'),

        events: {
            'keypress #new-todo': 'createTodo',
            'click .tomato-destroy': 'waiverTomato'
        },

        tomatoCount: 0,

        initialize: function(options){

            this.options = options || {};

            this._importCss();

            this._todoColl = new todoCollection();

            this.listenTo(this._todoColl, 'add', this.addTodo);
            this.listenTo(this._todoColl, 'reset', this.addAllTodo);
            this.listenTo(this._todoColl, 'remove', this.addAllTodo);
            this.listenTo(this._todoColl, 'change', this.addAllTodo);

            this.$input = $('#new-todo');
        },

        _importCss: function(){

            require('css/bootstrap.min.css');
            require('css/bootstrap-responsive.min.css');
            require('css/main.css');
        },

        _newTodo: function(todo){

            return {
                id: null,
                todo: todo,
                tomato: 0,
                timestamp: null,
                status: 0
            }
        },

        createTodo: function(e){

            if(e.which === 13){

                var value = this.$input.val().trim();

                if(value){

                    this._todoColl.create(this._newTodo(value), {wait: true});
                }

                this.$input.val('');
            }
        },

        addTodo: function(todo){

            var view = new todoView({model: todo});

            if(todo.get('status') > 0){

                view.todoComplete();
            } else {

                this.tomatoCount++;
            }

            $('#todo-list').prepend(view.render().el);

            if(background.tomatoTime.currentTomato){

                var t = background.tomatoTime.currentTomato;

                if(t.model.get('id') === todo.get('id') && todo.get('status') === 0){

                    if(t.model.get('tomato') !== todo.get('tomato')){

                        view.model.set({tomato: t.model.get('tomato')}, {silent: true});

                        view.updateTomato();

                        view.restoreDefault();
                    } else {

                        view.restoreStart();
                    }
                }
            }

            this.setBadgeText();
        },

        addAllTodo: function(){

            this.tomatoCount = 0;

            $('#todo-list').empty();

            this._todoColl.each(this.addTodo, this);
        },

        // 设置图标上番茄个数
        setBadgeText: function(){

            chrome.browserAction.setBadgeText({text: this.tomatoCount.toString()});
        },

        setTomatoTime: function(time){

            $('.timer').html(time);
        },

        waiverTomato: function(){

            if(background.tomatoTime){

                background.tomatoTime.stopTomato();
            }

            if(background.tomatoTime.currentTomato){

                background.tomatoTime.currentTomato.restoreDefault();
            }
        },

        getTodayTomato: function(){

            window.dbHelper.getTodayTomato(function(results){

                 this.$('.today-tomato').html('今天共用了 ' + results.rows.item(0).tomato + ' 个番茄');
            });
        },

        render: function(){

            this._todoColl.fetch({reset: true});

            this.setTomatoTime('00:00');

            this.getTodayTomato();
        }
    });

    window.main = new mainView();

    main.render();
});