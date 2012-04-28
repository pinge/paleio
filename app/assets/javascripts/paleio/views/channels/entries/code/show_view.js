define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry/code",
    "text!templates/channels/entries/code/show.html"

], function(jquery, underscore, backbone, CodeEntry, codeEntryTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_channel_entry code',

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(codeEntryTemplate, { model: this.model });
            $(this.el).html(template);
            $(this.el).find('pre code').each(function(i, e) { hljs.highlightBlock(e, '    ')});
            return this;
        }

    });

});
