define([

    "jquery", "underscore", "backbone"

], function(jquery, underscore, backbone) {

    return Backbone.Model.extend({

        websocket: null,

        url: 'qwe',

        connect: function(options){
            var thiz = this;
            var serverUrl = "ws://"+ (this.get('current_host') == '0.0.0.0' ? document.domain : this.get('current_host')) +":"+ this.get('current_port');
            this.websocket = new WebSocket(serverUrl);
            if (options.onmessage){ this.websocket.onmessage = options.onmessage; }
            else { this.websocket.onmessage = function(evt) { alert('no default onmessage'); }; };
            if (options.onclose){ this.websocket.onclose = options.onclose; }
            else { this.websocket.onclose = function() { alert('no default onclose'); }; };
            if (options.onopen){ this.websocket.onopen = options.onopen; }
        },

        disconnect: function(){
            // failsafe. if at least onclose isn't set to null, the onclose function will trigger again
            this.websocket.onclose = null; this.websocket.onopen = null; this.websocket.onmessage = null;
            // readyState = 0 => WebSocket is closed before the connection is established.
            if (!_.isNull(this.websocket) && this.websocket.readyState != 0){ this.websocket.close(); }
        }

    });

});
