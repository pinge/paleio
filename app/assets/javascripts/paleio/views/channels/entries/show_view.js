define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry",
    "text!templates/channels/entries/show.html"

], function(jquery, underscore, backbone, ChannelEntry, channelEntryemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_channel_entry',

        defaults: {

        },

        events: {

        },

        render: function(){
            var thiz = this;
            var template = _.template(channelEntryemplate, { model: this.model });
            $(this.el).html(template);
            $(this.el).find('td').fadeIn('slow', function(){
                if (thiz.model.get('is_code')) {
                    $(thiz.el).find('pre code').each(function(i, e) { hljs.highlightBlock(e, '    ')});
                }
            });
            return this;
        }

    });

});
