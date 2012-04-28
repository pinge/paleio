define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry/text",
    "text!templates/channels/entries/text/show.html"

], function(jquery, underscore, backbone, TextEntry, textEntryTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_channel_entry text',

        defaults: {
        },

        events: {

        },

        render: function(){
            var thiz = this;
            var template = _.template(textEntryTemplate, { model: this.model });
            $(this.el).html(template);
            return this;
        }

    });

});
