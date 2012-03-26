define([

    "jquery", "underscore", "backbone",
    "paleio/models/paleio", "paleio/models/account",
    "paleio/collections/channels"

], function(jquery, underscore, backbone, PaleioApplication, Account, Channels) {

    return Backbone.Model.extend({

        relations: [
            {
                type: Backbone.HasOne,
                key: 'app',
                relatedModel: PaleioApplication,
                reverseRelation: {
                    type: Backbone.HasOne,
                    key: 'user'
                }
            },
            {
                type: Backbone.HasOne,
                key: 'account',
                relatedModel: Account,
                reverseRelation: {
                    type: Backbone.HasOne,
                    key: 'user'
                }
            }
        ],

        channels: null,
        nickname: null,

        defaults: {
//            email: null
        },

        nick: function(){
            if (this.nickname){ return this.nickname; }
            if (this.get('email') && this.get('email') != ''){
                this.nickname = this.get('name');
            } else {
                var thiz = this;
                this.nickname = 'guest';
                _(6).times(function(){ thiz.nickname += '' + Math.floor(Math.random()*10); });
            }
            return this.nickname;
        },

        initialize: function(){
            this.bind("error", this.notLogged);
        },

        validate: function(attributes){
            if (!_.isEmpty(attributes) && _.include(_.keys(attributes), 'email') &&
                attributes.email != ''
                ){
                this.login();
                return;
            } else {
                return "anonymous login";
            }
        },

        // override sync method to apply different URLs to different REST actions
        sync: function(method, model, options) {
            options = options || {};
            switch(method){
                case 'create':
                    options.url = App.get('resources').createSessionURL;
                    break;
                case 'delete':
                    options.url = App.get('resources').destroySessionURL;
                    break;
            }
            Backbone.sync(method, model, options);
        },

        destroy : function(options) {
            var thiz = this, previousId = this.id;
            this.id = 'fakeid'; // we need to set an id to pretend that the model is not new so the destroy request can be made
            options.complete = function(xhr){ thiz.id = previousId; }; // reset id (hopefully null)
            return Backbone.Model.prototype.destroy.call(this, options);
        },

        set: function(key, value, options) {
            if (_.isEmpty(key)){ _.extend(key, { email: '' }); } // always force an email field so the events can be triggered
            return Backbone.Model.prototype.set.call(this, key, value, options);
        },

        parse: function(resp, xhr) {
            if (_.include(_.keys(resp), 'currentUser')){ return resp.currentUser; } // remove currentUser namespace from sign in/sign out responses
            return resp;
        },

        notLogged: function(response,error){
            if (response instanceof Backbone.Model){
                if (error = "anonymous login"){
                    this.logout();
                }
            } else {
                response.success();
            }
        },

        login: function(){
            this.loggedIn = true;
            this.channels = new Channels();
            this.trigger('change');
        },

        logout: function(){
            this.clear({ silent: true });
            this.loggedIn = false;
            this.trigger('change');
        }

    });

});
