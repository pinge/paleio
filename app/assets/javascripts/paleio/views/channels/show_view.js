define([

    "jquery", "underscore", "backbone",
    "order!paleio/models/channels/entry",
    "order!paleio/models/channels/entry/text",
    "order!paleio/models/channels/entry/code",
    "order!paleio/models/channels/entry/join",
    "order!paleio/models/channels/entry/file",
    "order!paleio/models/channels/inputs/join",
    "order!paleio/collections/inputs",
    "order!paleio/collections/channels/entries",
    "order!paleio/views/channels/entries/show_view",
    "order!paleio/views/channels/entries/text/show_view",
    "order!paleio/views/channels/entries/code/show_view",
    "order!paleio/views/channels/entries/join/show_view",
    "order!paleio/views/channels/entries/file/show_view",
    "order!paleio/views/channels/shared_files/index_view",
    "text!templates/channels/show.html"

], function(jquery, underscore, backbone, Entry, TextEntry, CodeEntry, JoinEntry, FileEntry, JoinInput, Inputs, ChannelEntries,
            ChannelEntryView, TextEntryView, CodeEntryView, JoinEntryView, FileEntryView, SharedFilesView, channelTemplate) {

    return Backbone.View.extend({

        el: 'body > .container',

        entries: null, // entries are the channel log
        inputs: null, // inputs are the users inputs from the past
        clockIntervalId: null,
        entriesViews: {},
        sharedFiles: null,

        defaults: {

            inputPlaceholderDisabled: 'no network.. :\\',
            inputPlaceholderEnabled: 'you can press return to send'

        },

        events: {

            'click .submit_input':      'submitInput',
            'click .new_file_upload':   'newFileUpload',
            'click .cancel_upload':     'cancelFileUpload',
            'click .upload':            'uploadFile',
            'change .input-file':       'selectFile',
            'keypress textarea':        'checkInput'

        },

        showPreviousEntries: function (entries) {
            var thiz = this;
            _.each(entries.models, function (entry) { thiz.showEntry(entry); });
            $(this.el).find('.channel_log').fadeIn('slow');
            $(this.el).find('.log_frame').scrollTop($(this.el).find('.log_frame > table').height() - $(this.el).find('.log_frame').height());
        },

        createEntryView: function(entry){
            if (entry instanceof JoinEntry) {
                return new JoinEntryView({ model: entry });
            } else if (entry instanceof CodeEntry) {
                return new CodeEntryView({ model: entry });
            } else if (entry instanceof TextEntry) {
                return new TextEntryView({ model: entry });
            } else if (entry instanceof FileEntry) {
                return new FileEntryView({ model: entry });
            } else {
                return new ChannelEntryView({ model: entry });
            }
        },

        showEntry: function (entry) {
            if (!_.isEmpty(this.entriesViews)) {
                var lastShownStatus = this.entries.lastShownStatusBefore(entry);
                if (!_.isNull(lastShownStatus) && !_.isUndefined(lastShownStatus)) {
                    if (lastShownStatus.get('nick') == entry.get('nick') && (entry.get('timestamp') - lastShownStatus.get('timestamp')) < 5 * 60 * 1000) {
                        if (_.include(_.keys(this.entriesViews), lastShownStatus.cid)) {
                            entry.hideNick = true;
                            entry.hideHour = true;
                        }
                    }
                }
            }
            this.entriesViews[entry.cid] = this.createEntryView(entry);
            $(this.el).find('.channel_log').append(this.entriesViews[entry.cid].el);
            this.entriesViews[entry.cid].render();
        },

        showNewEntry: function (entry) {
            if (!_.isEmpty(this.entriesViews)) {
                var lastShownStatus = this.entries.lastShownStatusBefore(entry);
                if (!_.isNull(lastShownStatus) && !_.isUndefined(lastShownStatus)) {
                    if (lastShownStatus.get('nick') == entry.get('nick') && (entry.get('timestamp') - lastShownStatus.get('timestamp')) < 5 * 60 * 1000) {
                        if (_.include(_.keys(this.entriesViews), lastShownStatus.cid)) {
                            entry.hideNick = true;
                            entry.hideHour = true;
                        }
                    }
                }
            }
            this.entriesViews[entry.cid] = this.createEntryView(entry);
            $(this.el).find('.channel_log').append(this.entriesViews[entry.cid].el);
            $(this.entriesViews[entry.cid].el).css({ 'display': 'none' });
            this.entriesViews[entry.cid].render();
            $(this.entriesViews[entry.cid].el).fadeIn('slow');
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
                    var entry;
                    if (data.type === "code") {
                        entry = new CodeEntry(data);
                    } else if (data.type === "text") {
                        entry = new TextEntry(data);
                    } else if (data.type === "join") {
                        entry = new JoinEntry(data);
                    } else if (data.type === "file") {
                        entry = new FileEntry(data); thiz.sharedFiles.add(entry);
                    } else if (data.type === 'current_users') {
                        $(thiz.el).find('.connected_users').empty(); // TODO current users views.. this works for now
                        _.each(data.users, function (connectedUser) {
                            var cu = $('<tr>');
                            cu.append($('<td>').html(connectedUser.nick));
                            $(thiz.el).find('.connected_users').append(cu);
                        });
                    }
                    if (entry) { thiz.entries.add(entry); }
                    else { console.log('web socket data not recognized', data, event); }
                },
                onclose: function () {
                    $(thiz.el).find('textarea').attr('disabled','disabled').attr('placeholder', thiz.defaults.inputPlaceholderDisabled);
                    $(thiz.el).find('.submit_input,.new_file_upload').attr('disabled','disabled');
                    $(thiz.el).find('.connected_users tr td').css({ 'color': '#ccc' });
                    clearTimeout(thiz.refresh);
                    setTimeout(function() { thiz.startWebSocketClient(); }.apply(thiz), 5000);
                },
                onopen: function() {
                    var that = this;
                    $(thiz.el).find('.connected_users > tr > td').css({ 'color': '#333' });
                    $(thiz.el).find('textarea').removeAttr('disabled').attr('placeholder', thiz.defaults.inputPlaceholderEnabled).focus();
                    $(thiz.el).find('.submit_input,.new_file_upload').removeAttr('disabled');
                    var joinInput = new JoinInput({ type: 'join' });
                    joinInput.url = '/channels/'+ thiz.model.id +'/inputs.json';
                    joinInput.save({},{
                        success: function (model, response) {
                            that.send(JSON.stringify({ 'type': 'ping', 'email': App.user.get('email'), 'nick': App.user.nick() }));
                        }
                    });
                }
            });
        },

        initialize: function(){
            var thiz = this;
            this.entries = new ChannelEntries();
            this.entries.url = '/channels/'+ this.model.id +'/inputs.json';
            this.entries.on('add', this.showNewEntry, this);
            this.entries.on('reset', this.showPreviousEntries, this);
            this.sharedFiles = new ChannelEntries();
            this.sharedFiles.url = '/channels/'+ this.model.id +'/files.json';
            this.render();
            this.entries.fetch({
                success: function (collection, response) {
                    thiz.startWebSocketClient();
                }
            });
        },

        render: function(){
            var thiz = this;
            var template = _.template(channelTemplate, { model: this.model });
            $(this.el).html(template).find('.channel_log').css({ 'display': 'none' });;
            $(this.el).find('.user_input').attr({ 'onpaste': "$(this).data('paste',true)" }); // patch for HAML bug
            $(this.el).find('form.file_input').attr('action','/channels/'+ this.model.id +'/inputs.json');
            var options = {
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: { 'input[type]': 'file' },
                success: function(response) {
                    console.log('success', response);
                    thiz.cancelFileUpload();
                    $(thiz.el).find('.upload_ok').show().fadeOut(2000);
                },
                error: function(response) {
                    $(thiz.el).find('.cancel_upload').html('Cancel').removeAttr('disabled');
                    $(thiz.el).find('.input-file, .upload').show();
                    alert('error uploading file');
                    console.log('error', response);
                }
            };
            $(this.el).find('form.file_input').submit(function () {
                $(this).ajaxSubmit(options);
                return false;
            });
            $(window).resize(function (event) {
                $(thiz.el).find('.log_frame').stop().animate({ scrollTop: $(thiz.el).find('.log_frame > table').height() - $(thiz.el).find('.log_frame').height() }, 'slow');
            });
            var sharedFilesView = new SharedFilesView({ collection: this.sharedFiles });
            $(this.el).find('.shared_files').html(sharedFilesView.el);
            this.sharedFiles.fetch();
            $('body > .navbar, body > .container .row-fluid').fadeIn('fast');
            this.clockIntervalId = setInterval(function () { $(thiz.el).find('.user_clock').html(moment().format('HH:mm')); }, 5000);
            return this;
        },

        uploadFile: function (event) {
            if ($(event.currentTarget).attr('disabled') == 'disabled') { event.preventDefault(); return; }
            $(this.el).find('.input-file, .upload').hide();
            $(this.el).find('.cancel_upload').attr('disabled','disabled').html('Uploading file..');
            $(this.el).find('form.file_input').submit();
        },

        selectFile: function (event) {
            $(this.el).find('.upload').removeAttr('disabled');
            event.preventDefault();
        },

        cancelFileUpload: function (event) {
            $(this.el).find('.cancel_upload').removeClass('cancel_upload').addClass('new_file_upload').html('Upload file').removeAttr('disabled');
            $(this.el).find('.input-file, .upload').hide();
            $(this.el).find('.input-file').val('');
            $(this.el).find('.submit_input, textarea').removeAttr('disabled');
            if (event) { event.preventDefault(); }
        },

        newFileUpload: function (event) {
            if ($(event.currentTarget).attr('disabled') == 'disabled') { event.preventDefault(); return; }
            $(this.el).find('.submit_input, textarea').attr('disabled','disabled');
            $(event.currentTarget).removeClass('new_file_upload').addClass('cancel_upload').html('Cancel');
            $(this.el).find('.input-file, .upload').show();
            $(this.el).find('.upload').attr('disabled','disabled');
            event.preventDefault();
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
                    data: JSON.stringify({ input: { 'type': _.isNull(codeLanguage) ? 'text' : 'code', 'raw': input, 'nick': App.user.nick(), 'code_language': codeLanguage, 'paste': paste } }),
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
            clearInterval(this.clockIntervalId);
            this.model.disconnect();
            Backbone.View.prototype.remove.call(this);
        }

    });

});
