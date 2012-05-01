define([

    "jquery", "underscore", "backbone",
    "paleio/collections/channels",
    "paleio/views/channels/show_view",
    "text!templates/channels/index.html"

], function(jquery, underscore, backbone, Channels, ShowChannelView, channelsTemplate) {

    return Backbone.View.extend({

        tagName: 'ul',
        className: 'nav',

        channels: null,

        defaults: {

        },

        events: {

        },

        render: function(){
            var url = Backbone.history.fragment;
            var template = _.template(channelsTemplate, { channels: this.channels.models, active: url });
            $(this.el).html(template);
            $(this.el).find('.nav li a[href="#'+url+'"]').closest('li').addClass('active');
            $(this.el).find('.tab-content .tab-pane#'+url+'').addClass('active');
            var channel = _.detect(this.channels.models, function(c){ return c.get('code') == url; });
            if (channel){
                var channelView = new ShowChannelView({ model: channel });
                $(this.el).find('.tab-content .tab-pane#'+url+'').html(channelView.el);
                channelView.render();
            }
            return this;
        },

        initialize: function(){
            this.channels = new Channels();
            this.channels.on('reset', this.render, this);
        }

    });

});
