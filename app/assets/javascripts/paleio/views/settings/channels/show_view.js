define([

    "jquery", "underscore", "backbone",
    "text!templates/settings/channels/show.html"

], function(jquery, underscore, backbone, settingsChannelTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_settings_channel',

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(settingsChannelTemplate, { model: this.model });
            $(this.el).html(template);
            return this;
        }

    });

});
