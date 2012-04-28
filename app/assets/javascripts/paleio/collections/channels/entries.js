define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry", "paleio/models/channels/entry/text", "paleio/models/channels/entry/code",
    "paleio/models/channels/entry/join", "paleio/models/channels/entry/file"

], function(jquery, underscore, backbone, Entry, TextEntry, CodeEntry, JoinEntry, FileEntry) {

    return Backbone.Collection.extend({

        model: Entry,

        defaults: {
        },

        initialize: function () {
            _.extend(this, this.options);
        },

        lastShownStatusBefore: function (entry) {
            var now = moment().valueOf();
            for (var i = _.indexOf(this.models, entry) - 1; i >= 0; i--) {
                if (_.isUndefined(this.models[i].hideNick) || _.isNull(this.models[i].hideNick) || !this.models[i].hideNick) {
                    return this.models[i];
                }
            }
            return null;
        },

        // Use function to create models on collections - pull request #1148 https://github.com/documentcloud/backbone/pull/1148/files
        createModel: function(attrs, options) {
            if (attrs.type === "text") {
                return new TextEntry(attrs, options);
            } else if (attrs.type === "code") {
                return new CodeEntry(attrs, options);
            } else if (attrs.type === "join") {
                return new JoinEntry(attrs, options);
            } else if (attrs.type === "file") {
                return new FileEntry(attrs, options);
            } else {
                throw new Error("Bad type: " + attrs.type);
            }
        }

    });

});
