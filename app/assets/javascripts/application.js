// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//

require.config({
    paths: {
        jquery: '/assets/jquery',
        underscore: '/assets/underscore',
        backbone: '/assets/backbone',
        bootstrap: '/assets/bootstrap',
        templates: "/assets/templates/paleio"
    }
});

require([

    'order!moment', 'order!json2', 'order!jquery', 'order!underscore', 'order!backbone', 'order!bootstrap', 'order!highlight',
    'order!paleio/models/paleio', 'order!paleio/views/paleio_view'

], function(moment, JSON, jQuery, underscore, backbone, bootstrap, highlight, PaleioApplication, PaleioApplicationView){ // ensures jQuery is loaded first

//    twitter bootstrap initialization
    (function() {
        $(function() { return $("body > .topbar").scrollspy(); });
        $(function() { return $(".tabs").tab(); });
//        $(function() { return $("a[rel=twipsy]").twipsy({ live: true }); });
        $(function() { return $("a[rel=popover]").popover({ offset: 10 }); });
        $(function() { return $(".topbar-wrapper").dropdown(); });
        $(function() { return $(".alert-message").alert(); });
        $(function() {
            var domModal;
            domModal = $(".modal").modal({ backdrop: true, closeOnEscape: true });
            return $(".open-modal").click(function() { return domModal.toggle(); });
        });
    }).call(this);

    /* Update datepicker plugin so that MM/DD/YYYY format is used. */
//    $.extend($.fn.datepicker.defaults, {
//        parse: function (string) {
//            var matches;
//            if ((matches = string.match(/^(\d{2,2})\/(\d{2,2})\/(\d{4,4})$/))) {
//                return new Date(matches[3], matches[2], matches[1]);
//            } else {
//                return null;
//            }
//        },
//        format: function (date) {
//            var
//                month = (date.getMonth() + 1).toString(),
//                dom = date.getDate().toString();
//            if (month.length === 1) {
//                month = "0" + month;
//            }
//            if (dom.length === 1) {
//                dom = "0" + dom;
//            }
//            return dom + "/" + month + "/" + date.getFullYear();
//        }
//    });

    // Rails CSRF authenticity token implementation in jQuery.ajax calls
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (settings.crossDomain) return;    // just because the auth_token is a private information
            if (settings.type == "GET") return;  // no need
            var token = $('meta[name="csrf-token"]').attr('content');  // get csrf-token from head
            if (token) { xhr.setRequestHeader('X-CSRF-Token', token); }  // set csrf token
        }
    });

    $(document).ready(function(){
        window.App = new PaleioApplication();
        window.AppView = new PaleioApplicationView({ model: App });
        AppView.render();
    });

});
