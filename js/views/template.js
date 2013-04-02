/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-19
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){

    var backbone = require('backbone');
    var _ = require('underscore');

    var template = backbone.View.extend({

        initialize: function(options){

            this._regEvents();

            // 加载模板页
            $('#theFrame').attr({src: '../tpl/template.html'});
        },

        // 事件注册
        _regEvents: function(){

            var that = this;
            // 注册模板页消息事件
            window.onmessage = function(e){

                that.trigger('receiveTemplate', e.data);
            };
        },

        // 请求模板页
        getTemplate: function(templateName, data){

            var iframe = document.getElementById('theFrame');
            var message = {
                name: templateName,
                context: data
            };
            iframe.contentWindow.postMessage(message, '*');
        }
    });

    module.exports = template;
});