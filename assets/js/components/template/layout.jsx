var BranchMixin = require('baobab-react/mixins').branch;

var TemplateBlock = require('./template_block.jsx'),
    RecipientBlock = require('./recipient_block.jsx'),
    DocForm = require('./doc_form.jsx'),
    TemplateManager = require('./../../mixins/template_manager.js');

var LeadDocsBlock = require('./../../extensions/lead/components/lead_docs_block.jsx'),
    LeadDataBlock = require('./../../extensions/lead/components/lead_data_block.jsx'),
    LeadsSearchBlock = require('./../../extensions/lead/components/leads_search_block.jsx'),
    LeadsWelcomeOverlay = require('./../../extensions/lead/components/leads_welcome_overlay.jsx'),
    LeadManager = require('./../../extensions/lead/lead_mixin.js');

var TemplateLayout = React.createClass({
    mixins: [LeadManager, TemplateManager, BranchMixin],
    contextTypes: {
        router: React.PropTypes.func
              
    },

    cursors: {
        allCustomFields: ['allCustomFields'],
        recipient: ['recipient'],
        templates: ['package', 'templates'], 
        extensions: ['extensions']
    },

    getInitialState: function() {
        return {
            templateLoading: "Downloading Package Data",
            templateIndex: 0,
            docUrl: false,
            docError: false,
            isLeadsSearching: false,
            leads: []
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

    handleLeadsSearch: function (phone, isEmail) {
        var fetchLeads = function(phone, isEmail, callback) {
            var url;
            if (isEmail) {
                url = '/leads?email='
            } else {
                url = '/leads?phone='
            }
            return $.get(url + phone, function (data) {
                return callback(data)
            });
        };

        //TODO: Move fetchLeads to leadsController...
        console.log("searching for leads")
        this.setState({isLeadsSearching: true, leads: []});
        fetchLeads(phone, isEmail, function (data) {
            //TODO: Move to cursor...
            this.setState({
                isLeadsSearching: false,
                leads: data
            });
        }.bind(this)); 
    },

    handleLeadsResult: function(lead) {
        var vId = lead.id;
        var campus = lead["college/campus_of_interest"];
        this.setState({
            leadsSearchInput: undefined,
            leads: []
        })
        window.location.href = '/#?campus=' + campus + '&vId=' + vId;
    },

    handleLeadsSearchInput: function(input) {
        this.setState({leadsSearchInput: input})
    },


    render: function() {
        var template = this.state.templates[this.state.templateIndex]
        return (
            <div className="template-layout">
                <nav className="navbar navbar-default navbar-fixed-top">
                <LeadsWelcomeOverlay    leads={this.state.leads} 
                                        leadsSearchInput={this.state.leadsSearchInput}
                                        vId={this.props.query.vId}
                                        isLeadsSearching={this.state.isLeadsSearching}
                                        onLeadsResult={this.handleLeadsResult}
                                        onLeadsSearch={this.handleLeadsSearch}/>
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <img alt="Brand" src="/images/sci-logo.png"/>
                            </a>
                            <h5 className="pull-left">SCI Document Manager</h5>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right col-sm-6">
                                <LeadsSearchBlock   leads={this.state.leads} 
                                                    vId={this.props.query.vId}
                                                    leadsSearchInput={this.state.leadsSearchInput}
                                                    onLeadsSearchInput={this.handleLeadsSearchInput}
                                                    onLeadsResult={this.handleLeadsResult} 
                                                    onLeadsSearch={this.handleLeadsSearch}/>
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
                            campus={this.props.query.campus}
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
