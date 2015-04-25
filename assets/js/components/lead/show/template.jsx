var LeadDocs = require('./lead_docs.jsx'),
    TemplateInput = require('./template_input.jsx'),
    LeadInputs = require('./lead_inputs.jsx'),
    LeadData = require('./lead_data.jsx'),
    DocForm = require('./../../doc/new/doc_form.jsx'),
    LeadsController = require('./../../../controllers/leads_controller.js'),
    EA_PACKAGE_DATA = require('./../../../lib/packages/ea_package/package_data.json'),
    EA_CUSTOM_METHODS = require('./../../../lib/packages/ea_package/custom_methods.js'),
    PackageManager = require('./../../../lib/package_manager.js'),
    packageManager = new PackageManager(EA_PACKAGE_DATA, EA_CUSTOM_METHODS);

var LeadShowTemplate = React.createClass({

    getInitialState: function() {
        return {
            lead: {},
            customFields: false,
            syncRemote: true,
            leadUpdates: {},
            packageName: packageManager.packageData.name,
            templates: packageManager.packageData.templates,
            name: "",
            email: "",
            docUrl: false,
            templateLoading: "Downloading Package Data"
        }
    },

    setTemplateFromLead: function(lead) {
        if (!this.state.docError) {
            this.setState({
                templateLoading: "Loading Template"
            })
        };
        packageManager.fetchTemplate(
            lead,
            this.state.template.id,
            this.state.customFields,
            function(fields, template) {
                this.setState({
                    customFields: fields,
                    template: template,
                    templateLoading: false,
                    docUrl: false
                });
            }.bind(this)
        );
    },

    fetchLeadDocuments: function(lead, callback) {
        this.setState({
            templateLoading: "Loading Lead Documents"
        });
        LeadsController.DocsController.index(lead, function(data) {
            this.setState({
                docs: data
            });
            if (callback) callback(lead);
        }.bind(this))
    },

    updateCustomField: function(fieldName, field) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = field;
        this.setState({
            customFields: cf
        });
        if (field.customMethod) field.customMethod(this);
        if (_.has(this.state.lead, fieldName)) {
            this.updateLeadUpdate(fieldName, field.value)
        }
    },
    
    updateLeadUpdate: function(key, value) {
        var lu = _.extend(this.state.leadUpdates, {});
        lu[key] = value;
        this.setState({
            leadUpdates: lu
        });
    },

    updateLead: function(cb) {
        this.setState({
            templateLoading: "Syncing Lead Data"
        });
        LeadsController.update(
            this.state.lead["LeadsID"], 
            function(data){
                if (cb) return cb(data);
                var leadId = this.props.params.leadId;
                LeadsController.show(leadId, this.setStateFromLead);
            }.bind(this)
        );
    },

    removeCustomField: function(fieldName) {
        var cf = _.extend(this.state.customFields, {});
        var omitted = _.omit(cf, fieldName);
        this.setState({
            customFields: omitted
        });

    },

    callCustomMethod: function(customMethod) {
        customMethod(this);
    },


    setStateFromLead: function(lead) {
        if (lead["error"]) {
            this.setState({
                docError: lead["error"],
                templateLoading: false
            });
            this.setTemplateFromLead(this.state.lead);
            return false;
        };
        this.setState({
            lead: lead,
            email: lead["Email"],
            templateLoading: "Loading Template",
            name: lead["FName"] + " " + lead["LName"]
        });
        this.fetchLeadDocuments(lead, this.setTemplateFromLead);
    },

    handleDocError: function() {
        this.setState({
            docError: false
        });
    },

    handleTemplateInputSubmit: function() {
        this.setTemplateFromLead(this.state.lead);
    },

    handleFormSuccess: function(data) {
        var cb = function() {
            this.setState({
                docUrl: data.url,
                templateLoading: false
            });
        }.bind(this);

        this.state.syncRemote && _.any(this.state.leadUpdates) 
            ? this.updateLead(cb) 
            : cb();
    },

    handleFormError(error) {
        this.setState({
            docError: error,
            templateLoading: false
        });
    },

    handleFormComplete: function(data) {
        if (data.error) {
            this.handleFormError(data.error);
        } else {
            this.handleFormSuccess(data);
        }
    },

    handleTemplateInputChange: function(e) {
        var templateId = e.target.value;
        this.setState({
            template: {
                id: templateId
            }
        });
    },

    handleLeadEmailInputChange: function(e) {
        var val = e.target.value;
        this.setState({
            email: val
        })
    },

    handleLeadNameInputChange: function(e) {
        var val = e.target.value;
        this.setState({
            name: val
        });
    },

    handleSync: function(e) {
        var syncRemote = this.state.syncRemote;
        this.setState({
            syncRemote: !syncRemote
        });
    },

    handleFormSubmitLoading: function() {
        this.setState({
            templateLoading: "Generating Doc"
        });
    },

    componentWillMount: function() {
        var template = this.state.templates[0]
        var leadId = this.props.params.leadId;
        this.setState({
            template: template,
            templateLoading: "Loading Package"
        });
        LeadsController.show(leadId, this.setStateFromLead);
    },

    componentWillReceiveProps: function(nextProps) {
        var oldLeadId = this.props.params.leadId;
        var newLeadId = nextProps.params.leadId;
        if (oldLeadId != newLeadId) {
            LeadsController.show(newLeadId, this.setStateFromLead);
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.template && this.state.template.id != prevState.template.id) {
            this.setTemplateFromLead(this.state.lead);
        }
    },

    render: function() {
        return (
            <div className="app-template-inner">
                <div className="col-sm-3 left-div">
                    <TemplateInput 
                        packageName={this.state.packageName}
                        template={this.state.template}
                        templates={this.state.templates} 
                        templateLoading={this.state.templateLoading}
                        onChange={this.handleTemplateInputChange} 
                        onSubmit={this.handleTemplateInputSubmit}/>
                    <LeadInputs onEmailChange={this.handleLeadEmailInputChange} 
                                onNameChange={this.handleLeadNameInputChange} 
                                name={this.state.name} email={this.state.email} />
                    <LeadDocs lead={this.state.lead} docs={this.state.docs} />
                </div>
                <div className="col-sm-6 doc-form-div middle-div">
                    <DocForm template={this.state.template}
                             customFields={this.state.customFields} 
                             callCustomMethod={this.callCustomMethod}
                             updateCustomField={this.updateCustomField} 
                             removeCustomField={this.removeCustomField}
                             docUrl={this.state.docUrl}
                             templateLoading={this.state.templateLoading}
                             onLoading={this.handleFormSubmitLoading}
                             onComplete={this.handleFormComplete}
                             docError={this.state.docError}
                             onDocError={this.handleDocError}
                             lead={this.props.lead}
                             email={this.state.email}
                             name={this.state.name}
                             lead={this.state.lead} />
                </div>
                <div className="col-sm-3 right-div">
                    <LeadData lead={this.state.lead} 
                              leadUpdates={this.state.leadUpdates} 
                              customFields={this.state.customFields}
                              syncRemote={this.state.syncRemote}
                              handleSync={this.handleSync}
                              handleSubmit={this.updateLead} />
                </div>
            </div>
        )
    }

});

module.exports = LeadShowTemplate;
