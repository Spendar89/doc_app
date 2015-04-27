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
        var templates = this.packageData.templates,
            campus = this.props.query.campus;

        return {
            campus: campus,
            allCustomFields: {},
            recipient: {},
            templates: templates, 
            template: templates[0],
            templateLoading: "Downloading Package Data",
            docUrl: false
        }
    },

    setLoading: function(text) {
        if (this.state.docError) return false;
        this.setState({
            templateLoading: text
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
        this.setState({
            docUrl: data.url,
            templateLoading: false
        });

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
        var recipient = _.extend(this.state.recipient, {
            email: e.target.value
        });
        this.setState({
            recipient: recipient
        });
    },

    handleLeadNameInputChange: function(e) {
        var recipient = _.extend(this.state.recipient, {
            name: e.target.value
        });
        this.setState({
            recipient: recipient
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


    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.template && this.state.template.id != prevState.template.id) {
            var allCustomFields = _.extend(
                this.state.allCustomFields, 
                prevState.template.customFields
            );
            this.setState({allCustomFields: allCustomFields});
            this.fetchTemplateAndSetState();
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
                    <TemplateInput  packageName={this.packageData.name}
                                    template={this.state.template}
                                    templates={this.state.templates} 
                                    templateLoading={this.state.templateLoading}
                                    onChange={this.handleTemplateInputChange} 
                                    onSubmit={this.handleTemplateInputSubmit}/>
                    <LeadInputs onEmailChange={this.handleLeadEmailInputChange} 
                                onNameChange={this.handleLeadNameInputChange} 
                                recipient={this.state.recipient} />
                    <LeadDocs   lead={this.state.lead} docs={this.state.docs} />
                </div>
                <div className="col-sm-6 doc-form-div middle-div">
                    <DocForm    template={this.state.template}
                                customFields={this.state.template.customFields} 
                                callCustomMethod={this.callCustomMethod}
                                updateCustomField={this.updateCustomField} 
                                removeCustomField={this.removeCustomField}
                                campus={this.state.campus}
                                docUrl={this.state.docUrl}
                                templateLoading={this.state.templateLoading}
                                onLoading={this.handleFormSubmitLoading}
                                onComplete={this.handleFormComplete}
                                docError={this.state.docError}
                                onDocError={this.handleDocError}
                                email={this.state.recipient.email}
                                name={this.state.recipient.name}
                                lead={this.state.lead} />
                </div>
                <div className="col-sm-3 right-div">
                    <LeadData   lead={this.state.lead} 
                                leadPending={this.state.leadPending} 
                                customFields={this.state.template.customFields}
                                syncRemote={this.state.syncRemote}
                                handleSync={this.handleSync} />
                </div>
            </div>
        );
    }

});

module.exports = LeadShowTemplate;
