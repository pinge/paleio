define([

    "jquery", "underscore", "backbone",
    "text!templates/about.html"

], function(jquery, underscore, backbone, aboutTemplate) {

    return Backbone.View.extend({

        el: 'body > .container',

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(aboutTemplate);
            $(this.el).html(template);
            return this;
        },

        initialize: function(){
            this.render();
        }

    });

});
