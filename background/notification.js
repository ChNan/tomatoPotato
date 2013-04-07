/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-18
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    exports.message = function(todo){

        if (window.webkitNotifications) {

            if (window.webkitNotifications.checkPermission() == 0) {

            var notification_test = window.webkitNotifications.createNotification(
                "http://png-3.findicons.com/files/icons/1696/once/48/mail.png",
                '番茄时间到啦，休息一下吧！',
                '土豆：' + todo
            );

            notification_test.display = function() {};
            notification_test.onerror = function() {};
            notification_test.onclose = function() {};
            notification_test.onclick = function() {
                this.cancel();
            };

            notification_test.replaceId = 'Meteoric';

            notification_test.show();

//                var tempPopup = window.webkitNotifications.createHTMLNotification(["http://www.baidu.com/"]);
//                tempPopup.replaceId = "Meteoric_cry";
//                tempPopup.show();
            } else {
                window.webkitNotifications.requestPermission(message);
            }
        }
    };
});