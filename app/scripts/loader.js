/*global define */
define(['jquery'], function ($) {
    'use strict';
    var self = {};
    var VIEWPORT = '.viewport';

    self.load = function() {
      console.log("LOaded..")
      $('.media').on('click', function() {
        var id = $(this).data('id');
        console.log(id);
        $(VIEWPORT).load('/templates/views/blocks/'+id+'/view.html');
      });
    }

    return self;
});