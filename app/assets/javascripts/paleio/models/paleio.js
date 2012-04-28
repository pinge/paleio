define([

    "jquery", "underscore", "backbone",
    "paleio/models/current_user", "paleio/models/account"

], function(jquery, underscore, backbone, CurrentUser, Account) {

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
            },
            {
                type: Backbone.HasOne,
                key: 'account',
                relatedModel: Account,
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
            this.user = new CurrentUser(); // initialize current user for event binding (model attributes are present in the bootstrap data)
            this.account = new Account(); // initialize current account user for event binding
        },

        fetch: function (options) {
//            var success = options.success;
            var model = this;
            Backbone.Model.prototype.fetch.call(this, { // call super()
                success: function(resp, status, xhr) {
//                    if (success){ success(model, resp); }
                    if (!model.set(model.parse(resp, xhr), options)) { return false; }
                    model.user.url = model.get('resources').createSessionURL; // url for authentication can only be made after bootstrap
                    model.account.set(model.get('account'));
                    model.user.set(model.get('currentUser')); // set current user from bootstrap data
                    Backbone.history.start(); // Initiate a new history for back button usability
                }
            });
        }

    });

});
