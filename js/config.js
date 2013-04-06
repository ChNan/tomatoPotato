/**
 * Created with JetBrains WebStorm.
 * User: linjun
 * Date: 13-3-18
 * Time: 下午9:19
 * To change this template use File | Settings | File Templates.
 */
seajs.config({

    plugins: ['shim'],

    alias: {
        'underscore': {
            src: 'lib/underscore-min.js',
            exports: '_'
        },
        'jquery': {
            src: 'lib/jquery-1.9.1.min.js',
            exports: 'jQuery'
        },
        'backbone': {
            src: 'lib/backbone-min.js',
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        },
        'mustache': {
            src: 'lib/mustache.js',
            exports: 'Mustache'
        },
        'bootstrap': 'lib/bootstrap.min.js'
    }
});