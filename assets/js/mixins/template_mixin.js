var EA_PACKAGE_DATA = require('./../lib/packages/ea_package/package_data.json'),
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

    updateCustomField: function(fieldName, field) {
        this.cursors.templates.set([
            this.state.templateIndex,
            "customFields",
            fieldName
        ], field);

        this.cursors.allCustomFields.set(fieldName, field);

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
            title = template.title
            //templateConfig = this.packageData.config.templates[title],
            config = _.merge(this.packageData.config, template.config),
            fields = {};

        async.each(
            _.keys(template.customFields),
            function(name, callback) {
                var fieldValue,
                    field = template.customFields[name],
                    header = config.headers[field.name],
                    disabledFields = config.disabledFields,
                    optionalFields = config.optionalFields;

                var isOptional = _.any(optionalFields, function(fieldName) {
                    if (fieldName[0] === "*") {
                        return name.match(fieldName.substring(1))
                    };
                    return name === fieldName;
                });

                var isDisabled = _.include(disabledFields, name);

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

                callback && callback(null);
            },
            function(err) {
                template.customFields = fields;
                callback && callback(err, template);
            }.bind(this)
        );
    },


    componentDidMount: function() {
        this.fetchTemplatesAndSetState();
    },

    setStateFromTemplate: function(prevTemplate, template, callback) {
        template.recipients = RecipientsManager.getRecipientsByTemplate(template, prevTemplate);

        _.each(template.recipients, function(r, i) {
            r.signature = undefined;
        });

        this.cursors.templates.set(this.state.templateIndex, template)

        this.handleRemoveRecipientSignatures();

        return callback && callback(null, template);
    },

    fetchTemplatesAndSetState: function() {
        var controller = setTemplateController.call(this);
        controller.getTemplates(function(err, templates) {
            if (err) {
                return this.setState({
                    docError: err
                });
            };

            this.cursors.templates.set(templates);
        }.bind(this));

    },

    fetchTemplateAndSetState: function(prevTemplate) {
        var fetchTemplate = function() {
            var template = this.currentTemplate(),
                title = template.title,
                controller = setTemplateController.call(this),
                callback = function(cb) {
                    return cb(null, template);
                };

            template.config = this.packageData.config.templates[title];

            return template.customFields ? callback : controller.getTemplate.bind(controller);
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

    filterDocsByTemplate: function() {
        var template = this.currentTemplate();
        return _.filter(this.state.extensions.docs, function(d) {
            return d["title"] == template.title
        })
    },

    setCustomFieldsFromDoc: function(doc) {
        var docFields = {},
            custom_fields = doc["custom_fields"],
            docSignatures = doc["signatures"],
            templateIndex = this.state.templateIndex;

        _.each(custom_fields, function(cf) {
            if (cf.name) docFields[cf.name] = cf["value"];
        });

        this.cursors.sources.set("docFields", docFields)
    },

    fetchDocsAndSetState: function(email) {
        var controller = setTemplateController.call(this);
        async.waterfall(
            [
                _.partial(controller.getDocs.bind(controller), email),
                this.setStateFromDocs
            ],
            this._handleLoading
        );

    },

    setStateFromDocs: function(docs, callback) {
        this.cursors.extensions.set('docs', docs);
        callback(null)
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

    handleRecipientChange: function(i, key, e) {
        window.testTemplate = this.state.groupedTemplate;
        window.regTemplate = this.state.templates[this.state.templateIndex]
        if (this.state.groupedTemplate) {
            this.cursors.groupedTemplate.set(
                [
                    "recipients",
                    i,
                    key
                ],
                e.target.value
            );
        } else {
            this.cursors.templates.set(
                [
                    this.state.templateIndex,
                    "recipients", i, key
                ],
                e.target.value
            );
        }
    },

    isRecipientsValid: function(opts) {
        var opts = opts || {},
            template = this.currentTemplate(),
            recipients = template.recipients;

        return _.every(recipients, function(r) {
            if (opts.auth) return r.authorized;

            return !_.isEmpty(r.email) && !_.isEmpty(r.name)
        });
    },


    _handleLoading: function(err, data) {
        var isDone = this.state.docUrl || this.currentTemplate().customFields;
        if (err) {
            this.setState({
                docError: err
            });
        };

        if (isDone) {
            this.setState({
                docUrl: false
            });
        };
    },

    _refreshCustomFields: function() {
        var template = this.currentTemplate(),
            customFields = template && template.customFields,
            templates = this.cursors.templates,
            index = this.state.templateIndex;

        if (!customFields) return false;

        this.setCustomFields(
            template,
            function(err, template) {
                templates.set(index, template);
            }
        );
    },

    hasParentRecipient: function(template) {
        return _.include(template.roles, "Parent/Guardian");
    },

    componentDidUpdate: function(prevProps, prevState) {
        var template = this.state.groupedTemplate || this.state.templates[this.state.templateIndex],
            prevTemplate = prevState.groupedTemplate || prevState.templates[prevState.templateIndex],
            prevAllCustomFields = prevState.allCustomFields;

        if (template && prevTemplate && template.id != prevTemplate.id || template && !prevTemplate) {
            var allCustomFields = _.extend(
                this.state.allCustomFields,
                prevAllCustomFields
            );
            this.cursors.allCustomFields.set(allCustomFields);
            this.fetchTemplateAndSetState(prevTemplate);
        };

        if (this.state.sources != prevState.sources) {
            this._refreshCustomFields();
        };

        if (!this.state.groupTemplates && prevState.groupTemplates) {
            this.cursors.templates.apply(function(templates) {
                return _.map(templates, function(template) {
                    template.inGroup = false;
                    return template;
                });
            });
        };

        // Templates loaded for first time:
        if (this.state.templates[0] && !prevState.templates[0]) {
            //console.log("templates loaded", this.state.templates);
        };

        if (this.state.groupTemplates != prevState.groupTemplates) {
            var templates = _.map(this.state.templates, function(t) {
                var title = t.title,
                    config = this.packageData.config.templates[title]; 

                if (!this.hasParentRecipient(t)) {
                    t.inGroup = this.state.groupTemplates;
                };

                t.config = config;
                this.setCustomFields(t);

                return t;
            }.bind(this));

            this.cursors.templates.set(templates);
        };

        if (this.state.templates != prevState.templates) {
            var groupedTemplate = this.getGroupedTemplate();

            if (this.state.groupedTemplate && groupedTemplate) {
                var cfs = _.pick(this.state.groupedTemplate.customFields, _.keys(groupedTemplate.customFields))
                groupedTemplate.title = "Grouped Template";
                groupedTemplate.customFields = _.extend(groupedTemplate.customFields, cfs);
            }

            this.cursors.groupedTemplate.set(groupedTemplate);
        };

        //if (this.state.templates && !prevState.templates)
    }
};

module.exports = TemplateMixin;
