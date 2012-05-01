define([

    "jquery", "underscore", "backbone",
    "text!templates/ui/alert.html"

], function(jquery, underscore, backbone, alertTemplate) {

    return Backbone.View.extend({

        tagName: 'div',
        className: '_alert_view',

        defaults: {
            type: null,
            message: "no message set",
            result: ""
        },

        events: {

            'click .close':             'close'

        },

        close: function(){
            this.remove()
        },

        render: function(){
            var template = _.template(alertTemplate, this.defaults);
            $(this.el).html(template);
            return this;
        },

        initialize: function(){
            _.extend(this.defaults, this.options);
            this.render();
        }

    });

});
