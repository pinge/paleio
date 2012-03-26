define([

    "jquery", "underscore", "backbone",
    "paleio/views/home_view",
    "paleio/views/channels/show_view",
    "paleio/views/settings/show_view"

], function(jquery, underscore, backbone, HomeView, ShowChannelView, SettingsView) {

    return Backbone.Router.extend({

        publicRoutes: [''], // accessible public routes are used for redirection in sign in and sign out
        view: null,

        routes: {

            "":                                "index",
            "channels/:channel":               "enterChannel",
            "settings":                        "showSettings",
            "*actions":                        "index"

        },

        index: function( actions ){
            var view = new HomeView();
            $(AppView.el).children('.container').html(view.el);
            view.render();
        },

        enterChannel: function (channelCode) {
            if (!App.user.loggedIn){ Backbone.history.navigate("", true); return false; }
            var thiz = this;
            App.user.channels.fetch({
                success: function(collection, response){
                    if (!_.isNull(thiz.view)){
                        thiz.view.remove();
                        $('body > .navbar').after($('<div>').addClass('container'));
                    }
                    var channel = _.detect(collection.models, function(m){ return m.get('code') == channelCode; });
                    thiz.view = new ShowChannelView({ model: channel });
                }
            });
        },

        showSettings: function () {
            if (!App.user.loggedIn){ Backbone.history.navigate("", true); return false; }
            if (!_.isNull(this.view)){ this.view.remove(); $('body > .navbar').after($('<div>').addClass('container')); }
            var view = new SettingsView();
            $('body > .container').html(view.el);
            view.render();
        }

    });

});
