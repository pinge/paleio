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
                    key: 'account'
                }
            }
        ],

        url: 'accountzinpurlz'

    });

});
