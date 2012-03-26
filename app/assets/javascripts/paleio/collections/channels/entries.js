define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry"

], function(jquery, underscore, backbone, Entry) {

    return Backbone.Collection.extend({

        model: Entry,

        defaults: {
        },

        initialize: function(){
            _.extend(this, this.options);
        }

    });

});
