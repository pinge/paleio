define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry"

], function(jquery, underscore, backbone, Entry) {

    return Entry.extend({

        getHumanizedFileSize: function () {
            if (this.get('filesize') >= 1073741824) {
                return (this.get('filesize') / 1073741824).toFixed(2) + ' GB';
            } else {
                if (this.get('filesize') >= 1048576) {
                    return (this.get('filesize') / 1048576).toFixed(2) + ' MB';
                } else {
                    if (this.get('filesize') >= 1024) {
                        return (this.get('filesize') / 1024).toFixed(2) + ' KB';
                    } else {
                        return this.get('filesize').toFixed(2) + ' Bytes';
                    };
                };
            };
        }

    });

});
