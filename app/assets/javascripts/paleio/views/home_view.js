define([

    "jquery", "underscore", "backbone",
    "text!templates/home.html"

], function(jquery, underscore, backbone, homeTemplate) {

    return Backbone.View.extend({

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(homeTemplate, {});
            $(this.el).html(template);
            return this;
        }

    });

});
