var LeadDocs = require('./lead_docs.jsx'),
    TemplateInput = require('./template_input.jsx'),
    LeadInputs = require('./lead_inputs.jsx'),
    LeadData = require('./lead_data.jsx'),
    DocForm = require('./../../doc/new/doc_form.jsx'),
    EA_PACKAGE_DATA = require('./../../../lib/data/packages/ea_package.json'),
    CUSTOM_METHODS = require('./../../../lib/custom_methods.js'),
    Package = require('./../../../lib/package.js');

var fetchLead = function (leadId, callback) {
    return $.get('/leads/' + leadId, function(data) {
        return callback(data)
    });
};

var EAPackage = new Package(EA_PACKAGE_DATA, CUSTOM_METHODS);

var LeadShowTemplate = React.createClass({

    getInitialState: function () {
        return {
            lead: {},
            customFields: false,
            syncRemote: true,
            leadUpdates: {},
            packageName: EAPackage.data.name,
            templates: EAPackage.data.templates,
            name: "",
            email: "",
            docUrl: false,
            templateLoading: "Downloading Package Data"
        }
    },

    setTemplateFromLead: function (lead) {
        this.setState({templateLoading: "Loading Template"})
        EAPackage.fetchTemplate(
            lead, 
            this.state.template.id, 
            this.state.customFields, 
            function(fields, template) {
                this.setState(
                    {
                        customFields: fields, 
                        template: template,
                        templateLoading: false,
                        docUrl: false
                    }
                );
            }.bind(this)
        );
    },

    fetchLeadDocuments: function (lead, callback) {
        this.setState({templateLoading: "Loading Lead Documents"});
        $.get('/leads/' + lead["LeadsID"] + '/docs', function (data) {
            this.setState({docs: data});
            if (callback) callback(lead);
        }.bind(this));
    },

    updateCustomField: function (fieldName, field) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = field;
        this.setState({customFields: cf});
        if (field.customMethod) field.customMethod(this);
        if (_.has(this.state.lead, fieldName)) {
            this.updateLeadUpdate(fieldName, field.value)
        }
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

    updateLeadUpdate: function (key, value) {
        var lu = _.extend(this.state.leadUpdates, {});
        lu[key] = value;
        this.setState({leadUpdates: lu});
    },

    updateLead: function (cb) {
        this.setState({templateLoading: "Syncing Lead Data"});
        $.ajax({
            url: "/leads/" + this.state.lead["LeadsID"],
            method: "PUT",
            data: {lead: this.state.leadUpdates}
        })
        .success(function(data) {
            if (cb) {
                cb(data)   
            } else {
                fetchLead(this.props.params.leadId, this.setStateFromLead);
            };
        }.bind(this));
    },

    setStateFromLead: function (lead) {
        this.setState(
            { lead: lead, 
                email: lead["Email"], 
                templateLoading: "Loading Template",
                name: lead["FName"] + " " + lead["LName"] });
        this.fetchLeadDocuments(lead, this.setTemplateFromLead);
    },

    handleDocError: function() {
        this.setState({docError: false});
    },

    handleTemplateInputSubmit: function () {
       this.setTemplateFromLead(this.state.lead);
    },
    
    componentWillMount: function () {
        var template = this.state.templates[0]
        this.setState({template: template, templateLoading: "Loading Package"});
        fetchLead(this.props.params.leadId, this.setStateFromLead);
    },

    componentWillReceiveProps: function (nextProps) {
        var oldLeadId = this.props.params.leadId;
        var newLeadId = nextProps.params.leadId;
        if (oldLeadId != newLeadId) {
            fetchLead(newLeadId, this.setStateFromLead);
        }
    },

    handleFormSuccess: function(data) {
        var cb = function () {
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

    handleFormComplete: function (data) {
        console.log(data)
        if (data.error) {
            this.handleFormError(data.error);
        } else {
            this.handleFormSuccess(data);
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.template && this.state.template.id != prevState.template.id) {
            this.setTemplateFromLead(this.state.lead);
        }
    },

    handleTemplateInputChange: function (e) {
        var templateId = e.target.value;
        this.setState({
            template: {id: templateId}
        });   
    },

    handleLeadEmailInputChange: function (e) {
        var val = e.target.value;
        this.setState({email: val})
    },

    handleLeadNameInputChange: function (e) {
        var val = e.target.value;
        this.setState({name: val});   
    },

    handleSync: function (e) {
        var syncRemote = this.state.syncRemote;
        this.setState({syncRemote: !syncRemote});
    },

    handleFormSubmitLoading: function() {
        this.setState({
            templateLoading: "Generating Doc"
        });
    },

    getMiddleDivClass: function() {
        if (this.state.docError) {
            return "doc-error";
        } else {
            return "";
        };
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
