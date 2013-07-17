require.config({
    paths: {
        //Libraries
        eve: '../bower_components/eve-adobe/eve',
        raphael: '../bower_components/raphael/raphael',
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        //Loader
        loader: 'config/loader',
        //Animations
        growingchart: 'animations/growingchart'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        raphael: {
            deps: ['eve'],
            exports: 'Raphael'
        }
    }
});

require(
    [
    'app',
    ], function (app) {
    'use strict';
});
