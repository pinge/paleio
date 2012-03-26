define([

    "jquery", "underscore", "backbone",
    "paleio/collections/users",
    "paleio/views/settings/users/show_view",
    "paleio/views/settings/users/new_view",
    "text!templates/settings/users/index.html"

], function(jquery, underscore, backbone, Users, SettingsUserView, NewSettingsUserView, indexSettingsUsersTemplate) {

    return Backbone.View.extend({

        accountUsers: null,

        defaults: {

        },

        events: {

            'click .new_user_invitation':           'newUserInvitation'

        },

        newUserInvitation: function (event) {
            var v = new NewSettingsUserView({ users: this.accountUsers });
            v.render();
            event.preventDefault();
        },

        initialize: function () {
            this.accountUsers = new Users();
            this.accountUsers.url = '/accounts/'+ App.user.get('account').id +'/users.json';
            this.accountUsers.on('add', this.addOne, this);
            this.accountUsers.on('reset', this.addAll, this);
        },

        render: function(){
            var template = _.template(indexSettingsUsersTemplate, {});
            $(this.el).html(template);
            this.accountUsers.fetch();
            return this;
        },

        addAll: function (collection) {
            var thiz = this;
            _.each(collection.models, function (user) {
                thiz.addOne(user);
            });
        },

        addOne: function (model) {
            var view = new SettingsUserView({ model: model });
            $(this.el).find('.settings_users_index').append(view.el);
            view.render();
        }

    });

});
