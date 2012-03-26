define([

    "jquery", "underscore", "backbone",
    "paleio/collections/channels",
    "paleio/views/settings/channels/show_view",
    "paleio/views/settings/channels/new_view",
    "text!templates/settings/channels/index.html"

], function(jquery, underscore, backbone, Channels, SettingsChannelView, NewSettingsChannelView, indexSettingsChannelsTemplate) {

    return Backbone.View.extend({

        accountChannels: null,

        defaults: {

        },

        events: {

            'click .new_channel':           'newChannel'

        },

        newChannel: function (event) {
            var v = new NewSettingsChannelView({ channels: this.accountChannels });
            v.render();
            event.preventDefault();
        },

        initialize: function () {
            this.accountChannels = new Channels();
            this.accountChannels.url = '/accounts/'+ App.user.get('account').id +'/channels.json';
            this.accountChannels.on('add', this.addOne, this);
            this.accountChannels.on('reset', this.addAll, this);
        },

        render: function(){
            var template = _.template(indexSettingsChannelsTemplate, {});
            $(this.el).html(template);
            this.accountChannels.fetch();
            return this;
        },

        addAll: function (collection) {
            var thiz = this;
            _.each(collection.models, function (channel) {
                thiz.addOne(channel);
            });
        },

        addOne: function (model) {
            var view = new SettingsChannelView({ model: model });
            $(this.el).find('.settings_channels_index').append(view.el);
            view.render();
        }

    });

});
