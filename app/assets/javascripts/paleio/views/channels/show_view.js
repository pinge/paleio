define([

    "jquery", "underscore", "backbone",
    "order!paleio/models/channels/entry",
    "order!paleio/models/channels/entries/text",
    "order!paleio/models/channels/entries/code",
    "order!paleio/models/channels/entries/join",
    "order!paleio/collections/inputs",
    "order!paleio/collections/channels/entries",
    "order!paleio/views/channels/entries/show_view",
    "order!paleio/views/channels/entries/text/show_view",
    "order!paleio/views/channels/entries/code/show_view",
    "order!paleio/views/channels/entries/join/show_view",
    "text!templates/channels/show.html"

], function(jquery, underscore, backbone, Entry, TextEntry, CodeEntry, JoinEntry, Inputs, ChannelEntries,
            ChannelEntryView, TextEntryView, CodeEntryView, JoinEntryView, channelTemplate) {

    return Backbone.View.extend({

        el: 'body > .container',

        entries: null, // entries are the channel log
        inputs: null, // inputs are the users inputs from the past
        inputViews: {},

        defaults: {

            inputPlaceholderDisabled: 'no network.. :\\',
            inputPlaceholderEnabled: 'you can press return to send'

        },

        events: {

            'click .submit_input':      'submitInput',
            'keypress textarea':        'checkInput'

        },

        showPreviousInputs: function(inputs){
            var thiz = this;
            _.each(inputs.models, function(input){
                var entry;
                if (input.get('is_code')) {
                    var entryAttributes = { nick: input.get('nick'), code: input.get('input'), language: input.get('code_language'), timestamp: input.get('timestamp') };
                    entry = new CodeEntry(entryAttributes);
                } else {
                    var entryAttributes = { nick: input.get('nick'), text: input.get('input'), timestamp: input.get('timestamp') };
                    entry = new TextEntry(entryAttributes);
                }
                thiz.entries.add(entry, { silent: true });
                thiz.showEntry(entry);
            });
            $(this.el).find('.channel_log').fadeIn('slow');
            $(this.el).find('.log_frame').scrollTop($(this.el).find('.log_frame > table').height() - $(this.el).find('.log_frame').height());
        },

        createEntryView: function(entry){
            if (entry instanceof CodeEntry){
                return new CodeEntryView({ model: entry });
            } else if (entry instanceof TextEntry){
                return new TextEntryView({ model: entry });
            } else if (entry instanceof JoinEntry){
                return new JoinEntryView({ model: entry });
            } else {
                return new ChannelEntryView({ model: entry });
            }
        },

        showEntry: function(entry){
            var entryView = this.createEntryView(entry);
            $(this.el).find('.channel_log').append(entryView.el);
            entryView.render();
        },

        showNewEntry: function(entry){
            var entryView = this.createEntryView(entry);
            $(this.el).find('.channel_log').append(entryView.el);
            $(entryView.el).css({ 'display': 'none' });
            entryView.render();
            $(entryView.el).fadeIn('slow');
            $(this.el).find('.log_frame').stop().animate({ scrollTop: $(this.el).find('.log_frame > table').height() - $(this.el).find('.log_frame').height() }, 'slow');
        },

        checkInput: function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (!event.ctrlKey && !event.altKey && !event.shiftKey && keyCode == 13){
                $(this.el).find('.submit_input').click();
                event.preventDefault(); // avoids return on textarea
            }
        },

        startWebSocketClient: function(){
            var thiz = this;
            thiz.model.connect({
                onmessage: function (event) {
                    var data; try{ data = JSON.parse(event.data); } catch(e){ data = {}; }
                    switch (data.type){
                        case 'input':
                            if (data.input.is_code){
                                var entryAttributes = { nick: data.input.nick, timestamp: data.input.timestamp, code: data.input.input, language: data.input.code_language }
                                var entry = new CodeEntry(entryAttributes); thiz.entries.add(entry);
                            } else {
                                var entryAttributes = { nick: data.input.nick, timestamp: data.input.timestamp, text: data.input.input }
                                var entry = new TextEntry(entryAttributes); thiz.entries.add(entry);
                            }
                            break;
                        case 'join':
                            var entryAttributes = { nick: data.join.nick, timestamp: data.join.timestamp }
                            var entry = new JoinEntry(entryAttributes); thiz.entries.add(entry);
                            break;
                    }
                },
                onclose: function () {
                    $(thiz.el).find('textarea').attr('disabled','disabled').attr('placeholder', thiz.defaults.inputPlaceholderDisabled);
                    clearTimeout(thiz.refresh);
                    setTimeout(function() { thiz.startWebSocketClient(); }.apply(thiz), 5000);
                },
                onopen: function() {
                    $(thiz.el).find('textarea').removeAttr('disabled').attr('placeholder', thiz.defaults.inputPlaceholderEnabled).focus();
                    var join = { 'timestamp': moment().valueOf(),'nick': App.user.nick() };
                    this.send(JSON.stringify({ type: "join", join:join }));
                }
            });
        },

        initialize: function(){
            var thiz = this;
            this.entries = new ChannelEntries({ url: '/channels/'+ this.model.id +'/inputs.json' });
            this.inputs = new Inputs();
            this.inputs.url = '/channels/'+ this.model.id +'/inputs.json';
            this.inputs.on('add', this.showNewEntry, this);
            this.entries.on('add', this.showNewEntry, this);
            this.inputs.on('reset', this.showPreviousInputs, this);
            this.render();
            this.inputs.fetch({
                success: function(collection, response){
                    thiz.startWebSocketClient();
                }
            });
        },

        render: function(){
            var thiz = this;
            var template = _.template(channelTemplate, { model: this.model });
            $(this.el).html(template).find('.channel_log').css({ 'display': 'none' });;
            $(this.el).find('.user_input').attr({ 'onpaste': "$(this).data('paste',true)" }); // patch for HAML bug
            $(window).resize(function(event){
                $(thiz.el).find('.log_frame').animate({ scrollTop: $(thiz.el).find('.log_frame > table').height() - $(thiz.el).find('.log_frame').height() }, 'slow');
            });
            $('body > .navbar, body > .container .row-fluid').fadeIn('fast');
            return this;
        },

        submitInput: function(event){
            var thiz = this;
            var input = $(this.el).find('.user_input').val();
            // TODO sanitize input
            if (input != ''){
                var codeLanguage = hljs.highlightAuto(input).language; if (_.isUndefined(codeLanguage)) { codeLanguage = null; }
                var paste = $(this.el).find('.user_input').data('paste'); if (_.isUndefined(paste) || _.isNull(paste)){ paste = false; }
                $(this.el).find('.user_input').val('').focus();
                $.ajax({
                    url: '/channels/'+this.model.id+'/inputs.json',
                    type: 'POST', dataType: 'json', contentType: 'application/json',
                    data: JSON.stringify({ input: { raw: input, nick: App.user.nick(), code_language: codeLanguage, paste: paste } }),
                    error: function(xhr){
                        $(this.el).find('.user_input').val(input);
                    },
                    success: function(xhr){
                    }
                });
            }
            event.preventDefault();
        },

        remove: function(){
            this.model.disconnect();
            Backbone.View.prototype.remove.call(this);
        }

    });

});