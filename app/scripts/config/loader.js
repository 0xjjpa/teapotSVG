define(['jquery'], function ($) {
    'use strict';
    var self = {};
    self.currentModule = null;
    var VIEWPORT = '.viewport';

    self.init = function(modules) {
      $('.media').on('click', function() {
        var id = $(this).data('id');
        $(VIEWPORT).html($("#"+id).html());
          console.log($("#"+id).html());
        if(modules[id]) modules[id].init();
      });
    }

    return self;
});