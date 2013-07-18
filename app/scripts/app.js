/*global define */
define(
  [
    'loader',
    'growingchart',
    'Football'
  ],
  function( l, g, f ) {
    'use strict';
      console.log(l, g, f);
    l.init({
        "growingchart": g,
        "Football": f
    });
  }
);