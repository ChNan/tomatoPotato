/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-18
 * Time: 下午9:55
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    var message = function(){

        if (window.webkitNotifications) {

            if (window.webkitNotifications.checkPermission() == 0) {

//            var notification_test = window.webkitNotifications.createNotification(
//                "http://images.cnblogs.com/cnblogs_com/flyingzl/268702/r_1.jpg",
//                '标题',
//                '内容'+new Date().getTime()
//            );
//
////            notification_test.display = function() {}
////            notification_test.onerror = function() {}
////            notification_test.onclose = function() {}
//            notification_test.onclick = function() {
//                this.cancel();
//            };
//
//            notification_test.replaceId = 'Meteoric';
//
//            notification_test.show();

                var tempPopup = window.webkitNotifications.createHTMLNotification(["http://www.baidu.com/"]);
                tempPopup.replaceId = "Meteoric_cry";
                tempPopup.show();
            } else {
                window.webkitNotifications.requestPermission(message);
            }
        }
    };

    exports.showMessage = message;
});