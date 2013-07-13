/*global define */
define(['jquery'], function ($) {
    'use strict';
    var self = {};
    var VIEWPORT = '.viewport';

    self.load = function() {
      $('.media').on('click', function() {
        var id = $(this).data('id');
        $(VIEWPORT).load('/templates/views/blocks/'+id+'/view.html');
      });
    }

    return self;
});