define([

    "jquery", "underscore", "backbone",
    "paleio/router",
    "paleio/views/header/show_view",
    "text!templates/paleio.html"

], function(jquery, underscore, backbone, Router, HeaderView, paleioApplicationTemplate) {

    return Backbone.View.extend({

        el: $('body'), // exception for application view.. el should always be set outside the view

        router: null,

        currentView: null,

        events: {

        },

        user: function () { return this.model },

        initialize: function(){
            this.router = new Router();
        },

        render: function(){
            var template = _.template(paleioApplicationTemplate, { model: this.model });
            $(this.el).html(template);
            var headerView = new HeaderView({ model: this.model });
            $(this.el).children('.navbar').html(headerView.el);
            this.model.fetch();
            return this;
        }

    });

});
