define([

    "jquery", "underscore", "backbone",
    "paleio/models/paleio", "paleio/models/current_user", "paleio/collections/channels"

], function(jquery, underscore, backbone, PaleioApplication, CurrentUser, Channels) {

    return Backbone.Model.extend({

        relations: [
            {
                type: Backbone.HasOne,
                key: 'user',
                relatedModel: CurrentUser,
                reverseRelation: {
                    type: Backbone.HasOne,
                    key: 'account'
                }
            },
            {
                type: Backbone.HasOne,
                key: 'app',
                relatedModel: PaleioApplication,
                reverseRelation: {
                    type: Backbone.HasOne,
                    key: 'account'
                }
            }
        ],

        channels: null, // this account channels collection

        url: 'accountzinpurlz',

        initialize: function () {
            this.on('change:id', this.initializeChannels, this);
        },

        initializeChannels: function () {
            this.channels = new Channels();
            if (this.id) {
                this.channels.url = '/accounts/'+ this.id +'/channels.json';
            }
        }

    });

});
