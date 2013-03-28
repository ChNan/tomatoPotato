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

        triggerList: {

            receive: 'receiveTemplate'
        },

        initialize: function(options){

            this._regEvents();

            _.extend(this, backbone.Events);

            this._loadTemplatePage();
        },

        _regEvents: function(){

            var that = this;
            window.onmessage = function(e){

                that.trigger(that.triggerList.receive, e.data);
            };
        },

        _loadTemplatePage: function(){

            $('#theFrame').attr({src: '../tpl/template.html'});
        },

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