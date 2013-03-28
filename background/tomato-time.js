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

        _min: 0,

        _sec: 0,

        time: '00:00',

        triggerList: {

            timeout: 'tomatoTime:timeout',
            timeChange: 'tomatoTime:change'
        },

        initialize: function () {

            _.extend(this, backbone.Events);
        },

        _setTime: function (sec) {

            if (sec && _.isNumber(sec) && sec <= 60) {

                this._sec += sec;

                if (this._sec === 60) {

                    this._sec = 0;
                    this._min += 1;
                }
            }

            if (this._min === 25) {

                this.trigger(this.triggerList.timeout, this);

                this.stopTomato();
            }

            this.time = checkTime(this._min) + ':' + checkTime(this._sec);

            function checkTime(t) {

                if(t < 10){
                    t = '0' + t;
                }

                return t;
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

            this._min = this._sec = 0;
        },

        render: function () {

        }
    });

    module.exports = tomatoTime;
});