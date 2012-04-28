define([

    "jquery", "underscore", "backbone",
    "paleio/collections/channels",
    "text!templates/header/channels/index.html"

], function(jquery, underscore, backbone, Channels, indexChannelsHeaderTemplate) {

    return Backbone.View.extend({

        tagName: 'ul',
        className: 'nav',
        id: '_channels',

        channels: null,

        defaults: {

        },

        events: {

            'click .channel_list_item':         'changeChannel'

        },

        initialize: function(){
            App.account.channels.on('reset', this.render, this);
        },

        render: function(){
            var url = Backbone.history.fragment;
            var template = _.template(indexChannelsHeaderTemplate, { channels: App.account.channels.models, active: url });
            $(this.el).html(template);
            return this;
        },

        changeChannel: function (event) {
            var thiz = this;
            $(AppView.el).children('.container').children('.row-fluid').stop().fadeOut('fast', function () {
                $(thiz.el).find('.channel_list_item.active').removeClass('active');
                $(event.currentTarget).closest('li').addClass('active');
            })
        }

    });

});
