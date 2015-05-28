var EA_PACKAGE_DATA = require('./../lib/packages/ea_package/package_data.json'),
    EA_CUSTOM_METHODS = require('./../lib/packages/ea_package/custom_methods.js'),
    TemplateController = require('./../controllers/template_controller.js'),
    RecipientsManager = require('./../lib/recipients_manager.js');

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
    },

    setCustomFields: function(template, callback) {
        var sources = this.state.sources,
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

                if (customFields[name] && customFields[name].value) {
                    fieldValue = customFields[name].value;
                } else {
                    _.each(sources, function(source, key) {
                        if (source && source[name]) {
                            fieldValue = source[name]
                        }
                    });
                };

                fields[name] = _.extend(field, {
                    value: fieldValue,
                    options: config.customOptions[name],
                    type: config.customTypes[name] || field.type,
                    disabled: isDisabled,
                    optional: isOptional
                });

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

    setStateFromTemplate: function(prevTemplate, template, callback) {
        template.recipients = RecipientsManager.getRecipientsByTemplate(template, prevTemplate);

        this.cursors.templates.set(this.state.templateIndex, template)

        this.handleRemoveRecipientSignatures();

        return callback && callback(null, template);
    },

    fetchTemplateAndSetState: function(prevTemplate) {
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
                _.partial(this.setStateFromTemplate, prevTemplate)
            ],
            this._handleLoading
        );
    },

    //sendRecipientAuthToken: function(recipient, callback) {
        //var controller = setTemplateController.call(this);
        //controller.sendRecipientAuthToken(recipient, callback);
    //},

    //fetchRecipientAuthStatus: function(recipient, callback) {
        //var controller = setTemplateController.call(this);
        //controller.fetchRecipientAuthStatus(recipient, callback);
         //Do Something
    //},

    _setStateFromSignatures: function() {
        //TODO: move handleDocSignatures
    },

    _fetchSignatures: function() {
        //TODO: move post doc code from doc_form
    },

    fetchSignaturesAndSetState: function() {

    },

    toggleIsReady: function() {
        var i = this.state.templateIndex,
            isReady = this.state.templates[i].isReady;

        this.cursors.templates.set([
            i, "isReady"
        ], !isReady);

        this.setLoading(false);
    },

    handleRecipientChange: function(i, key, e) {
        this.cursors.templates.set(
            [
                this.state.templateIndex,
                "recipients", i, key
            ],
            e.target.value
        );
    },

    isRecipientsValid: function() {
        var template = this.currentTemplate(),
            recipients = template.recipients;
        return _.every(recipients, function(r) {
           return r.email && r.name; 
        });
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

    componentDidUpdate: function(prevProps, prevState) {
        var template = this.state.templates[this.state.templateIndex],
            prevTemplate = prevState.templates[prevState.templateIndex];

        if (template && template.id != prevTemplate.id) {
            var allCustomFields = _.extend(
                this.state.allCustomFields, 
                prevTemplate.customFields
            );
            this.cursors.allCustomFields.set(allCustomFields);
            this.fetchTemplateAndSetState(prevTemplate);
        }

        if (this.state.sources != prevState.sources) {
            this._refreshCustomFields();
        }
    }
};

module.exports = TemplateMixin;
