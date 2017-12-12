;
(function (g) {
    'use strict';
    var ex = {};

    var forms = {
        'gen-form': '<form class="ttph_gen-form form-inline">\n             <span class="ttph_group-wrapper"></span>            \n             <div class="ttph_add-dropdown dropdown">\n                 <button id="{UNIQUEID1}" type="button" class="dropdown-toggle btn btn-success" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n                     <span class="glyphicon glyphicon-plus"></span>\n                     <span class="caret"></span>\n                 </button>\n                 <ul id="{UNIQUEID2}" class="dropdown-menu" aria-labelledby="{UNIQUEID1}">\n                     <li><a href="#" class="ttph_add-ph" ph-type="statictext"><span class="glyphicon glyphicon-font"></span>&nbsp;&nbsp;Static Text</a></li>\n                     <li><a href="#" class="ttph_add-ph" ph-type="textfield"><span class="glyphicon glyphicon-edit"></span>&nbsp;&nbsp;Text Field</a></li>\n                 </ul>\n             </div>                        \n         </form>',
        'fill-form': '<form class="ttph_fill-form form-inline"></form>'
    };
    var fields = {
        'textfield': '<div class="btn-group ttph_group" role="group" aria-label="...">\n        <span disabled class="btn btn-default ttph_btn-static">{NAME}</span>\n        <input type="text" class="form-control ttph_text" name="__statictext__">\n    </div>',
        'variable': '<span disabled class="ttph_variable-field btn btn-default ttph_btn-static"><strong>$ {NAME}</strong><input type="hidden" name="{NAME}"></span>',
        'static': '<span class="ttph_static-field">{ESC_TEXT}<input type="hidden" name="__statictext__" value="{TEXT}"></span>'
    };
    var default_placeholders = {
        'statictext': '<div class="btn-group ttph_group" role="group" aria-label="...">\n            <span disabled class="btn btn-default ttph_btn-static"><span class="glyphicon glyphicon-font"></span></span>\n            <input type="text" class="form-control ttph_text" name="statictext" placeholder="Static Text">\n            <button type="button" tabindex="-1" class="btn ttph_remove btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\n        </div>',
        'textfield': '<div class="btn-group ttph_group" role="group" aria-label="...">\n            <span disabled class="btn btn-default ttph_btn-static"><span class="glyphicon glyphicon-edit"></span></span>\n            <input type="text" class="form-control ttph_text" name="textfield" placeholder="Field Name">\n            <button type="button" tabindex="-1" class="btn ttph_remove btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\n        </div>',
        '__variable': '<div class="btn-group ttph_group" role="group" aria-label="...">\n            <span disabled class="btn btn-default ttph_btn-static"><span class="glyphicon glyphicon-usd"></span></span>\n            <span disabled class="btn btn-default ttph_btn-static"><strong>{NAME}</strong></span>\n            <input type="hidden" hidden name="variable" value="{NAME}">\n            <button type="button" tabindex="-1" class="btn ttph_remove btn-danger"><span class="glyphicon glyphicon-remove"></span></button>\n        </div>'
    };
    var variable_li = '<li><a href="#" class="ttph_add-ph" ph-type="{NAME}"><span class="glyphicon glyphicon-usd"></span>&nbsp;&nbsp;{NAME}</a></li>';

    ex.builder = function (selector, variables) {
        var parent = $(selector);
        var dropdownID = genID();
        var dropdownListID = genID();
        var formHTML = forms['gen-form'].replace(/{UNIQUEID1}/g, dropdownID).replace(/{UNIQUEID2}/g, dropdownListID);
        var _form = $(formHTML).appendTo(parent);

        var placeholders = $.extend({}, default_placeholders);
        variables.forEach(function (v) {
            placeholders[v] = placeholders['__variable'].replace(/{NAME}/g, v);
            var opt = variable_li.replace(/{NAME}/g, v);
            $(opt).insertAfter($("#" + dropdownListID + ">li:last-of-type"));
        });

        $("#" + dropdownListID + ' .ttph_add-ph').click(function () {
            var type = $(this).attr('ph-type');
            var wrapper = _form.children(".ttph_group-wrapper");
            $(placeholders[type]).appendTo(wrapper);
            reset_ph_handlers();
            return false;
        });

        reset_ph_handlers();
        return {
            'form': function form() {
                return _form.get(0);
            },
            'getTemplate': function getTemplate() {
                return create_format_string(_form.serializeArray());
            }
        };
    };

    ex.filler = function (selector, templateString) {
        var parent = $(selector);
        var formHTML = forms['fill-form'];
        parent.html("");
        var _form2 = $(formHTML).appendTo(parent);

        var formhtml = templateString.replace(/(^|})[^{}]+?({|$)/g, function (staticText) {
            var html = staticText.replace(/[^{}]+/g, function (nobrackets) {
                var esc_text = nobrackets.replace(/&/g, "&amp;").replace(/\ /g, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                var text = nobrackets.replace(/\"/g, '\\"').replace(/\'/g, "\\'");
                return fields["static"].replace(/\n\s*/g, "").replace(/{ESC_TEXT}/g, esc_text).replace(/{TEXT}/g, text);
            });
            return html;
        }).replace(/\{.+?\}/g, function (placeholder) {
            var ph_name = placeholder.replace(/^\{|\}$/g, '');
            if (ph_name.slice(0, 9) == "__FIELD__") {
                // is a editable field
                ph_name = ph_name.slice(9).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                if (ph_name == "") ph_name = "Text";
                var fieldhtml = fields["textfield"].replace(/\n\s*/g, "").replace(/{NAME}/g, ph_name);
                return fieldhtml;
            } else {
                var fieldhtml = fields["variable"].replace(/\n\s*/g, "").replace(/{NAME}/g, ph_name);
                return fieldhtml;
            }
            return "";
        });
        _form2.html(formhtml);
        return {
            'form': function form() {
                return _form2.get(0);
            },
            'getFilledTemplate': function getFilledTemplate() {
                var result = "";
                _form2.serializeArray().forEach(function (field) {
                    if (field.name == "__statictext__") result += field.value;else {
                        result += "{" + field.name + "}";
                    }
                });
                return result;
            }
        };
    };

    ex.populateTemplate = function (tempalteString, variables) {
        var result = tempalteString.replace(/\{.+?\}/g, function (placeholder) {
            var ph_name = placeholder.replace(/^\{|\}$/g, '');
            if (variables[ph_name] === undefined) return placeholder;
            return variables[ph_name];
        });
        return result;
    };

    function reset_ph_handlers() {
        $('.ttph_group-wrapper').sortable();
        $('.ttph_remove').off("click").click(function () {
            $(this).parent().remove();
        });
    }

    function create_format_string(data) {
        console.log(data);
        var format_string = "";
        data.forEach(function (field) {
            if (field.value.indexOf("{") !== -1 || field.value.indexOf("{") !== -1) {
                alert("Fields cannot contain curly brackets!");
                throw "Fields cannot contain curly brackets!";
            }
            if (field.name == "statictext") {
                format_string += field.value;
            } else if (field.name == "textfield") {
                format_string += "{__FIELD__" + field.value + "}";
            } else if (field.name == "variable") {
                format_string += "{" + field.value + "}";
            }
        });
        return format_string;
    }

    var genID_counter = 1;
    function genID() {
        var newID = "ttph-id_" + genID_counter++;
        if (document.getElementById(newID) != null) {
            return genID();
        } else {
            return newID;
        }
    }

    g.textTemplater = ex;
})(window);
