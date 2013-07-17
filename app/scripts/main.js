require.config({
    paths: {
        eve: '../bower_components/eve-adobe/eve',
        raphael: '../bower_components/raphael/raphael',
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
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

require([
    'jquery', 'loader',
    'growingchart'
    ], function ($, b, l) {
    'use strict';
    console.log(arguments);
    l.init({
        "growingchart": 3
    });

});
