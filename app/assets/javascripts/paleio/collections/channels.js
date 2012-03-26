define([

    "jquery", "underscore", "backbone",
    "paleio/models/channel"

], function(jquery, underscore, backbone, Channel) {

    return Backbone.Collection.extend({

        model: Channel,

        defaults: {
        },

        initialize: function(){
            this.url = App.get('resources').indexChannelsURL;
        }

    });

});
