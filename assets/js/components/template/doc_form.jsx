var DocInput = require('./doc_input.jsx'),
    SignaturesBlock = require('./signatures_block.jsx');

var DocForm = React.createClass({

    getInitialState: function() {
        return {
            loaderText: "Downloading Template"
        }
    },

    renderDocInputs: function () {
        var template = this.props.template,
            customFields = template && template.customFields;

        customFields = customFields && _.sortBy(customFields, "index");

        if (_.isEmpty(customFields)) {
            return (
                <h2 className="empty-fields-div">
                    This document does not have any fields, yet still requires a signature.
                </h2>
            );
        };

        return _.map(
            customFields, function (field) {
                var fieldName = field.name;
                return (
                    <div key={fieldName}>
                        {this.renderDocInputHeader(field)}
                        <DocInput field={field} 
                                  onCustomFieldUpdate={this.props.onCustomFieldUpdate} 
                                  fieldName={fieldName} />
                    </div>
                );
            }.bind(this)
        );
    },

    renderDocInputHeader: function (field) {
        if (field.header) {
            return <h2 style={{display: field.display}} className="doc-input-header col-sm-12"><small>{field.header}</small></h2>
        }
    },

    transformCustomFields: function () {
        return _.transform(this.props.template.customFields, function(result, field, name) {
            // if field.value is undefined its because its a checkbox
            // or else it would not have passed validation...
            result[name] = field.value || "";
        });
    },

    validateDoc: function(callback) {
        var errs = [];

        var validRecipients = this.props.isRecipientsValid();  

        var validFields = _.every(this.props.template.customFields, function(field, fieldName) {
            if (field.optional) return true;
            return field.value !== undefined || field.type === "checkbox";
        });

        if (!validRecipients) {
            errs.push("Recipient fields must contain valid name and email address")
        };

        if (!validFields) {
            errs.push("Required fields are still blank")
        }

        return callback(errs);
    },

    generateDoc: function(email) {
        var lead = this.props.lead || {},
            template = this.props.template,
            recipients = _.map(this.props.template.recipients, function(r) {
                r.email_address = r.email;
                r = _.pick(r, ["email_address", "role", "name"]);
                return r;
            });

        this.props.onLoading();

        $.post("/docs", {
            email: email,
            custom_fields: this.transformCustomFields(), 
            template_ids: this.props.groupedTemplateIds,
            template_id: template && template.id,
            template_title: template && template.title,
            leads_id: lead.LeadsID,
            recipients: recipients,
            campus: this.props.campus
        }, function (data) {
            console.log("Doc Data", data)
            var err = data.error,
                doc = data.doc;

            this.props.onDoc(err, doc);
        }.bind(this))
        .fail(function(res) {
            var data = res.responseJSON;
            var err = data.error;

            this.props.onDoc(err);
        }.bind(this))
        
        ;
    },

    sendSignatureRequestReminder: function(recipient, callback, e) {
        e.preventDefault();

        var signatureRequestId = recipient.signature.signatureRequestId;

        $.post("/signature_requests/"+ signatureRequestId +"/remind", recipient, callback)
    },

    handleGenerate: function (email, e) {
        e.preventDefault();

        this.validateDoc(function(errs) {
            this.props.onValidationErrors(errs);
            if (!errs[0]) this.generateDoc(email);
        }.bind(this));
    },
    
    searchingStyle: function() {
        var templateLoading = this.props.templateLoading;
        var isLoading =  templateLoading && _.any(templateLoading);
        return {
            display: (isLoading ? "block" : "none")
        };
    },

    getLoadingText: function() {
        var tl = this.props.templateLoading;
        var vals = _.any(tl) && _.values(tl);
        return _.compact(vals)[0];
    },

    errorStyle: function() {
        return {
            display: (this.props.docError ? "block" : "none")
        };
    },

    formStyle: function() {
        return {
            visibility: (!_.any(this.props.templateLoading) && !this.props.docError ? "visible" : "hidden")
        };
    },

    renderDocError: function() {
        var docError = this.props.docError;
        if (!docError) return false;
        return (
            <div className="error-div col-sm-8 col-sm-offset-2" style={this.errorStyle()}>
                <div className="doc-error">
                    <div className="doc-error-header">
                        <h2>Uh Oh, Something Went Wrong...</h2>
                    </div>
                    <div className="error-details">
                        <h4>Error Details:</h4>
                        <p>Message: {docError.message}</p>
                        <p>Type: {docError.type}</p>
                    </div>
                </div>
            </div>
        );
    },

    renderSubmit: function() {
        var className= !this.props.validationErrors[0] 
            ? "btn-default btn btn-block"
            : "btn-danger btn btn-block";

        if (this._hasSignatures()) {
            return (
                <button  className="btn-default btn btn-block" 
                         onClick={this.props.onRemoveSignatures} >
                    Back
                </button>

            )
        } else if (this.props.docError){
            return (
                <button  className="btn-danger btn btn-block" 
                    onClick={this.props.onDocError} >
                    Back to Form
                </button>

            )

        } else {
            return  (
                <div className="generate-btn-div">
                    <div className="col-sm-6 form-group">
                        <a 
                            disabled={_.any(this.props.templateLoading)} 
                            className={className} 
                            title="Sign By Email"
                            onClick={this.handleGenerate.bind(this, true)}>
                            <span className="glyphicon glyphicon-inbox col-sm-4"></span>
                            <span className="">Sign by Email</span>
                        </a>
                    </div>
                    <div className="col-sm-6 form-group">
                        <a
                            disabled={_.any(this.props.templateLoading)} 
                            className={className}
                            title="Sign in Person"
                            onClick={this.handleGenerate.bind(this, false)} >
                            <span className="glyphicon glyphicon-user col-sm-4"></span>
                            <span className="">Sign in Person</span>
                        </a>
                    </div>
                </div>
            ) 
            
        }
        
    },

    _hasSignatures: function() {
        var recipients = this.props.recipients || [];
        return recipients[0] && this.props.recipients[0].signature
    },

    render: function() {
        //if (this.props.savedDoc && this.props.savedDoc.signatures) {
            //console.log("already has sigss!", this.props.savedDoc.signatures);
            //return this.props.onSignatures(null, this.props.savedDoc.signatures)
        //}
        var template = this.props.template;

        var renderSignaturesBlock = function() {
            return (
                <div className="signatures-block-div">
                    <SignaturesBlock recipients={this.props.recipients} 
                                     onSignatureRequestReminder={this.sendSignatureRequestReminder}
                                     onSignature={this.props.onSignature} />
                </div>
            )
        }.bind(this)

        var headerStyle = function() {
            return this.props.docFormHeaderFixed 
                ? {position: 'fixed', width: '50%', left: '25%'}
                : {position: 'relative', width: '100%', left: '0'}
        }

        return (
            <div className="doc-form-inner-div col-sm-12">
                <div id="docFormHeaderDiv" style={headerStyle.call(this)} className="col-sm-12 doc-form-header-div">
                    {this.props.validationErrors[0]
                        ? (
                            <div>
                                <div className="doc-form-header col-sm-6">
                                    <h3 className="validation-error-header">Validation Errors:</h3>
                                    {_.map(this.props.validationErrors, function(e) {
                                        return <p className="validation-error">- {e}</p>
                                        })}
                                </div>
                                    <h3 className="col-sm-6">
                                        {this.renderSubmit()}
                                    </h3>
                            </div>
                        )
                            : (
                                <div>
                                    <h3 className="doc-form-header col-sm-6">
                                        {template && template.title}
                                    </h3>
                                    <h3 className="col-sm-6">
                                        {this.renderSubmit()}
                                    </h3>
                                </div>

                            )
                    }
                </div>
                <div className="loader-div" style={this.searchingStyle()}>
                    <h3 className="loader-text">{this.getLoadingText()}</h3>
                    <Spinner />
                </div>
                {this.renderDocError()}
                <form className="doc-form col-sm-12">
                    <div className="doc-form-inputs row" style={this.formStyle()}>
                        {this._hasSignatures() ? renderSignaturesBlock() : this.renderDocInputs()}
                    </div>
                </form>
            </div>
        );
    }

});

module.exports = DocForm;
