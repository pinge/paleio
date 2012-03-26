define([

    "jquery", "underscore", "backbone",
    "paleio/models/channel",
    "paleio/views/ui/modal_view",
    "text!templates/settings/channels/new.html"

], function(jquery, underscore, backbone, Channel, ModalView, newSettingsChannelTemplate) {

    return ModalView.extend({

        template: newSettingsChannelTemplate,

        backdrop: true,

        defaults: _.extend(_.extend({}, ModalView.prototype.defaults), {
            backdrop: 'static'
        }),

        events: _.extend({

            'click .create_channel':      'createChannel'

        }, ModalView.prototype.events),

        render: function () {
            ModalView.prototype.render.call(this);
            this.model = new Channel();
            this.model.url = '/accounts/'+ App.user.get('account').id +'/channels.json';
        },

        createChannel: function (event) {
            this.undelegateEvents();
            $(this.el).find('.close, .modal-footer .btn').hide();
            $(this.el).find('input, textarea, select').attr('disabled', 'disabled');
            $(this.el).find('.blocked').show();
            var thiz = this;
            var channelAttributes = { name: $(this.el).find('input.channel_name').val(), code: $(this.el).find('input.channel_code').val() };
            $(this.el).stop().animate({ opacity: 0.8 }, 'fast');
            this.model.save(channelAttributes, {
                error: function (model, xhr) {
                    $(thiz.el).find('form .as_error').removeClass('error').html('');
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
                success: function (model, response) {
                    App.user.channels.fetch();
                    thiz.options.channels.add(model);
                    $(thiz.el).modal('hide');
                    thiz.remove();
                }
            });
            event.preventDefault();
        }

    });

});
