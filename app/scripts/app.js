/*global define */
define(
  [
    'loader',
    'growingchart',
    'Football'
  ],
  function( l, g, f ) {
    'use strict';
    l.init({
        "growingchart": g,
        "Football": f
    });
  }
);