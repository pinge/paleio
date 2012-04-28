define([

    "jquery", "underscore", "backbone"

], function(jquery, underscore, backbone) {

    return Backbone.Model.extend({

        url: 'entrtyzz',

        nick: function () {
            return (this.hideNick ? '' : this.get('nick'));
        },

        hour: function () {
            return (this.hideHour ? '' : moment(this.get('timestamp')).format('HH:mm'));
        }

    });

});
