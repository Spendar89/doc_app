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
            leads: [],
            validationErrors: [],
            docsEmail: ""
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

    handleFormError: function(err) {
        this.setState({
            docError: err,
            templateLoading: false
        });
    },

    handleDocSignatures: function(signatures, type, signatureRequestId) {
        var templates = this.state.templates,
            templateIndex = this.state.templateIndex,
            recipients = templates[templateIndex].recipients;

        _.each(recipients, function(r, i) {
            var signature = signatures[i];

            if (!signature || !signature.signature_id) return false;

            signature.type = type;
            signature.signatureRequestId = signatureRequestId;

            this.setRecipient(i, "email", signature.signer_email_address);
            this.setRecipient(i, "name", signature.signer_name);
            this.setRecipient(i, "signature", signature)

        }.bind(this));

        this.setLoading(false);
    },

    handleTemplateInputChange: function(e) {
        var i = e.target.value;
        this.setState({
            templateIndex: i,
            validationErrors: []
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

    handleDocsEmail: function(e) {
        e.preventDefault();
        this.setState({docsEmail: e.target.value})
    },

    handleDocClick: function(i, e) {
        e.preventDefault();

        var doc = this.state.extensions.docs[i];
        this.handleDoc(null, doc);

        //this.setCustomFieldsFromDoc(doc);
    },

    handleDoc: function(err, doc) {
        console.log("Here is the doc", doc)

        if (err) {
            this.handleFormError(err);
        } else {
            var type = doc.signing_url ? "email" : "embed",
                signatureRequestId = doc.signature_request_id;

            this.handleDocSignatures(doc.signatures, type, signatureRequestId);
        }
    },

    handleProgramIndexChange: function(e) {
        var index = e.target.value;
        this.cursors.extensions.set("programIndex", index);
    },

    handleProgramTermIndexChange: function(e) {
        var index = e.target.value;
        this.cursors.extensions.set("programTermIndex", index);
    },

    fetchRecipientSignatureUrl: function(recipient, templateId, callback) {
        var signatureId = recipient.signature.signature_id,
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

        var template = this.currentTemplate(),
            callback = _.partial(this.handleRecipientSigned, i);

        RecipientsManager
            .fetchRecipientSignature(recipient, template, callback);
    },

    handleRecipientSigned: function(i, eventData) {
        console.log("Event Data", eventData);
        var templateIndex = this.state.templateIndex;
        this.cursors.templates.set([
            templateIndex, 
            "recipients", 
            i, 
            "signature", 
            "status_code"
        ], "signed");
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
        if (e) e.preventDefault();
        var template = this.currentTemplate();
        _.each(template.recipients, function(r, i) {
            this.setRecipient(i, "signature", undefined)
        }.bind(this));
    },

    handleValidationErrors: function(errs) {
        this.setState({validationErrors: errs});
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
                                        onDocClick={this.handleDocClick}
                                        onSearch={this.fetchDocsAndSetState.bind(this, this.state.docsEmail)}
                                        docsEmail={this.state.docsEmail}
                                        onDocsEmail={this.handleDocsEmail}
                                        isRecipientsValid={this.isRecipientsValid}
                                        template={this.currentTemplate()}
                                        docs={this.state.extensions.docs} />
                    </div>
                    <div className="col-sm-6 doc-form-div middle-div">
                        <DocForm    template={template}
                            customFields={this.state.templates[this.state.templateIndex].customFields} 
                            updateCustomField={this.updateCustomField} 
                            removeCustomField={this.removeCustomField}
                            onSignature={this.handleRecipientSignature}
                            onSignatureReminder={this.handleRecipientSignatureReminder}
                            onRemoveSignatures={this.handleRemoveRecipientSignatures}
                            campus={this.props.query.campus}
                            docUrl={this.state.docUrl}
                            templateLoading={this.state.templateLoading}
                            onLoading={this.handleFormSubmitLoading}
                            onDoc={this.handleDoc}
                            onIsReady={this.toggleIsReady}
                            docError={this.state.docError}
                            onDocError={this.handleDocError}
                            signatures={this.state.signatures}
                            recipients={template.recipients}
                            recipientsBlock={recipientsBlock}
                            isRecipientsValid={this.isRecipientsValid}
                            onValidationErrors={this.handleValidationErrors}
                            validationErrors={this.state.validationErrors}
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
