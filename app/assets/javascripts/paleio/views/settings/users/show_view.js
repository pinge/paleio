define([

    "jquery", "underscore", "backbone",
    "text!templates/settings/users/show.html"

], function(jquery, underscore, backbone, settingsUserTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_settings_user',

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(settingsUserTemplate, { model: this.model });
            $(this.el).html(template);
            return this;
        }

    });

});
