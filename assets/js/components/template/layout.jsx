var BranchMixin = require('baobab-react/mixins').branch;

var SharedBlock = require('./../shared/shared_block.jsx'),
    Navbar = require('./navbar.jsx');

var TemplateBlock = require('./template_block.jsx'),
    RecipientsBlock = require('./recipients_block.jsx'),
    DocForm = require('./doc_form.jsx'),
    HelpersMixin = require('./../../mixins/helpers_mixin.js'),
    TemplateMixin = require('./../../mixins/template_mixin.js'),
    RecipientsManager = require('./../../lib/recipients_manager.js');

var LeadDocsBlock = require('./../../extensions/lead/components/lead_docs_block.jsx'),
    LeadDataBlock = require('./../../extensions/lead/components/lead_data_block.jsx'),
    LeadsSearchBlock = require('./../../extensions/lead/components/leads_search_block.jsx'),
    LeadsSearchResults = require('./../../extensions/lead/components/leads_search_results.jsx'),
    LeadsWelcomeOverlay = require('./../../extensions/lead/components/leads_welcome_overlay.jsx'),
    LeadMixin = require('./../../extensions/lead/lead_mixin.js');

var ProgramMixin = require('./../../extensions/program/program_mixin.js'),
    ProgramBlock = require('./../../extensions/program/components/program_block.jsx');

var TemplateLayout = React.createClass({
    mixins: [LeadMixin, TemplateMixin, BranchMixin, ProgramMixin, HelpersMixin],

    contextTypes: {
        router: React.PropTypes.func
    },

    cursors: {
        allCustomFields: ['allCustomFields'],
        templates: ['package', 'templates'], 
        extensions: ['extensions'],
        sources: ['sources']
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

    handleDocError: function() {
        this.setState({
            docError: false
        });
    },

    handleFormError: function(error) {
        this.setState({
            docError: error,
            templateLoading: false
        });
    },

    handleDocSignatures: function(err, signatures) {
        var templates = this.state.templates,
            templateIndex = this.state.templateIndex,
            recipients = templates[templateIndex].recipients;

        if (err) {
            this.handleFormError(err);
        } else {
            _.each(recipients, function(r, i) {
                var signature = _.select(signatures, function(s) {
                   return s.email == r.email
                });

                var signatureId = signature[0] && signature[0].signature_id;

                if (!signatureId) return false;

                this.cursors.templates.set([
                        templateIndex,
                        "recipients",
                        i,
                        "signatureId"
                    ],
                    signatureId
                );
            }.bind(this));

            this.setLoading(false);
        };
    },

    handleTemplateInputChange: function(e) {
        var i = e.target.value;
        this.setState({
            templateIndex: i
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
        if (this.state.templateLoading && this.state.docError) {
            this.setState({
                templateLoading: false
            });
        };
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

    handleLeadDocDestroy: function(i, e) {
        e.preventDefault();
        console.log("destorying lead doc", i)
        this.destroyLeadDoc(i);
    },

    handleProgramIndexChange: function(e) {
        var index = e.target.value;
        this.cursors.extensions.set("programIndex", index);
    },

    handleProgramTermIndexChange: function(e) {
        var index = e.target.value;
        this.cursors.extensions.set("programTermIndex", index);
    },

    fetchRecipientSignatureUrl: function(recipient, callback) {
        var signatureId = recipient.signatureId,
            templateId = this.currentTemplate().id;
        $.get("/templates/" + templateId + "/signatures/" + signatureId, function(url) {
            callback(null, url);
        })
    },

    isTemplateSigned: function() {
        var template = this.currentTemplate();
        return _.every(template.recipients, function(r, i) {
            return r.signed
        });
    },

    handleRecipientSignature: function(recipient, i, e) {
        e.preventDefault();
        this.fetchRecipientSignatureUrl(recipient, function(err, url) {
            HelloSign.init("716c4ee417732f70ed56e60c599cd7f3");

            HelloSign.open({
                url: url,
                allowCancel: true,
                skipDomainVerification: true,
                messageListener: function(eventData) {
                    var template = this.cursors.templates[this.state.templateIndex];
                    this.cursors.templates.set([this.state.templateIndex, "recipients", i, "signed"], true);
                }.bind(this)
            });

            this.cursors.templates.set([this.state.templateIndex, "recipients", i, "signatureUrl"], url)
        }.bind(this));
    },

    handleRecipientAuthTokenSend: function(i, e) {
        e.preventDefault();

        var recipient = this.getRecipient(i);

        RecipientsManager.sendRecipientAuthToken(recipient, function(err, res) {
            var authError = err && err.message,
                authId = res && res.authId;

            this.setRecipient(i, "authError", authError);
            this.setRecipient(i, "authId", authId);
        }.bind(this));
    },

    handleRecipientAuthTokenChange: function(i, e) {
        e.preventDefault();
        console.log("entered auth token", e.target.value)
        this.setRecipient(i, "authToken", e.target.value);
    },

    handleRecipientAuthTokenSubmit: function(i, e) {
        e.preventDefault();

        var recipient = this.getRecipient(i); 

        RecipientsManager.fetchRecipientAuthStatus(recipient, function(err, res) {
            if (err) return false;
            this.setRecipient(i, "authorized", true)
        }.bind(this));
    },

    handleRemoveRecipientSignatures: function(e) {
        e.preventDefault();
        _.each(this.state.templates[this.state.templateIndex].recipients, function(r, i) {
           this.cursors.templates.set([this.state.templateIndex, "recipients", i, "signatureId"], undefined) 
        }.bind(this));
    },


    render: function() {
        var hasLead = true;
        var template = this.state.templates[this.state.templateIndex];

        var leadsWelcomeOverlay = <LeadsWelcomeOverlay    leads={this.state.leads} 
                                                          leadsSearchInput={this.state.leadsSearchInput}
                                                          vId={this.props.query.vId}
                                                          isLeadsSearching={this.state.isLeadsSearching}
                                                          onLeadsResult={this.handleLeadsResult}
                                                          onLeadsSearch={this.handleLeadsSearch}/>;

        var programBlock = <ProgramBlock  templateLoading={this.state.templateLoading} 
            onProgramIndexChange={this.handleProgramIndexChange}
            onProgramTermIndexChange={this.handleProgramTermIndexChange}
            programIndex={this.state.extensions.programIndex} 
            programTermIndex={this.state.extensions.programTermIndex} 
            programTerms={this.state.extensions.programTerms}
            programs={this.state.extensions.programs} />;

        var templateBlock = <TemplateBlock  packageName={this.packageData.name}
            template={template}
            templates={this.state.templates} 
            templateLoading={this.state.templateLoading}
            onChange={this.handleTemplateInputChange} />;

        var recipientsBlock = <RecipientsBlock  onRecipientChange={this.handleRecipientChange} 
                                                onSignature={this.handleRecipientSignature}
                                                onAuthTokenSend={this.handleRecipientAuthTokenSend}
                                                onAuthTokenChange={this.handleRecipientAuthTokenChange}
                                                onAuthTokenSubmit={this.handleRecipientAuthTokenSubmit}
                                                recipients={template.recipients} />;


            var renderLeadBlock = function() {
                return (
                    <div className="lead-block">
                        <LeadsSearchBlock   leads={this.state.leads} 
                                            vId={this.props.query.vId}
                                            leadsSearchInput={this.state.leadsSearchInput}
                                            onLeadsSearchInput={this.handleLeadsSearchInput}
                                            onLeadsResult={this.handleLeadsResult} 
                                            onLeadsSearch={this.handleLeadsSearch}/> 
                    {
                        this.state.isLeadsSearching || this.state.leads[0]
                            ? (
                                <LeadsSearchResults isLeadsSearching={this.state.isLeadsSearching} onLeadsResult={this.handleLeadsResult} leads={this.state.leads} />
                                ) 
                            : (
                                <LeadDataBlock  lead={this.state.extensions.lead} 
                                                leadPending={this.state.extensions.leadPending} 
                                                customFields={this.state.templates[this.state.templateIndex].customFields}
                                                syncRemote={this.state.syncRemote}
                                                handleSync={this.handleSync} />

                            )
                    }
                    </div>
                );

            }.bind(this)

        

        return (
            <div className="template-layout">
                <Navbar />
                <div className="app-template-inner">
                    <div className="col-sm-3 left-div">
                        <SharedBlock blockBody={templateBlock} 
                                     blockHeader={"Template"} />
                        <SharedBlock blockBody={recipientsBlock} 
                                     blockDescription={"Confirm a recipient by entering the confirmation code sent to the provided email address. Note: Non-leads must use an scitexas.edu email."}
                                     blockHeader={"Recipients"} />
                        <LeadDocsBlock  lead={this.state.extensions.lead} 
                                        onDestroy={this.handleLeadDocDestroy}
                                        docs={this.state.extensions.docs} />
                    </div>
                    <div className="col-sm-6 doc-form-div middle-div">
                        <DocForm    template={template}
                            customFields={this.state.templates[this.state.templateIndex].customFields} 
                            updateCustomField={this.updateCustomField} 
                            removeCustomField={this.removeCustomField}
                            onSignature={this.handleRecipientSignature}
                            onRemoveSignatures={this.handleRemoveRecipientSignatures}
                            campus={this.props.query.campus}
                            docUrl={this.state.docUrl}
                            templateLoading={this.state.templateLoading}
                            onLoading={this.handleFormSubmitLoading}
                            onSignatures={this.handleDocSignatures}
                            onIsReady={this.toggleIsReady}
                            docError={this.state.docError}
                            onDocError={this.handleDocError}
                            signatures={this.state.signatures}
                            recipients={template.recipients}
                            recipientsBlock={recipientsBlock}
                            isRecipientsValid={this.isRecipientsValid}
                            lead={this.state.extensions.lead} />
                    </div>
                    <div className="col-sm-3 right-div">
                        <SharedBlock blockBody={programBlock} 
                                     blockHeader={"Current Program"} />
                         <SharedBlock blockBody={renderLeadBlock()} blockHeader={"Lead"} />
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = TemplateLayout;
