/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-26
 * Time: 下午10:45
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var time = require('background/tomato-time');
    var msg = require('background/notification');
    var _ = require('underscore');

    window.tomatoTime = new time();

     // 设置当前番茄时间
    tomatoTime.on(tomatoTime.triggerList.timeChange, function(t){

        setMainTime(t.min, t.sec);
    });

    tomatoTime.on(tomatoTime.triggerList.timeStop, function(t){

        setMainTime(0, 0);
    });

    tomatoTime.on(tomatoTime.triggerList.timeout, function(t){

        msg.message(tomatoTime.currentTomato.model.get('todo'));
    });

    // 设置主页时间
    function setMainTime(min, sec){

        var views = chrome.extension.getViews({type:'popup'});

        if(views && views.length > 0){

            views[0].main.setTomatoTime(min, sec);
        }
    }
});


