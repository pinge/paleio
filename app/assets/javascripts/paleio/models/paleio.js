define([

    "jquery", "underscore", "backbone",
    "paleio/models/current_user"

], function(jquery, underscore, backbone, CurrentUser) {

    return Backbone.Model.extend({

        relations: [
            {
                type: Backbone.HasOne,
                key: 'user',
                relatedModel: CurrentUser,
                reverseRelation: {
                    type: Backbone.HasOne,
                    key: 'app'
                }
            }
        ],

        router: null,
        view: null,

        url: "/bootstrap.json",

        defaults: {
        },

        initialize: function () {
//            window.App = this; // this way the CurrentUser and AppView already have App available
            this.user = new CurrentUser(); // initialize current user for event binding (model attributes are present in the bootstrap data)
        },

        fetch: function (options) {
//            var success = options.success;
            var model = this;
            Backbone.Model.prototype.fetch.call(this, { // call super()
                success: function(resp, status, xhr) {
//                    if (success){ success(model, resp); }
                    if (!model.set(model.parse(resp, xhr), options)) { return false; }
                    model.user.url = model.get('resources').createSessionURL; // url for authentication can only be made after bootstrap
                    model.user.set(model.get('currentUser')); // set current user from bootstrap data
                    Backbone.history.start(); // Initiate a new history for back button usability
                }
            });
        }

    });

});
