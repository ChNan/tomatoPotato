/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-30
 * Time: 下午5:18
 * To change this template use File | Settings | File Templates.
 */

window.background = chrome.extension.getBackgroundPage();

define(function(require, exports, module){

    var backbone = require('backbone');
    var template = require('js/views/template');

    var todoView = backbone.View.extend({

        tagName: 'li',

        _template: new template(),

        events: {
            'click .todo-play-destroy': 'startTomato',
            'dblclick label': 'editTodo',
            'keypress .edit': 'updateTodo',
            'blur .edit': 'editComplete'
        },

        initialize: function(){

            this.listenTo(this.model, 'sync', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this._template, 'receiveTemplate', this._renderTemplate);
        },

        _renderTemplate: function(data){

            this.trigger('renderView', data.html);

            this.$input = this.$('.edit');
        },

        startTomato: function(){

            if(background.tomatoTime){

                background.tomatoTime.startTomato();
            }
        },

        editTodo: function(){

            this.$el.addClass('editing');

            this.$input.focus();
        },

        updateTodo: function(e){

            if(e.which === 13){

                this.editComplete();
            }
        },

        editComplete: function(){

            var value = this.$input.val().trim();

            if(value){

                this.model.set({todo: value}, {silent: true});

                this.model.save(this.model.toJSON(), {silent: false, wait: true});
            } else {

                this.remove();
            }

            this.$el.removeClass('editing');
        },

        remove: function(){

            this.model.destroy({wait: true});
        },

        render: function(){

            this._template.getTemplate('todo', this.model.toJSON());

            return this;
        }
    });

    module.exports = todoView;
});