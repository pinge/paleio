define([

    "jquery", "underscore", "backbone",
    "text!templates/ui/modal.html"

], function(jquery, underscore, backbone, modalTemplate) {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'modal hide',
        template: null,
        model: null,

        defaults: {
            keyboard: true,
            backdrop: false
        },

        initialize: function () {
            _.extend(this.defaults, this.options);
            _.extend(this, this.defaults);
        },

        events: {

            'click .close':                                 'close',
            'shown':                                        'shown',
            'hidden':                                       'hidden'

        },

        close: function(event){
            $(this.el).modal('hide');
            event.preventDefault();
        },

        render: function(){
            templateContext = {};
            if (!_.isNull(this.model)){ templateContext['model'] = this.model; }
            var template = _.template(_.isNull(this.template) ? modalTemplate : this.template, templateContext);
            $(this.el).html(template);
            $(this.el).modal({ 'keyboard': this.defaults.keyboard, 'backdrop': this.defaults.backdrop });
            $(this.el).modal({ 'show': true });
            return this;
        },

        hidden: function(){
            this.remove();
            return false;
        },

        shown: function(){
            return false;
        }

    });

});
