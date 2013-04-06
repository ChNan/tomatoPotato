/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-24
 * Time: 下午9:03
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var _ = require('underscore');

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    exports.getGUID = function(){

        // Generate four random hex digits.
        function random(){

            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }

        return (random()+random()+"-"+random()+"-"+random()+"-"+
                random()+"-"+random()+random()+random());
    };

    exports.getDatetime = function(){

        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();

        return exports.stringFormat('{0}-{1}-{2} {3}:{4}:{5}',
            year, checkTime(month), checkTime(day), checkTime(h), checkTime(m), checkTime(s));

        function checkTime(t) {

            if(t < 10){
                t = '0' + t;
            }

            return t;
        }
    };

    //格式化字符串，format('string format {0}','ok');
    exports.stringFormat = function() {

        if( arguments.length === 0 ){

            return null;
        }

        var str = arguments[0];

        for(var i = 1, length = arguments.length; i < length; i++) {

            var re = new RegExp('\\{' + (i-1) + '\\}','gm');

            str = str.replace(re, arguments[i]);
        }

        return str;
    };
});