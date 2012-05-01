define([

    "jquery", "underscore", "backbone",
    "paleio/models/user",
    "text!templates/users/sign_up.html"

], function(jquery, underscore, backbone, User, signUpTemplate) {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'modal hide',
        id: '_sign_up_view',

        model: null,

        defaults: {
            registrationFormOptions: (function(){
                var thiz = this;
                return {
                    dataType: 'json', contentType: 'application/json; charset=utf-8',
                    success: function(response, status, xhr){
                        if (_.include([201], xhr.status)){
                            $(thiz.el).modal('hide');
                            App.user.set(response.currentUser);
                            App.router.navigate('#my/dashboard', true);
                        }
                    },
                    error: function(xhr,error,status){
                        // clear errors
                        $(thiz.el).find('form .clearfix.error').removeClass('error');
                        $(thiz.el).find('form .clearfix .help-inline').html('');
                        if(_.include([400], xhr.status)){
                            try{ var errors = JSON.parse(xhr.responseText); } catch(e){ var errors = {} }
                            _.each(errors, function(error){
                                var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"]');
                                inputError.closest('.clearfix').addClass('error');
                                inputError.siblings('.help-inline').html(_.first(_.values(error)).join(', '));
                            });
                        };
                    },
                    clearForm: true,
                    forceSync: true
                }
            })
        },

        events: {

            'click .submit_registration':                   'createUser',
            'shown':                                        'shown',
            'hidden':                                       'hidden'

        },

        render: function(){
            var thiz = this;
            var template = _.template(signUpTemplate);
            $(this.el).html(template);
            $(this.el).find('form').submit(function(event){
                var userFormAttributes = _.first($(this).toObject({ mode: 'all', skipEmpty: false }));
                thiz.model.save(userFormAttributes, {
                    error: function(xhr, status){
                        $(thiz.el).find('form .clearfix.error').removeClass('error');
                        $(thiz.el).find('form .clearfix .help-inline').html('');
                        if(_.include([400], xhr.status)){
                            try{ var response = JSON.parse(xhr.responseText); } catch(e){ var response = {} }
                            _.each(response.errors.adhoc, function(error){
                                var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"]');
                                inputError.closest('.clearfix').addClass('error');
                                inputError.siblings('.help-block').html(_.first(_.values(error)).join(', '));
                            });
                        };
                    },
                    success: function(model, response){
                        $('meta[name="csrf-token"]').attr({ content: response.token });
                        $(thiz.el).modal('hide');
                        App.user.clear({ silent: true });
                        App.user.set(response.currentUser);
                        App.router.navigate('#my/dashboard', true);
                    }
                });

                event.preventDefault();
            });
            $(this.el).modal({ 'keyboard': true, 'backdrop': true });
//            this.delegateEvents();
            $(this.el).modal({ 'show': true });
            return this;
        },

        hidden: function(){
            this.remove();
            return false;
        },

        shown: function(){
            return false;
        },

        createUser: function(event){
            this.model = new User();
            $(this.el).find('form').submit();
            event.preventDefault();
        }

    });

});
