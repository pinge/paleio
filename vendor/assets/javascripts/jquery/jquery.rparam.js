(function($){

    /**
     * jQuery rparam
     */
    $.fn.rparam = function(options){

        var result = {};

        var settings = {
            arraySeparator: '[]',
            elementSelector: 'input,textarea,select'
        };

        if (options)
        {
            $.extend(settings, options);
        }

        var formNamesValues = {};
        // get names and values
        var inputs = $(this).find(settings.elementSelector);
        $.each(inputs, function(i,element){
            var inputName = $(element).attr('name');
            if (!_.isUndefined(inputName) && !_.isNull(inputName) && inputName != ''){
                var inputValue = $(element).val();
                var firstArrayIndex = inputName.indexOf(settings.arraySeparator);
                if (firstArrayIndex == -1){ // no arrays
                    formNamesValues[inputName] = inputValue;
                } else { // arrays detected
                    var currentInputName = inputName;
                    var currentRestInputName;
                    var cursor = formNamesValues;
                    while(currentInputName.indexOf(settings.arraySeparator) != -1){
                        // get index for next array on string
                        var nextArrayIndex = currentInputName.indexOf(settings.arraySeparator);
                        // get inputName part until separator
                        var inputNameLeftPart = currentInputName.substring(0, nextArrayIndex);
                        // set cursor in the first time
                        if (!cursor[inputNameLeftPart]) { cursor[inputNameLeftPart] = []; }
                        cursor = cursor[inputNameLeftPart];
                        // get rest of input name
                        currentRestInputName = currentInputName.substring(nextArrayIndex+settings.arraySeparator.length);
                        if (currentRestInputName.indexOf(settings.arraySeparator) == -1){
                            if (currentRestInputName == ""){
                                cursor.push(inputValue);
                            } else {
                                if (cursor.length == 0){
                                    var o = {};
                                    o[currentRestInputName] = inputValue;
                                    cursor.push(o);
                                } else {
                                    var a = _.first(_.reject(cursor, function(e){ return _.include(_.keys(e), currentRestInputName); }));
                                    if (a){
                                        a[currentRestInputName] = inputValue;
                                    } else {
                                        var o = {};
                                        o[currentRestInputName] = inputValue;
                                        cursor.push(o);
                                    }
                                }
                            }
                        }
                        // set currentInputName as the rest of the input name
                        currentInputName = currentRestInputName;
                    }
                }
            }
        });

        for (var formName in formNamesValues){
            var value = formNamesValues[formName];
            var nameSplit = formName.split('[');
            var cursor = result;
            for (var i = 0; i < nameSplit.length; i++){
                var namespace = nameSplit[i];
                if (namespace.charAt(namespace.length-1) == ']'){ namespace = namespace.substring(0, namespace.length-1); }
                if (i == nameSplit.length - 1){
                    if (value instanceof Array){
                        if(!cursor[namespace]){ cursor[namespace] = []; };
                        var arrayResult = [];
                        for (var j = 0; j < value.length; j++){ // iterate over each entity
                            var v = value[j];
                            // TODO refactor this code
                            var subResult;
                            if (v instanceof Object){
                                subResult = {};
                                var subFormNameValues = value[j];
                                for (var subFormName in subFormNameValues){
                                    var subValue = subFormNameValues[subFormName];
                                    var subNameSplit = subFormName.split('[');
                                    var subCursor = subResult;
                                    for (var k = 0; k < subNameSplit.length; k++){
                                        var subNamespace = subNameSplit[k];
                                        if (subNamespace == ""){ continue; }
                                        if (subNamespace.charAt(subNamespace.length-1) == ']'){ subNamespace = subNamespace.substring(0, subNamespace.length-1); }
                                        if (k == subNameSplit.length - 1){
                                            subCursor[subNamespace] = subValue;
                                        } else {
                                            if(!subCursor[subNamespace]){ subCursor[subNamespace] = {}; };
                                            subCursor = subCursor[subNamespace];
                                        }
                                    }
                                }
                            } else {
                                subResult = v;
                            }
                            arrayResult.push(subResult);
                        }
                        cursor[namespace] = arrayResult;
                    } else {
                        cursor[namespace] = value;
                    }
                } else {
                    if(!cursor[namespace]){ cursor[namespace] = {}; };
                    cursor = cursor[namespace];
                }
            }
        }

        return result;

    }

})(jQuery);
