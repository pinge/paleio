define([

    "jquery", "underscore", "backbone",
    "paleio/models/input"

], function(jquery, underscore, backbone, Input) {

    return Backbone.Collection.extend({

        model: Input,

        defaults: {
        },

        initialize: function(){
            _.extend(this, this.options);
        }

    });

});
