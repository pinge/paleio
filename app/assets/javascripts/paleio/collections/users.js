define([

    "jquery", "underscore", "backbone",
    "paleio/models/user"

], function(jquery, underscore, backbone, User) {

    return Backbone.Collection.extend({

        model: User,

    });

});
