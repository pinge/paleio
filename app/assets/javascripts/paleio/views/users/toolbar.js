define([

    "jquery", "underscore", "backbone",
    "paleio/models/current_user",
    "text!templates/users/toolbar.html"

], function(jquery, underscore, backbone, CurrentUser, toolbarTemplate) {

    return Backbone.View.extend({

        tagName: 'div',
        id: '_user_toolbar_view',
        model: null,

        defaults: {

        },

        events: {

            'click .nav li a.settings':                 'setActive',
            'click .sign_in':                           'signIn',
            'click .sign_out':                          'signOut'

        },

        setActive: function(event){
            $(event.currentTarget).closest('#_header_view').find('.nav li').removeClass('active');
            $(event.currentTarget).closest('li').addClass('active');
        },

        render: function(){
            var thiz = this;
            var template = _.template(toolbarTemplate);
            $(this.el).html(template);
            if (!App.user.loggedIn){
                // ajax sign in form submission
                $(this.el).find('form').submit(function(event){
                    var loginFormAttributes = $(this).rparam();
                    App.user.save(loginFormAttributes, {
                        success: function(model, response){
                            $('meta[name="csrf-token"]').attr({ content: response.token });
                            App.user.login();
                            if (Backbone.history.fragment == ""){
                                App.router.navigate('#settings', true);
                            } else {
                                App.router.navigate(Backbone.history.fragment, true);
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
                    // !!! alternative with ajaxSubmit (maybe better for file uploading?)
//                    $(this).ajaxSubmit({
//                        dataType: 'json',
//                        contentType: 'application/json; charset=utf-8',
//                        success: function(response){
//                            App.user.set(response.currentUser);
//                            if (Backbone.history.fragment == ""){
//                                App.router.navigate('#my/dashboard', true);
//                            } else {
//                                App.router.navigate(Backbone.history.fragment, true);
//                            }
//                        },
//                        error: function(xhr,error,status){
//                            // clear errors
//                            $(thiz.el).find('form .clearfix.error').removeClass('error');
//                            $(thiz.el).find('form .clearfix .help-inline').html('');
//                            if(_.include([400], xhr.status)){
//                                try{ var errors = JSON.parse(xhr.responseText); } catch(e){ var errors = {} }
//                                _.each(errors, function(error){
//                                    var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"]');
//                                    inputError.closest('.clearfix').addClass('error');
//                                    inputError.siblings('.help-inline').html(_.first(_.values(error)).join(', '));
//                                });
//                            };
//                        }
//                    });


                    event.preventDefault();
                });
            } else {
            }
            return this;
        },

        signIn: function(event){
            $(this.el).find('form').submit();
            event.preventDefault();
        },

        signOut: function(event){
            App.user.destroy({
                error: function(response, xhr){
                    alert('error', response, xhr);
                },
                success: function(model, response){
                    App.user.logout();
                    if (_.include(App.router.publicRoutes, Backbone.history.fragment)){
                        App.router.navigate(Backbone.history.fragment, true);
                    } else {
                        App.router.navigate("", true);
                    }
                }
            });
            event.preventDefault();

//            // !!! alternative ajax call for sign out
//            $.ajax({
//                type: 'DELETE',
//                url: App.attributes.resources.signOutURL,
//                contentType: 'application/json; charset=utf-8',
//                dataType: 'json',
//                error: function(e){ alert(e); },
//                success: function(response){
//                    App.user.set(response.currentUser);
//                    if (_.include(['','about'], Backbone.history.fragment)){
//                        App.router.navigate(Backbone.history.fragment, true);
//                    } else {
//                        App.router.navigate("", true);
//                    }
//                }
//            });

        }

    });

});
