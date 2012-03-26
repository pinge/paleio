define([

    "jquery", "underscore", "backbone"

], function(jquery, underscore, backbone) {

    return Backbone.Model.extend({

        initialize: function(){
            this.url = App.get('resources').createUserURL;
        }

    });

});
