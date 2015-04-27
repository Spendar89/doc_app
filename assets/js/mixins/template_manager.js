var EA_PACKAGE_DATA = require('./../lib/packages/ea_package/package_data.json'),
    EA_CUSTOM_METHODS = require('./../lib/packages/ea_package/custom_methods.js');

TemplateManager = {

    packageData: EA_PACKAGE_DATA,
    customMethods: EA_CUSTOM_METHODS,

    updateCustomField: function(fieldName, field) {
        var template = _.extend(this.state.template, {}),
            cf = template.customFields;
        
        cf[fieldName] = field;
        template.customFields = cf;
        this.setState({
            template: template
        });
        if (field.customMethod) field.customMethod(this);
        this.updateLeadPending(fieldName, field.value)
    },

    removeCustomField: function(fieldName) {
        var template = _.extend(this.state.template, {}),
            cf = template.customFields,
            omitted = _.omit(cf, fieldName);

        template.customFields = omitted;
        this.setState({
            template: template
        });
    },

    setCustomFields: function(data) {
        var lead = this.state.lead,
            customFields = this.state.allCustomFields,
            config = this.packageData.config,
            customMethods = this.customMethods,
            fields = {};

        _.each(data.custom_fields, function(field, name) {
            var fieldValue;
            var header = config.headers[field.name]

            field.header = header;

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
            if (customMethods[name]) {
                fields[name].customMethod = customMethods[name];
            };
            if (config.customTypes[name]) {
                fields[name].type = config.customTypes[name]
            };
            if (_.include(config.disabledFields, name)) {
                fields[name].disabled = true;
            };

            return field;
        });

        return fields;
    },

    fetchTemplate: function(callback) {
        var self = this;
        var template = _.extend(this.state.template, {}),
            campus = this.state.campus;
        
        // Use cached customFIelds:
        if (template.customFields) {
            template.customFields = self.setCustomFields(template);
            return callback(null, template);
        };

        return $.get('/templates/' + template.id, {campus: campus}, function(data) {
            data.customFields = self.setCustomFields(data);
            var data = _.extend(data, template);
            return callback(null, data);
        });
    },

    componentWillMount: function() {
        this.fetchTemplateAndSetState();
    },

    fetchTemplateAndSetState: function() {
        this.setLoading("Loading Template")
        async.waterfall([
            this.fetchTemplate,
            function(template) {
                var templates = _.extend(this.state.templates);
                templates[template.index] = template;
                this.setState({
                    template: template,
                    templates: templates,
                    templateLoading: false,
                    docUrl: false
                });
            }.bind(this)
        ])
    }

};

module.exports = TemplateManager;
