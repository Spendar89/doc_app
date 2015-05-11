var EA_PACKAGE_DATA = require('./../lib/packages/ea_package/package_data.json'),
    EA_CUSTOM_METHODS = require('./../lib/packages/ea_package/custom_methods.js'),
    TemplateController = require('./../controllers/template_controller.js');

var setTemplateController = function() {
    var template = this.currentTemplate(), 
        templateId = template && template.id, 
        campus = this.state.campus,
        loaderFn = this.setLoading;

    this.templateController = new TemplateController(templateId, campus, loaderFn);
    return this.templateController;
};

TemplateMixin = {

    packageData: EA_PACKAGE_DATA,
    customMethods: EA_CUSTOM_METHODS,

    updateCustomField: function(fieldName, field) {

        this.cursors.templates.set([
            this.state.templateIndex,
            "customFields",
            fieldName
        ], field);

        //this.cursors.templates.set(this.state.templateIndex, template)

        if (field.customMethod) field.customMethod(this);

        // TODO: Decouple lead logic from template logic.
        this.setLeadPending(fieldName, field.value);
    },

    removeCustomField: function(fieldName) {
        var template = this.cursors.templates.get(this.state.templateIndex),
            cf = template.customFields,
            omitted = _.omit(cf, fieldName);

        template.customFields = omitted;
        this.cursors.templates.set(this.state.templateIndex, template);
        //this.setState({
        //template: template
        //});
    },

    // TODO: change lead var to extension, and add extension argument.
    // This will support additional extensions such as programs.
    setCustomFields: function(template, callback) {
        var lead = this.state.extensions.lead || {},
            template = _.extend(template),
            customFields = this.state.allCustomFields,
            config = this.packageData.config,
            customMethods = this.customMethods,
            fields = {};

        async.each(
            _.keys(template.customFields),
            function(name, callback) {
                var fieldValue,
                    field = template.customFields[name],
                    header = config.headers[field.name],
                    isOptional = _.include(config.optionalFields, name), 
                    isDisabled = _.include(config.disabledFields, name);

                field.header = header;

                // TODO: decouple lead logic from template.
                if (customFields[name]) {
                    fieldValue = customFields[name].value || lead[name];
                } else {
                    fieldValue = lead[name];
                };

                fields[name] = _.extend(field, {
                    value: fieldValue
                });

                if (config.customOptions[name]) {
                    fields[name].options = config.customOptions[name];
                };
                if (config.customTypes[name]) {
                    fields[name].type = config.customTypes[name]
                };

                if (isDisabled) fields[name].disabled = true;
                

                if (customMethods[name]) {
                    fields[name].customMethod = customMethods[name];
                };

                if (isOptional) fields[name].optional = true; 

                callback(null);
            },
            function(err) {
                template.customFields = fields;
                callback(err, template);
            }.bind(this)
        );
    },

    currentTemplate: function() {
        var i = this.state.templateIndex;
        return this.cursors.templates.get(i);
    },

    componentDidMount: function() {
        this.fetchTemplateAndSetState();
    },

    setStateFromTemplate: function(template, callback) {
        this.cursors.templates.set(this.state.templateIndex, template)
        if (callback) callback(null, template);
    },

    fetchTemplateAndSetState: function() {
        var fetchTemplate = function() {
            var template = this.currentTemplate(),
                controller = setTemplateController.call(this),
                callback = function(cb) {
                    return cb(null, template);
                };

            return template.customFields
                ? callback
                : controller.getTemplate.bind(controller);
        }.call(this);

        async.waterfall(
            [
                fetchTemplate,
                this.setCustomFields,
                this.setStateFromTemplate
            ],
            this._handleLoading
        );
    },

    _handleLoading: function(err, data) {
        var isDone = this.state.docUrl || this.currentTemplate().customFields;
        if (err) {
            this.setState({
                docError: err
            });
        }; 

        if (isDone){
            this.setState({
                templateLoading: false,
                docUrl: false
            });
        };
        
    },

    _refreshCustomFields: function() {
        var template = this.currentTemplate(),
            templates = this.cursors.templates,
            index = this.state.templateIndex;

        if (!template.customFields) return false;

        this.setCustomFields(
            template, 
            function(err, template) {
                templates.set(index, template);
            }
        );
    },

    leadDidUpdate: function(lead) {
        if (!lead) return false;
        this._refreshCustomFields();
    }



};

module.exports = TemplateMixin;
