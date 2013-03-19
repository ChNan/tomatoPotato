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
        },

        _regEvents: function(){

            var that = this;
            window.onmessage = function(e){

                that.trigger(that.triggerList.receive, e.data);
            };
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