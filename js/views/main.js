/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-17
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    require('js/localStorage');
    window.background = chrome.extension.getBackgroundPage();

    var backbone = require('backbone');
    var _ = require('underscore');
    var $ = jQuery = require('jquery');
    var bootstrap = require('bootstrap');

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

        // 番茄数
        tomatoCount: 0,

        // 土豆数
        todoCount: 0,

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

        // 创建一个土豆
        createTodo: function(e){

            if(e.which === 13){

                var value = this.$input.val().trim();

                if(value){

                    this._todoColl.create(this._newTodo(value), {wait: true});
                }

                this.$input.val('');
            }
        },

        // 添加一个土豆
        addTodo: function(todo){

            var view = new todoView({model: todo});

            if(todo.get('status') > 0){

                view.todoComplete();
            } else {

                this.todoCount++;
            }

            $('#todo-list').prepend(view.render().el);

            if(background.tomatoTime.currentTomato){

                var t = background.tomatoTime.currentTomato;

                if(t.model.get('id') === todo.get('id') && todo.get('status') === 0){

                    view.restoreStart();

                    if(background.tomatoTime.isTimeout){

                        view.model.set(
                            {tomato: (t.model.get('tomato') + 1)},
                            {silent: true});

                        view.updateTomato();

                        view.restoreDefault();
                    }
                }
            } else {

                view.restoreDefault();
            }

            this.setBadgeText();
        },

        // 加载当天所有土豆
        addAllTodo: function(){

            this.todoCount = 0;

            $('#todo-list').empty();

            this._todoColl.each(this.addTodo, this);

            this.getTodayTomato();
        },

        // 设置图标上番茄个数
        setBadgeText: function(){

            chrome.browserAction.setBadgeText({
                text: this.todoCount.toString()+':'+this.tomatoCount.toString()
            });
        },

        // 设置当前番茄时间
        setTomatoTime: function(min, sec){

            var $timer = $('.timer');

            $timer.html(utility.stringFormat('{0}:{1}',
                checkTime(min), checkTime(sec)));

            if(min === 1 || background.tomatoTime.isTimeout){

                this.tomatoCount++;

                $timer.html('00:00');

                this.addAllTodo();
            }

            function checkTime(t) {
                if(t < 10) t = '0' + t;
                return t;
            }
        },

        // 放弃当前番茄
        waiverTomato: function(){

            if(background.tomatoTime){

                background.tomatoTime.stopTomato();
            }

            if(background.tomatoTime.currentTomato){

                background.tomatoTime.currentTomato.restoreDefault();
            }
        },

        // 获取当天以使用番茄数
        getTodayTomato: function(){

            var that = this;

            window.dbHelper.getTodayTomato(function(results){

                if(results.rows.item(0).tomato){

                    that.tomatoCount = results.rows.item(0).tomato;

                    that.$('.today-tomato').html('今天共用了 ' + that.tomatoCount + ' 个番茄');
                }
            });
        },

        render: function(){

            this.getTodayTomato();

            this._todoColl.fetch({reset: true});

            this.setTomatoTime(0, 0);
        }
    });

    window.main = new mainView();

    main.render();
});