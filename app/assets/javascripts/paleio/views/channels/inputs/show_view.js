define([

    "jquery", "underscore", "backbone",
    "paleio/models/input",
    "text!templates/channels/inputs/show.html"

], function(jquery, underscore, backbone, Input, channelInputTemplate) {

    return Backbone.View.extend({

        tagName: 'tr',
        className: '_channel_input',

        defaults: {

        },

        events: {

//            'click .submit_input':      'submitInput',
//            'keypress textarea':        'checkInput'

        },

//        initialize: function(){
//        },

        render: function(){
            var thiz = this;
            var template = _.template(channelInputTemplate, { model: this.model });
            $(this.el).html(template);
            $(this.el).find('td').fadeIn('slow', function(){
                if (thiz.model.get('is_code')) {
                    $(thiz.el).find('pre code').each(function(i, e) { hljs.highlightBlock(e, '    ')});
                }
            });
            return this;
        }

    });

});
