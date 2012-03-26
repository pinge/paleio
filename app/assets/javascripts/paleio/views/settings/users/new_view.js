define([

    "jquery", "underscore", "backbone",
    "paleio/models/user",
    "paleio/views/ui/modal_view",
    "text!templates/settings/users/new.html"

], function(jquery, underscore, backbone, User, ModalView, newSettingsUserTemplate) {

    return ModalView.extend({

        template: newSettingsUserTemplate,

        backdrop: true,

        defaults: _.extend(_.extend({}, ModalView.prototype.defaults), {
            backdrop: 'static'
        }),

        events: _.extend({

            'click .invite_user':      'inviteUser'

        }, ModalView.prototype.events),

        render: function () {
            ModalView.prototype.render.call(this);
            this.model = new User();
            this.model.url = '/accounts/'+ App.user.get('account').id +'/users.json';
        },

        inviteUser: function (event) {
            this.undelegateEvents();
            $(this.el).find('.close, .modal-footer .btn').hide();
            $(this.el).find('input, textarea, select').attr('disabled', 'disabled');
            $(this.el).find('.blocked').show();
            var thiz = this;
            var userAttributes = { name: $(this.el).find('input.user_name').val(), email: $(this.el).find('input.user_email').val(), invitation_message: $(this.el).find('textarea.user_invitation_message').val() };
            $(this.el).stop().animate({ opacity: 0.8 }, 'fast');
            this.model.save(userAttributes, {
                error: function (model, xhr) {
                    $(thiz.el).find('form .as_error').removeClass('error').html('');
                    if (_.include([400], xhr.status)) {
                        try{ var response = JSON.parse(xhr.responseText); } catch (e) { var response = {}; }
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
                success: function (model, response) {
                    thiz.options.users.add(model);
                    $(thiz.el).modal('hide');
                    thiz.remove();
                }
            });
            event.preventDefault();
        }

    });

});
