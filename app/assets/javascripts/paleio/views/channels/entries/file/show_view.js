define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry/file",
    "text!templates/channels/entries/file/show.html"

], function(jquery, underscore, backbone, FileEntry, fileEntryTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_channel_entry file',

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(fileEntryTemplate, { model: this.model });
            $(this.el).html(template);
            return this;
        }

    });

});
