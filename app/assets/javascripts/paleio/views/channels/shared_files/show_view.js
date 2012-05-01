define([

    "jquery", "underscore", "backbone",
    "order!paleio/models/channels/entry/file",
    "text!templates/channels/shared_files/show.html"

], function (jquery, underscore, backbone, FileEntry, channelSharedFilesTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',

        defaults: {

        },

        events: {

        },

        render: function () {
            var template = _.template(channelSharedFilesTemplate, { model: this.model });
            $(this.el).html(template);
            return this;
        }

    });

});
