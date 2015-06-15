var BranchMixin = require('baobab-react/mixins').branch,
    ReactSwipe = require('react-swipe');

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

var CampusMixin = require('./../../extensions/campus/campus_mixin.js'),
    CampusBlock = require('./../../extensions/campus/components/campus_block.jsx');

var TemplateLayout = React.createClass({
    mixins: [LeadMixin, TemplateMixin, BranchMixin, ProgramMixin, CampusMixin, HelpersMixin],

    contextTypes: {
        router: React.PropTypes.func
    },

    cursors: {
        allCustomFields: ['allCustomFields'],
        templates: ['package', 'templates'], 
        extensions: ['extensions'],
        sources: ['sources'],
        groupedTemplate: ['groupedTemplateIds']
    },

    getInitialState: function() {
        return {
            templateLoading: {},
            templateIndex: 0,
            docUrl: false,
            docError: false,
            isLeadsSearching: false,
            leads: [],
            validationErrors: [],
            docsEmail: "",
            groupTemplates: false
        }
    },

    setLoading: function(key, text) {
        if (this.state.docError) return false;
        var templateLoading = _.extend(this.state.templateLoading, {})

        templateLoading[key] = text;

        this.setState({
            templateLoading: templateLoading 
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
            templateLoading: {}
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

    handleTemplateInputChange: function(e, i) {
        if (e) i = e.target.value;
        this.setState({
            templateIndex: i,
            validationErrors: []
        });
    },

    handleTemplateCycle: function(prev, e) {
        e.preventDefault();

        var templateIndex = this.state.templateIndex,
            newIndex = templateIndex + 1,
            length = this.state.templates.length - 1;

        if (prev) newIndex = templateIndex - 1;

        if (newIndex < 0) newIndex = length;

        if (newIndex > length) newIndex = 0;

        this.handleTemplateInputChange(null, newIndex);
    },

    handleGroupTemplates: function() {
        var groupTemplates = this.state.groupTemplates;
        this.setState({groupTemplates: !groupTemplates});
    },

    handleTemplateInGroup: function(i) {
        var template = this.state.templates[i];
        this.cursors.templates.set([i, "inGroup"], !template.inGroup);
    },

    handleSync: function(e) {
        var syncRemote = this.state.syncRemote;
        this.setState({
            syncRemote: !syncRemote
        });
    },

    handleFormSubmitLoading: function() {
        this.setState({
            templateLoading: {"doc": "Generating Doc"}
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
                //var leads = _.select(data, function(d) {
                    //return d["college/campus_of_interest"] === this.state.sources.campus["SCI Name"];
                //}.bind(this));
                return callback(data)
            }.bind(this));
        };

        //TODO: Move fetchLeads to leadsController...
        this.setState({isLeadsSearching: true, leads: []});

        fetchLeads.call(this, phone, isEmail, function (data) {
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
        this.setLoading("doc", false)

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

    handleCampusIndexChange: function(e) {
        var index = e.target.value;
        if (!this.props.query.campus) {
            console.log("changing campus index")
            this.cursors.extensions.set("campusIndex", index);
        }
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

    handleCacheState: function(e) {
        if (e) e.preventDefault();
        var leadId = this.state.extensions.lead["LeadsID"];
        $.post("/leads/" + leadId + "/cache_state", {state: this.state}, function(data) {
            console.log("Cache res", data)
        })

    },

    handleFetchCachedState: function(e) {
        if (e) e.preventDefault();
        //var leadId = this.state.extensions.lead["LeadsID"];
        var leadId = "54067";
        $.get("/leads/" + leadId + "/cache", function(data) {
            console.log("Cached!!");
            window.d = data;
            //var data = JSON.parse(data)
            this.replaceState(data)
        }.bind(this))

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
            
        var campusBlock = <CampusBlock  templateLoading={this.state.templateLoading} 
            onCampusIndexChange={this.handleCampusIndexChange}
            campusIndex={this.state.extensions.campusIndex} 
            query={this.props.query}
            campuses={this.state.extensions.campuses} />;

        var templateBlock = <TemplateBlock  packageName={this.packageData.name}
                                            template={template}
                                            templates={this.state.templates} 
                                            templateIndex={this.state.templateIndex}
                                            templateLoading={this.state.templateLoading}
                                            groupTemplates={this.state.groupTemplates}
                                            onGroupTemplates={this.handleGroupTemplates}
                                            onTemplateInGroup={this.handleTemplateInGroup}
                                            onCycle={this.handleTemplateCycle}
                                            onChange={this.handleTemplateInputChange} />;

        var recipientsBlock = <RecipientsBlock  onRecipientChange={this.handleRecipientChange} 
                                                onSignature={this.handleRecipientSignature}
                                                onAuthTokenSend={this.handleRecipientAuthTokenSend}
                                                onAuthTokenChange={this.handleRecipientAuthTokenChange}
                                                onAuthTokenSubmit={this.handleRecipientAuthTokenSubmit}
                                                template={this.currentTemplate()} />;


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
                                                customFields={this.currentTemplate() && this.currentTemplate().customFields}
                                                syncRemote={this.state.syncRemote}
                                                handleSync={this.handleSync} />

                            )
                    }
                    </div>
                );

            }.bind(this)

            var leftDiv = function(cols) {
                return (
                    <div className={"col-sm-" + cols + " left-div"}>
                        <SharedBlock blockBody={templateBlock} 
                            blockDescription={"Cycle through the available templates or select one from the dropdown."}
                            blockHeader={"Templates"} />
                        <SharedBlock blockBody={recipientsBlock} 
                            blockDescription={"Confirm a recipient by entering the confirmation code sent to the provided email address. Note: Non-leads must use an scitexas.edu email."}
                            blockHeader={"Recipients"} />
                    </div>
                )
            };

                var middleDiv = function(cols) {
                    return ( 
                            <div className={"col-sm-" + cols + " doc-form-div middle-div"}>
                                <DocForm    
                                    template={this.currentTemplate()}
                                    groupedTemplateIds={this.currentGroupedTemplateIds()}
                                    onCustomFieldUpdate={this.handleCustomFieldUpdate} 
                                    removeCustomField={this.removeCustomField}
                                    onSignature={this.handleRecipientSignature}
                                    onSignatureReminder={this.handleRecipientSignatureReminder}
                                    onRemoveSignatures={this.handleRemoveRecipientSignatures}
                                    campus={this.props.query.campus}
                                    docUrl={this.state.docUrl}
                                    templateLoading={this.state.templateLoading}
                                    onLoading={this.handleFormSubmitLoading}
                                    onDoc={this.handleDoc}
                                    docError={this.state.docError}
                                    onDocError={this.handleDocError}
                                    signatures={this.state.signatures}
                                    recipients={template && template.recipients}
                                    recipientsBlock={recipientsBlock}
                                    isRecipientsValid={this.isRecipientsValid}
                                    onValidationErrors={this.handleValidationErrors}
                                    validationErrors={this.state.validationErrors || []}
                                    lead={this.state.extensions.lead} />
                            </div>
                           )
                };


                var rightDiv = function(cols) {
                    return (
                        <div className={"col-sm-"+ cols +" right-div"}>
                            <SharedBlock blockBody={campusBlock} 
                                blockHeader={"Campus"} />
                            <SharedBlock blockBody={programBlock} 
                                blockHeader={"Program"} />
                            <SharedBlock blockBody={renderLeadBlock()} blockHeader={"Lead"} />
                            <LeadDocsBlock  lead={this.state.extensions.lead} 
                                onDocClick={this.handleDocClick}
                                onSearch={this.fetchDocsAndSetState.bind(this, this.state.docsEmail)}
                                docsEmail={this.state.docsEmail}
                                onDocsEmail={this.handleDocsEmail}
                                isRecipientsValid={this.isRecipientsValid}
                                template={this.currentTemplate()}
                                docs={this.state.extensions.docs} />
                        </div>

                    )
                };

                var mobileLayout = 
                    <ReactSwipe continuous={true} shouldUpdate={function() {return true}}>
                        <div className="mobile-div">
                            {leftDiv.call(this, 12)}
                        </div>
                        <div className="mobile-div">
                            {middleDiv.call(this, 12)}
                        </div>
                        <div className="mobile-div">
                            {rightDiv.call(this, 12)}
                        </div>
                    </ReactSwipe>

                    var standardLayout =
                        <div>
                            {leftDiv.call(this, 3)}
                            {middleDiv.call(this, 6)}
                            {rightDiv.call(this, 3)}
                        </div>

        

        return (
            <div className="template-layout">
                <Navbar />
                <div className="app-template-inner">
                    <MediaQuery minDeviceWidth={1025}>
                        {standardLayout}
                    </MediaQuery>
                    <MediaQuery maxDeviceWidth={1024}>
                        {mobileLayout}
                    </MediaQuery>
                </div>
            </div>
        );
    }

});

module.exports = TemplateLayout;
