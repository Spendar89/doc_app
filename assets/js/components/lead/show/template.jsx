var LeadDocs = require('./lead_docs.jsx'),
    TemplateInput = require('./template_input.jsx'),
    LeadInputs = require('./lead_inputs.jsx'),
    LeadData = require('./lead_data.jsx'),
    DocForm = require('./../../doc/new/doc_form.jsx'),
    LeadManager = require('./../../../mixins/lead_manager.js'),
    TemplateManager = require('./../../../mixins/template_manager.js');

var LeadShowTemplate = React.createClass({
    mixins: [LeadManager, TemplateManager],

    getInitialState: function() {
        var templates = this.packageData.templates;

        return {
            lead: {},
            leadUpdates: {},
            allCustomFields: {},
            templates: templates, 
            template: templates[0],
            templateLoading: "Downloading Package Data",
            syncRemote: true,
            docUrl: false
        }
    },

    updateLeadUpdate: function(key, value) {
        var lu = _.extend(this.state.leadUpdates, {});
        lu[key] = value;
        this.setState({
            leadUpdates: lu
        });
    },

    callCustomMethod: function(customMethod) {
        customMethod(this);
    },

    handleDocError: function() {
        this.setState({
            docError: false
        });
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
        var i = e.target.value;
        var template = this.state.templates[i];
        template.index = i;
        console.log("cf", template.customFields);
        this.setState({
            template: template 
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
        this.fetchLeadAndSetState();
    },

    componentWillReceiveProps: function(nextProps) {
        var oldLeadId = this.props.params.leadId;
        var newLeadId = nextProps.params.leadId;
        if (oldLeadId != newLeadId) {
            this.fetchLeadAndSetState(newLeadId);
        };
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.template && this.state.template.id != prevState.template.id) {
            var allCustomFields = _.extend(
                this.state.allCustomFields, 
                prevState.template.customFields
            );
            this.setState({allCustomFields: allCustomFields});
            this.setTemplateFromLead(this.state.lead);
        }
        if (this.state.templateLoading && this.state.docError) {
            this.setState({
                templateLoading: false
            });
        }
    },

    render: function() {
        return (
            <div className="app-template-inner">
                <div className="col-sm-3 left-div">
                    <TemplateInput 
                        packageName={this.packageData.name}
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
                        customFields={this.state.template.customFields} 
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
                        customFields={this.state.template.customFields}
                        syncRemote={this.state.syncRemote}
                        handleSync={this.handleSync}
                        handleSubmit={this.updateLead} />
                </div>
            </div>
        );
    }

});

module.exports = LeadShowTemplate;
