/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-26
 * Time: 下午8:54
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var backbone = require('backbone');
    var _ = require('underscore');

    var tomatoTime = backbone.View.extend({

        min: 0,

        sec: 0,

        triggerList: {

            timeout: 'tomatoTime:timeout',
            timeChange: 'tomatoTime:change',
            timeStop: 'tomatoTime:stop'
        },

        initialize: function () {

            _.extend(this, backbone.Events);
        },

        _setTime: function (sec) {

            if (sec && _.isNumber(sec) && sec <= 60) {

                this.sec += sec;

                if (this.sec === 60) {

                    this.sec = 0;
                    this.min += 1;
                }
            }

            if (this.min === 1) {

                this.trigger(this.triggerList.timeout, this);

                this.stopTomato();
            }
        },

        startTomato: function(){

            var that = this;

            if(!this._timeInterval){

                this._timeInterval = setInterval(function () {

                    that._setTime(1);

                    that.trigger(that.triggerList.timeChange, that);
                }, 1000);
            }
        },

        stopTomato: function(){

            window.clearInterval(this._timeInterval);

            this._timeInterval = null;

            this.trigger(this.triggerList.timeStop, this);

            this.min = this.sec = 0;
        }
    });

    module.exports = tomatoTime;
});