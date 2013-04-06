/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-30
 * Time: 下午5:18
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var backbone = require('backbone');
    var mustache = require('mustache');

    var todoView = backbone.View.extend({

        tagName: 'li',

        _pending: false,

        events: {
            'click .todo-play': 'startOrCompletedTomato',
            'click .todo-destroy': 'remove',
            'mouseover .view': 'displayIcon',
            'mouseout .view': 'displayIcon',
            'dblclick label': 'editTodo',
            'keypress .edit': 'updateTodo',
            'blur .edit': 'editComplete'
        },

        initialize: function(options){

            this.listenTo(this.model, 'sync', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        displayIcon: function(){

            if(!this._pending){

                this.$('.todo-play').toggleClass('icon-play');
                this.$('.todo-destroy').toggleClass('icon-remove');
            }
        },

        editTodo: function(){

            this.$el.addClass('editing');

            this.$('.edit').focus();
        },

        updateTodo: function(e){

            if(e.which === 13){

                this.editComplete();
            }
        },

        editComplete: function(){

            var value = this.$('.edit').val().trim();

            if(value){

                this.model.set({todo: value}, {silent: true});

                this.model.save(this.model.toJSON(), {silent: false, wait: true});
            } else {

                this.remove();
            }

            this.$el.removeClass('editing');
        },

        startOrCompletedTomato: function(){

            if(this.$('.todo-play').attr('class').indexOf('icon-play') > -1){

                this.todoStart();
            } else {

                this.todoComplete();
            }
        },

        todoStart: function(){

            if(background.tomatoTime.currentTomato) return;

            if(background.tomatoTime){

                background.tomatoTime.startTomato();

                background.tomatoTime.currentTomato = this;
            }

            this.$el.addClass('start-tomato');

            this.$('.todo-play').removeClass('icon-play').addClass('icon-ok');

            this._pending = true;
        },

        todoComplete: function(){

            if(background.tomatoTime){

                background.tomatoTime.stopTomato();

                background.tomatoTime.currentTomato = null
            }

            this.$el.removeClass('start-tomato').addClass('completed');

            this.$('.todo-play').removeClass('icon-ok');

            this.$('.todo-destroy').removeClass('icon-remove');

            this.undelegateEvents();

            this.model.set({status: 1}, {silent: true});

            this.model.save(this.model.toJSON(), {silent: false, wait: true});

            this._pending = true;
        },

        restoreStart: function(){

            this.$el.addClass('start-tomato');

            this.$('.todo-play').addClass('icon-ok');

            this.$('.todo-destroy').addClass('icon-remove');

            this._pending = true;
        },

        restoreDefault: function(){

            this.$el.removeClass('start-tomato');

            this.$('.todo-play').removeClass('icon-ok');

            this.$('.todo-destroy').removeClass('icon-remove');

            this._pending = false;

            if(background.tomatoTime){

                background.tomatoTime.currentTomato = null
            }
        },

        updateTomato: function(){

            this.model.save(this.model.toJSON(), {silent: false, wait: true});
        },

        remove: function(){

            this.model.destroy({wait: true});

            if(background.tomatoTime.currentTomato &&
                background.tomatoTime.currentTomato.model.get('id') === this.model.get('id')){

                background.tomatoTime.stopTomato();

                background.tomatoTime.currentTomato = null;
            }
        },

        render: function(){

            this.$el.html(mustache.render(require('tpl/todo-template'), this.model.toJSON()));

            return this;
        }
    });

    module.exports = todoView;
});