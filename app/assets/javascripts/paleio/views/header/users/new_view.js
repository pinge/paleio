define([

    "jquery", "underscore", "backbone",
    "paleio/models/user",
    "text!templates/header/users/new.html"

], function(jquery, underscore, backbone, User, signUpTemplate) {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'modal hide',
        id: '_sign_up_view',

        model: null,

        defaults: {
        },

        events: {

            'click .submit_registration':                   'createUser',
            'click .cancel':                                'close',
            'shown':                                        'shown',
            'hidden':                                       'hidden'

        },

        close: function(event){
            $(this.el).modal('hide');
        },

        render: function(){
            var thiz = this;
            var template = _.template(signUpTemplate);
            $(this.el).html(template);
            $(this.el).find('form').submit(function(event){
                var userFormAttributes = $(this).rparam();
                thiz.model.save(userFormAttributes, {
                    error: function(model, xhr){
                        $(thiz.el).find('form .as_error').removeClass('error');
                        $(thiz.el).find('form .help-inline.as_error').html('');
                        if(_.include([400], xhr.status)){
                            try{ var response = JSON.parse(xhr.responseText); } catch(e){ var response = {} }
                            _.each(response.errors.adhoc, function(error){
                                var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"]');
                                inputError.addClass('error');
                                inputError.closest('.control-group').find('.as_error').html(_.first(_.first(_.values(error)))).addClass('error');
                                inputError.siblings('.help-block.as_error, .help-inline.as_error').html(_.first(_.first(_.values(error)))).addClass('error');
                            });
                        };
                        $(thiz.el).find('.blocked').hide();
                        $(thiz.el).find('input, textarea, select').removeAttr('disabled');
                        $(thiz.el).find('.close, .modal-footer .btn').show();
                        thiz.delegateEvents();
                        $(thiz.el).stop().animate({ opacity: 1 }, 'fast');
                    },
                    success: function(model, response){
                        $('meta[name="csrf-token"]').attr({ content: response.token });
                        $(thiz.el).modal('hide');
                        App.user.clear({ silent: true });
                        App.user.set(response.currentUser);
                        AppView.router.navigate('#settings', true);
                    }
                });

                event.preventDefault();
            });
            $(this.el).modal({ 'keyboard': true, 'backdrop': true });
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
            this.undelegateEvents();
            $(this.el).find('.close, .modal-footer .btn').hide();
            $(this.el).find('input, textarea, select').attr('disabled', 'disabled');
            $(this.el).find('.blocked').show();
            $(this.el).stop().animate({ opacity: 0.8 }, 'fast');
            $(this.el).find('form').submit();
            event.preventDefault();
        }

    });

});
