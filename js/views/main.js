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
    var bootstrap = require('bootstrap');

    require('js/localStorage');
    var todoCollection = require('js/collections/todo-collection');
    var utility = require('js/utility');
    var todoView = require('js/views/todo-view');

    bootstrap($);

    var mainView = backbone.View.extend({

        el: $('.main'),

        events: {
            "keypress #new-todo": "createTodo"
        },

        initialize: function(options){

            this.options = options || {};

            this._importCss();

            this._todoColl = new todoCollection();

            this.listenTo(this._todoColl, 'add', this.addTodo);
            this.listenTo(this._todoColl, 'reset', this.addAllTodo);

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

            if(!this._views){
                this._views = [];
            }

            var view = new todoView({model: todo});

            this.listenTo(view, 'renderView', function(html){

                view.$el.html(html);
                $('#todo-list').append(view.el);
            });

            setTimeout(function(){

                view.render();
            }, 100);
        },

        addAllTodo: function(){

            $('#todo-list').empty();

            this._todoColl.each(this.addTodo, this);

            // 设置图标上番茄个数
            chrome.browserAction.setBadgeText({text: this._todoColl.models.length.toString()});
        },

        setTomatoTime: function(time){

            $('.timer').html(time);
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