var EA_PACKAGE_DATA = require('./../lib/packages/ea_package/package_data.json'),
    EA_CUSTOM_METHODS = require('./../lib/packages/ea_package/custom_methods.js');

TemplateManager = {

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
        this.updateLeadPending(fieldName, field.value);
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
                    header = config.headers[field.name];

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
                if (_.include(config.disabledFields, name)) {
                    fields[name].disabled = true;
                };

                if (customMethods[name]) {
                    fields[name].customMethod = customMethods[name];
                };

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

    fetchTemplate: function(callback) {
        var self = this,
            template = this.currentTemplate(),
            campus = this.state.campus;
        console.log("we got a template", template)

        this.setLoading("Loading Template");

        // Use cached customFIelds:
        if (template.customFields) {
            return callback(null, template);
        };

        return $.get('/templates/' + template.id, {
            campus: campus
        }, function(data) {
            data.customFields = data.custom_fields;
            return callback(null, data);
        });
    },

    //componentWillMount: function() {
        //this.fetchTemplateAndSetState();
    //},

    setStateFromTemplate: function(template, callback) {
        console.log("Setting template", template)
        this.cursors.templates.set(this.state.templateIndex, template)
        callback(null, template);
    },

    fetchTemplateAndSetState: function() {
        async.waterfall([
            this.fetchTemplate,
            this.setCustomFields,
            this.setStateFromTemplate
        ], function(err, data) {
            if (err) {
                this.setState({
                    docError: err
                });
            } else {
                this.setState({
                    templateLoading: false,
                    docUrl: false
                });
            };
        }.bind(this));
    }

};

module.exports = TemplateManager;
