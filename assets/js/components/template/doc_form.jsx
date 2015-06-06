var DocInput = require('./doc_input.jsx'),
    SignaturesBlock = require('./signatures_block.jsx');

var DocForm = React.createClass({

    getInitialState: function() {
        return {
            loaderText: "Downloading Template"
        }
    },

    renderDocInputs: function () {
        return _.map(
            this.props.customFields, function (field, fieldName) {
                return (
                    <div key={fieldName}>
                        {this.renderDocInputHeader(field)}
                        <DocInput field={field} 
                                  updateField={this.props.updateCustomField} 
                                  fieldName={fieldName} />
                    </div>
                );
            }.bind(this)
        );
    },

    renderDocInputHeader: function (field) {
        if (field.header) {
            return <h2 className="doc-input-header col-sm-12"><small>{field.header}</small></h2>
        }
    },

    transformCustomFields: function () {
        return _.transform(this.props.customFields, function(result, field, name) {
            // if field.value is undefined its because its a checkbox
            // or else it would not have passed validation...
            result[name] = field.value || "";
        });
    },

    validateDoc: function(callback) {
        var errs = [];

        var validRecipients = this.props.isRecipientsValid();  

        var validFields = _.every(this.props.customFields, function(field, fieldName) {
            if (field.optional) return true;
            return field.value !== undefined || field.type === "checkbox";
        });

        if (!validRecipients) {
            errs.push("Recipient fields are still blank")
        };

        if (!validFields) {
            errs.push("Required fields are still blank")
        }

        return callback(errs);
    },

    generateDoc: function(email) {
        var lead = this.props.lead || {},
            recipients = _.map(this.props.template.recipients, function(r) {
                r.email_address = r.email;
                r = _.pick(r, ["email_address", "role", "name"]);
                return r;
            });

        this.props.onLoading();

        $.post("/docs", {
            email: email,
            custom_fields: this.transformCustomFields(), 
            template_id: this.props.template.id,
            template_title: this.props.template.title,
            leads_id: lead.LeadsID,
            recipients: recipients,
            campus: this.props.campus
        }, function (data) {
            var err = data.error,
                doc = data.doc;

            this.props.onDoc(err, doc);
        }.bind(this));
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
            ? "btn-primary btn btn-block"
            : "btn-danger btn btn-block";

        if (this._hasSignatures()) {
            return (
                <button  className="btn-primary btn btn-block" 
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
                    <div className="col-sm-6">
                        <input  disabled={_.any(this.props.templateLoading)} 
                                className={className} 
                                type="submit" 
                                value="Sign by Email" 
                                onClick={this.handleGenerate.bind(this, true)} />
                    </div>
                    <div className="col-sm-6">
                        <input  disabled={_.any(this.props.templateLoading)} 
                                className={className}
                                type="submit" 
                                value="Sign in Person" 
                                onClick={this.handleGenerate.bind(this, false)} />
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

        if (this.props.validationErrors[0]) {
            console.log("ValidationErrors", this.props.validationErrors);
        };

        var renderSignaturesBlock = function() {
            return (
                <div className="signatures-block-div">
                    <SignaturesBlock recipients={this.props.recipients} 
                                     onSignatureRequestReminder={this.sendSignatureRequestReminder}
                                     onSignature={this.props.onSignature} />
                </div>
            )
        }.bind(this)

        return (
            <div className="doc-form-inner-div col-sm-12">
                <div className="col-sm-12 doc-form-header-div">
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
                                        {this.props.template.title}
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
