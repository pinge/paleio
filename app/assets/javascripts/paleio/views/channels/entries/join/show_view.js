define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entries/join",
    "text!templates/channels/entries/join/show.html"

], function(jquery, underscore, backbone, JoinEntry, joinEntryTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_channel_entry join',

        defaults: {

        },

        events: {

        },

        render: function(){
            var thiz = this;
            var template = _.template(joinEntryTemplate, { model: this.model });
            $(this.el).html(template);
            return this;
        }

    });

});
