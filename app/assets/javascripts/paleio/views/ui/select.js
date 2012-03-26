define([

    "jquery", "underscore", "backbone",
    "paleio/views/ui/select_option"

], function(jquery, underscore, backbone, OptionView) {

    return Backbone.View.extend({

        tagName: 'select',
        className: '_select_view',

        defaults: {

            loader: true, // shows loading message while getting all models: Please wait..
            prompt: true, // show prompt text instead of first model
            promptText: 'Please select..', // the prompt text
            useCache: false, // render on initialize
            noOptions: 'No options available.', // message to show when collection is empty
            fetchOptions: {} // fetch options for collection

        },

        events: {

            'change':        'selectOption'

        },

        getOptionName: function(){ // method for returning the value for the option name
            return this.model.get('name');
        },
        getOptionValue: function(){ // method for returning the value for the option value
            return this.model.id;
        },

        selectOption: function (event) { },

        initialize: function(){
            if (this.options.selectOption){ this.selectOption = this.options.selectOption; }
            if (this.options.getOptionName){ this.getOptionName = this.options.getOptionName; }
            if (this.options.getOptionValue){ this.getOptionValue = this.options.getOptionValue; }
            if (this.options.name){ $(this.el).attr({ name: this.options.name }); }
            _.extend(this.defaults, this.options);
            var el = $(this.el);
            if (this.defaults.loader) { el.attr({ disabled: 'disabled' }); }
            if (this.defaults.prompt) { el.html($('<option>').attr({ 'value': '' }).html('Please wait..')); }
            _.bindAll(this, 'addOne', 'addAll', 'selectOption');
            this.collection.bind('reset', this.addAll, this);
            if (this.defaults.useCache) { this.addAll(); }
            else { this.collection.fetch(this.defaults.fetchOptions); }
        },

        addOne: function(model){
            $(this.el).append(new OptionView({
                model: model, getName: this.getOptionName, getValue: this.getOptionValue
            }).render().el);
        },

        addAll: function(){
            var el = $(this.el);
            this.defaults.prompt ? el.find('option:not(:first-child)').remove() : el.empty();
            if (this.collection.length > 0){
                if (this.defaults.prompt) { el.children('option:first').html(this.defaults.promptText); }
                else { el.empty(); }
                this.collection.each(this.addOne);
                if (this.defaults.loader) { el.removeAttr('disabled'); }
            } else {
                el.children('option:first').html(this.defaults.noOptions);
            }
        },

        render: function(){
            this.addAll();
            return this;
        }

    });

});
