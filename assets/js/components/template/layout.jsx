var TemplateBlock = require('./template_block.jsx'),
    RecipientBlock = require('./recipient_block.jsx'),
    DocForm = require('./doc_form.jsx'),
    TemplateManager = require('./../../mixins/template_manager.js');

var LeadDocsBlock = require('./../../extensions/lead/components/lead_docs_block.jsx'),
    LeadDataBlock = require('./../../extensions/lead/components/lead_data_block.jsx'),
    LeadsSearchBlock = require('./../../extensions/lead/components/leads_search_block.jsx'),
    LeadManager = require('./../../extensions/lead/lead_mixin.js'),
    BranchMixin = require('baobab-react/mixins').branch;

var TemplateLayout = React.createClass({
    mixins: [LeadManager, TemplateManager, BranchMixin],

    cursors: {
        allCustomFields: ['allCustomFields'],
        recipient: ['recipient'],
        templates: ['package', 'templates'], 
        extensions: ['extensions']
    },

    getInitialState: function() {
        return {
            campus: "Austin",
            templateLoading: "Downloading Package Data",
            templateIndex: 0,
            docUrl: false,
            docError: false
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

    handleFormError: function(error) {
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
        this.setState({
            templateIndex: i
        });
    },

    handleLeadEmailInputChange: function(e) {
        var email = e.target.value;
        this.cursors.recipient.set('email', email);
    },

    handleLeadNameInputChange: function(e) {
        var name = e.target.value;
        this.cursors.recipient.set('name', name);
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
        var template = this.state.templates[this.state.templateIndex];
        var prevTemplate = prevState.templates[prevState.templateIndex];
        if (template && template.id != prevTemplate.id) {
            var allCustomFields = _.extend(
                this.state.allCustomFields, 
                prevTemplate.customFields
            );
            this.cursors.allCustomFields.set(allCustomFields);
            this.fetchTemplateAndSetState();
        }
        if (this.state.templateLoading && this.state.docError) {
            this.setState({
                templateLoading: false
            });
        }
    },

    handleLeadsSearch: function(leads) {
        this.setState({
            leads: leads,
            searching: false
        });
    },

    handleLeadsResult: function(lead) {
        this.setState({
            leadId: lead.id,
            campus: lead["college/campus_of_interest"]
        })
    },

    render: function() {
                var template = this.state.templates[this.state.templateIndex]
        return (
            <div className="template-layout">
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <img alt="Brand" src="/images/sci-logo.png"/>
                            </a>
                            <h5 className="pull-left">SCI Document Manager</h5>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <LeadsSearchBlock onLeadsResult={this.handleLeadsResult} handleLeadsSearch={this.handleLeadsSearch}/>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="app-template-inner">
                    <div className="col-sm-3 left-div">
                        <TemplateBlock  packageName={this.packageData.name}
                            template={template}
                            templates={this.state.templates} 
                            templateLoading={this.state.templateLoading}
                            onChange={this.handleTemplateInputChange} 
                            onSubmit={this.handleTemplateInputSubmit}/>
                        <RecipientBlock onEmailChange={this.handleLeadEmailInputChange} 
                            onNameChange={this.handleLeadNameInputChange} 
                            recipient={this.state.recipient} />
                        <LeadDocsBlock  lead={this.state.extensions.lead} 
                            docs={this.state.extensions.docs} />
                    </div>
                    <div className="col-sm-6 doc-form-div middle-div">
                        <DocForm    template={template}
                            customFields={this.state.templates[this.state.templateIndex].customFields} 
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
                            lead={this.state.extensions.lead} />
                    </div>
                    <div className="col-sm-3 right-div">
                        <LeadDataBlock  lead={this.state.extensions.lead} 
                            leadPending={this.state.extensions.leadPending} 
                            customFields={this.state.templates[this.state.templateIndex].customFields}
                            syncRemote={this.state.syncRemote}
                            handleSync={this.handleSync} />
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = TemplateLayout;
