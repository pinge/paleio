define([

    "jquery", "underscore", "backbone",
//    "paleio/views/ui/alert"
//    "paleio/models/pool",
//    "text!templates/my_fangool/pools/new.html"

], function(jquery, underscore, backbone) {

    return Backbone.View.extend({

        tagName: 'div',
        className: '_paleio_new_entity_view',
        model: null,
        template: null,

        defaults: {

            saveOptions: ( function() {
                var thiz = this;
                return {
                    error: function(xhr){
                        $(thiz.el).find('form .error').removeClass('error');
                        $(thiz.el).find('form .help-inline.as_error').html('');
                        if(_.include([400], xhr.status)){
                            try{ var response = JSON.parse(xhr.responseText); } catch(e){ var response = {} }
                            _.each(response.errors.adhoc, function(error){
                                var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"], form textarea[name="'+_.first(_.keys(error))+'"], form select[name="'+_.first(_.keys(error))+'"]');
                                inputError.addClass('error');
                                inputError.siblings('.help-block.as_error, .help-inline.as_error').html(_.first(_.values(error)).join(', ')).addClass('error');
                            });
                        };
                        $(thiz.el).find('.events').children('.loader').hide();
                        $(thiz.el).find('.events').children('.btn').removeClass('disabled');
                        $(thiz.el).find('.close').html('×');
                        if (thiz.defaults.error){ thiz.defaults.error.call(thiz, xhr); }
                    },
                    success: function(xhr, response){
                        if (thiz.defaults.success){ thiz.defaults.success.call(thiz, xhr, response); }
                    }
                }
            })

            // !!! ajaxSubmitOptions alternative (solution for file uploads?)
//            ajaxSubmitOptions: ( function(){
//                var thiz = this;
//                return             {
//                    url: App.get('resources')[thiz.resourceURLTag],
//                    dataType: 'json',
//                    contentType: 'application/json; charset=utf-8',
//                    success: function(response){
//                        App.user.set(response.currentUser);
//                        if (Backbone.history.fragment == ""){
//                            App.router.navigate('#my/dashboard', true);
//                        } else {
//                            App.router.navigate(Backbone.history.fragment, true);
//                        }
//                    },
//                    error: function(xhr,error,status){
//                        // clear errors
//                        $(thiz.el).find('form .clearfix.error').removeClass('error');
//                        $(thiz.el).find('form .clearfix .help-inline').html('');
//                        if(_.include([400], xhr.status)){
//                            try{ var errors = JSON.parse(xhr.responseText); } catch(e){ var errors = {} }
//                            _.each(errors, function(error){
//                                var inputError = $(thiz.el).find('form input[name="'+_.first(_.keys(error))+'"]');
//                                inputError.closest('.clearfix').addClass('error');
//                                inputError.siblings('.help-inline').html(_.first(_.values(error)).join(', '));
//                            });
//                        };
//                    }
//
//                }
//
//            })

        },

        events: {

            'click .confirm':            'createEntity',
            'click .cancel, .close':     'cancel'

        },

        createEntity: function(event){
            if (_.size($(this.el).find('.events').children('.btn.disabled')) == 0){
                var modelFormAttributes = $(this.el).find('form').rparam();
                this.model.clear({ silent: true });
                $(this.el).find('.close').html('&nbsp;');
                $(this.el).find('.events').children('.btn').addClass('disabled');
                $(this.el).find('.events').children('.loader').show();
                this.model.save(modelFormAttributes, this.defaults.saveOptions.call(this));
            }
            event.preventDefault();
        },

        cancel: function(event){
            if (_.size($(this.el).find('.events').children('.btn.disabled')) == 0){
                this.remove();
            }
        },

        render: function(){
            var template = _.template(this.defaults.template);
            $(this.el).html(template);
            this.model = new this.defaults.model({ id: 1234 });
            return this;
        },

        initialize: function(){
            _.extend(this.defaults, this.options);
        }

    });

});
