define([

    "jquery", "underscore", "backbone",
    "paleio/models/channels/entry"

], function(jquery, underscore, backbone, Entry) {

    return Entry.extend({

        prettyCode: function () {
            var t = this.get('code').split("\n");
            var z, maxPossibleIndentation;
            maxPossibleIndentation = null;
            _.each(t, function (l) {
                for (var i = 0, m = 0; i < l.length; i++, m++) {
                    if (l[i] != ' ') {
                        if (_.isNull(maxPossibleIndentation) || m < maxPossibleIndentation){ maxPossibleIndentation = m; }
                        break;
                    }
                }
            });
            if (maxPossibleIndentation > 0) {
                return _.map(t, function (line) { return line.substring(maxPossibleIndentation); }).join("\n").replace(/  /g, '&nbsp;&nbsp;');
            }
            return this.get('code').replace(/  /g, '&nbsp;&nbsp;'); // indentation
        }

    });

});
