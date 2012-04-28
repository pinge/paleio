define([

    "jquery", "underscore", "backbone",
    "paleio/views/header/channels/index_view",
    "paleio/views/header/users/new_view", "paleio/views/header/current_user/show_view",
    "text!templates/header/show.html"

], function(jquery, underscore, backbone, IndexChannelsHeaderView, SignUpView, CurrentUserToolbarView, headerTemplate) {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'navbar-inner',
        id: '_header_view',

        defaults: {

        },

        events: {

            'click .nav li a.home, .nav li a.about':           'setActive',
            'click .sign_up':                                  'showRegistrationForm'

        },

        setActive: function(event){
            $(this.el).find('.nav li').removeClass('active');
            $(event.currentTarget).closest('li').addClass('active');
        },

        render: function(){
            var template = _.template(headerTemplate, {});
            $(this.el).html(template);
            // bind current user changes to sign up button
            this.model.user.on('change', this.toggleSignUpButton, this);
            this.model.user.on('change', this.showAccountChannels, this);
            // initialize current user toolbar (render bound to App.user changes)
            var currentUserToolbarView = new CurrentUserToolbarView();
            $(this.el).find('.container').prepend(currentUserToolbarView.el);
            // fade in header
            $(AppView.el).children('.navbar').fadeIn('fast');
            return this;
        },

        showAccountChannels: function () {
            if (App.user.loggedIn) {
                var channelsListView = new IndexChannelsHeaderView();
                $(this.el).find('.brand').after(channelsListView.el);
                this.model.user.on('change', channelsListView.remove, channelsListView);
                App.account.channels.fetch();
            } else {
                $(this.el).find('a.sign_up').closest('li').show();
            }
        },

        toggleSignUpButton: function () {
            if (App.user.loggedIn) {
                $(this.el).find('a.sign_up').closest('li').hide();
            } else {
                $(this.el).find('a.sign_up').closest('li').show();
            }
        },

        initialize: function(){
            this.model.on('change', this.render, this);
        },

        showRegistrationForm: function(event){
            // create placeholder for view because bootstrap modal needs to be removed on hidden to work
            this.signUpView = new SignUpView();
            $('#modal_placeholder').html(this.signUpView.el);
            this.signUpView.render();
            event.preventDefault();
        }

    });

});
