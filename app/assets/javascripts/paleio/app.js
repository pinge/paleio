define([

    "jquery", "underscore", "backbone",
    "paleio/router",
    "paleio/views/app_view",
    "paleio/models/current_user"

], function(jquery, underscore, backbone, Router, AppView, CurrentUser) {

    return Backbone.Model.extend({

        router: null,
        view: null,
        user: null,


        url: "/bootstrap.json",

        defaults: {
        },

        initialize: function () {
            window.App = this; // this way the CurrentUser and AppView already have App available
            this.user = new CurrentUser(); // initialize current user for event binding (model attributes are present in the bootstrap data)
            this.view = new AppView({ model: this });
            $('body').html(this.view.el);
            this.router = new Router();
        },

        fetch: function (options) {
            var success = options.success;
            var model = this;
            Backbone.Model.prototype.fetch.call(this, {
                success: function(resp, status, xhr) {
                    if (!model.set(model.parse(resp, xhr), options)) return false;
                    model.user.url = model.get('resources').createSessionURL; // url for authentication can only be made after bootstrap
                    model.user.set(model.get('currentUser')); // set current user from bootstrap data
                    if (success) success(model, resp);
                }
            }); // call super()
        }

    });

});
