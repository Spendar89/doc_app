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

    isValid: function() {
        if (this.props.templateLoading) return false;
        if (!this.props.isRecipientsValid()) return false;
        return _.every(this.props.customFields, function(field, fieldName) {
            if (field.optional) return true;
            return field.value !== undefined || field.type === "checkbox";
        });
    },

    handleGenerate: function (e) {
        e.preventDefault();

        var lead = this.props.lead || {},
            recipients = _.map(this.props.template.recipients, function(r) {
                r.email_address = r.email;
                r = _.pick(r, ["email_address", "role", "name"]);
                return r;
            });

        this.props.onLoading();

        $.post("/docs", {
            custom_fields: this.transformCustomFields(), 
            template_id: this.props.template.id,
            template_title: this.props.template.title,
            leads_id: lead.LeadsID,
            recipients: recipients,
            campus: this.props.campus
        }, function (data) {
            var err = data.error,
                signatures = data.signatures
            this.props.onSignatures(err, signatures);
        }.bind(this));
    },
    
    searchingStyle: function() {
        return {
            display: (this.props.templateLoading ? "block" : "none")
        };
    },

    errorStyle: function() {
        return {
            display: (this.props.docError ? "block" : "none")
        };
    },

    formStyle: function() {
        return {
            visibility: (!this.props.templateLoading && !this.props.docError ? "visible" : "hidden")
        };
    },

    renderDocError: function() {
        var docError = this.props.docError;
        if (!docError) return false;
        return (
            <div className="error-div col-sm-10 col-sm-offset-2" style={this.errorStyle()}>
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
        var isValidRecipients = function() {
            return _.every(this.props.recipients, function(r) {
                return !_.isEmpty(r.email) && !_.isEmpty(r.name);
            });
        }.bind(this);

        if (this._hasSignatures()) {
            return (
                <button  className="btn-danger btn btn-block" 
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
                <input  disabled={!this.isValid()} 
                        className="btn-primary btn btn-block" 
                        type="submit" 
                        value="Generate Doc" 
                        onClick={this.handleGenerate} />
            ) 
            
        }
        
    },

    _hasSignatures: function() {
        var recipients = this.props.recipients || [];
        return recipients[0] && this.props.recipients[0].signatureId
    },

    render: function() {
        var renderSignaturesBlock = function() {
            return (
                <div className="signatures-block-div">
                    <SignaturesBlock recipients={this.props.recipients} 
                                     onSignature={this.props.onSignature} />
                </div>
            )
        }.bind(this)

        return (
            <div className="doc-form-inner-div col-sm-12">
                <div className="col-sm-12 doc-form-header-div">
                    <h3 className="doc-form-header col-sm-6">
                        {this.props.template.title}
                    </h3>
                    <h3 className="col-sm-6">
                        {this.renderSubmit()}
                    </h3>
                </div>
                <div className="loader-div" style={this.searchingStyle()}>
                    <h3 className="loader-text">{this.props.templateLoading}</h3>
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
