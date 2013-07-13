require.config({
    paths: {
        eve: '../bower_components/raphael-require/eve',
        'raphael-core': '../bower_components/raphael-require/raphael.core',
        'raphael-svg': '../bower_components/raphael-require/raphael.svg',
        'raphael-vml': '../bower_components/raphael-require/raphael.vml',
        'raphael': '../bower_components/raphael-require/raphael.amd',
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        raphael: {
            exports: 'Raphael'
        }
    }
});

require(['loader', 'jquery', 'bootstrap'], function (l, $) {
    'use strict';
    l.load();
});
