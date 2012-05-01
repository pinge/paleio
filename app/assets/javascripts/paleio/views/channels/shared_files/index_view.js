define([

    "jquery", "underscore", "backbone",
    "order!paleio/models/channels/entry/file",
    "order!paleio/collections/channels/entries",
    "order!paleio/views/channels/shared_files/show_view",
    "text!templates/channels/shared_files/index.html"

], function (jquery, underscore, backbone, FileEntry, FileEntries, ChannelSharedFileView, indexChannelSharedFilesTemplate) {

    return Backbone.View.extend({

        tagName: 'tbody',

        collection: null,

        defaults: {

        },

        events: {

        },

        initialize: function () {
            this.collection.on('add', this.addOne, this);
            this.collection.on('reset', this.render, this);
        },

        render: function () {
            var thiz = this;
            var template = _.template(indexChannelSharedFilesTemplate, {});
            $(this.el).html(template);
            _.each(this.collection.models, function (file) { thiz.addOne(file); });
            return this;
        },

        addOne: function (file) {
            var view = new ChannelSharedFileView({ model: file });
            $(this.el).append(view.el);
            view.render();
        }

    });

});
