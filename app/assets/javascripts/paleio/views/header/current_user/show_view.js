define([

    "jquery", "underscore", "backbone",
    "paleio/models/current_user",
    "text!templates/header/current_user/show.html"

], function(jquery, underscore, backbone, CurrentUser, currentUserToolbarTemplate) {

    return Backbone.View.extend({

        tagName: 'ul',
        className: 'nav pull-right',
        model: null,

        defaults: {

        },

        events: {

            'click .nav li a.settings, .nav li a.my_fangool':                 'setActive',
            'click .sign_in':                    'signIn',
            'click .sign_out':                   'signOut'

        },

        initialize: function () {
            App.user.on('change', this.render, this);
        },

        setActive: function (event) {
            $(event.currentTarget).closest('#_header_view').find('.nav li').removeClass('active');
            $(event.currentTarget).closest('li').addClass('active');
        },

        render: function(){
            var thiz = this;
            var template = _.template(currentUserToolbarTemplate);
            $(this.el).html(template);
            return this;
        },

        signIn: function(event){
            var thiz = this;
            var signInFormAttributes = { user: { email: $(this.el).find('input.username').val(), password: $(this.el).find('input.password').val() } };
            App.user.id = null;
            App.user.save(signInFormAttributes, {
                success: function(model, response){
                    $('meta[name="csrf-token"]').attr({ content: response.token });
                    App.user.login();
                    if (Backbone.history.fragment == ""){
    //                            $(thiz.el).find('a.my_fangool').click();
    //                            App.router.navigate('#my/dashboard', true);
                    } else {
    //                            App.router.navigate(Backbone.history.fragment, true);
                    }
                },
                error: function(xhr){
                    $(thiz.el).find('form input').removeClass('error');
                    if(_.include([400], xhr.status)){
                        try{ var response = JSON.parse(xhr.responseText); } catch(e){ var response = {} }
                        if (response.errors.global){ $(thiz.el).find('form input').addClass('error'); }
                        _.each(response.errors.adhoc, function(error){
                            var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"]');
                            inputError.addClass('error');
                        });
                    };
                },
                silent: true
            });
            event.preventDefault();
        },

        signOut: function(event){
            App.user.destroy({
                error: function(response, xhr){
                    alert('error', response, xhr);
                },
                success: function(model, response){
                    App.user.logout();
                    if (_.include(AppView.router.publicRoutes, Backbone.history.fragment)){
                        AppView.router.navigate(Backbone.history.fragment, true);
                    } else {
                        AppView.router.navigate("", true);
                    }
                },
                wait: true // Pass {wait: true} if you'd like to wait for the server to respond before removing the model from the collection.
            });
            event.preventDefault();
        }

    });

});
