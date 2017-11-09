# textTemplater

textTemplater contains user-facing and Perl backend tools for building and filling user-defined templates.

**Requires:** jQuery, jQueryUI.sortable, Bootstrap CSS/JS;

## JavaScript

Functionality is contained with the _textTemplater_ global object.

<a name="builder" href="#builder">#</a> _textTemplater_.**builder**(_selector_, _variables_)  
Creates a template-building form within the element idetified with the _selector_. The _variables_ array should contain a strings to be used as variable names. Returns a new _builder_ object.
![alt](/assets/template-builder.png) 

<a name="builder-form" href="#builder-form">#</a> _builder_.**form**()  
Returns the DOM node of the template-building form.

<a name="builder-getTemplate" href="#builder-getTemplate">#</a> _builder_.**getTemplate**()  
Returns the template representation of the contents of the template-building form. For example, `{__FIELD__Name}-{Year}` would be returned for the configuration above.

<a name="filler" href="#filler">#</a> _textTemplater_.**filler**(_selector_, _template_)  
Creates a template-filling form within the element idetified with the _selector_. The _template_ string should comply with the following rules. Any substring matching the pattern `{__FIELD__.+?}` will be treated as a user-editable field. Any remaining substrings matching the pattern `{.+?}` will be treated as non-user-editable variables. The string should contain no other characters matching `({|})`. Returns a new _filler_ object.  
![alt](/assets/template-filler.png)  

<a name="filler-form" href="#filler-form">#</a> _filler_.**form**()  
Returns the DOM node of the template-filling form.

<a name="filler-getTemplate" href="#filler-getTemplate">#</a> _filler_.**getTemplate**()  
Returns the template representation of the contents of the template-filling form. For example, `Foo-{Year}` would be returned for the configuration above.
