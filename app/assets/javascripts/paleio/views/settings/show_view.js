define([

    "jquery", "underscore", "backbone",
    "paleio/views/settings/channels/index_view",
    "paleio/views/settings/users/index_view",
    "text!templates/settings/show.html"

], function(jquery, underscore, backbone, IndexSettingsChannelsView, IndexSettingsUsersView, settingsTemplate) {

    return Backbone.View.extend({

        className: 'settings',

        defaults: {

        },

        events: {

        },

        render: function(){
            var template = _.template(settingsTemplate, {});
            $(this.el).html(template);
            var channelsView = new IndexSettingsChannelsView();
            $(this.el).find('.channels').html(channelsView.el);
            channelsView.render();
            var usersView = new IndexSettingsUsersView();
            $(this.el).find('.users').html(usersView.el);
            usersView.render();
            $(this.el).children('.row-fluid').fadeIn('fast');
            return this;
        }

    });

});
