define([

    "jquery", "underscore", "backbone"

], function(jquery, underscore, backbone) {

    return Backbone.View.extend({

        tagName: 'option',
        selectView: null,

        initialize: function(){
            if (this.options.getName){ this.getName = this.options.getName; }
            if (this.options.getValue){ this.getValue = this.options.getValue; }
            _.bindAll(this, "render");
        },

        render: function(){
            $(this.el).attr({ value: this.getValue() }).html(this.getName());
            return this;
        }
//
//        getName: function(){
//            return this.selectView.getName();
//        },
//
//        getValue: function(){
//            return this.selectView.getValue();
//        }

    });

});
