/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-26
 * Time: 下午10:45
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var time = require('background/tomato-time');

    window.tomatoTime = new time();

     // 设置当前番茄时间
    tomatoTime.on(tomatoTime.triggerList.timeChange, function(t){

        var views = chrome.extension.getViews({type:'popup'});

        if(views){

            views[0].main.setTomatoTime(t.time);
        }
    });


});


