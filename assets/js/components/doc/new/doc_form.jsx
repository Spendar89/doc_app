var DocInput = require('./doc_input.jsx');

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
                    <div>
                        {this.renderDocInputHeader(field)}
                        <DocInput field={field} 
                                  updateField={this.props.updateCustomField} 
                                  callCustomMethod={this.props.callCustomMethod}
                                  fieldName={fieldName} />
                    </div>
                );
            }.bind(this)
        );
    },

    renderDocInputHeader: function (field) {
        if (field.header) {
            return <h2 className="doc-input-header"><small>{field.header}</small></h2>
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
        return _.every(this.props.customFields, function(field, fieldName) {
            return field.value !== undefined || field.type === "checkbox";
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        this.props.onLoading();
        $.post("/docs", {
            custom_fields: this.transformCustomFields(), 
            template_id: this.props.template.id,
            template_title: this.props.template.title,
            leads_id: this.props.lead.LeadsID,
            email: this.props.email,
            name: this.props.name
        }, function (data) {
            this.props.onComplete(data)
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
        )
    },

    renderSubmit: function() {
        if (this.props.docUrl) {
            return (
                <a  className="btn btn-success btn col-sm-6" 
                    href={this.props.docUrl} 
                    target="blank">
                    Click to Sign Doc
                </a>

            )
        } else if (this.props.docError){
            return (
                <button  className="btn-danger btn col-sm-6" 
                    onClick={this.props.onDocError} >
                    Back to Form
                </button>

            )

        } else {
            return  (
                <input  disabled={!this.isValid()} 
                        className="btn-primary btn col-sm-6" 
                        type="submit" 
                        value="Generate Doc for Signing" 
                        onClick={this.handleSubmit} />
            ) 
        }
        
    },

    render: function() {
        return (
            <div className="doc-form-inner-div">
                <div className="col-sm-12 doc-form-header-div">
                    <h2 className="col-sm-6 doc-form-header">{this.props.template.title}</h2>
                    {this.renderSubmit()}
                </div>
                <div className="loader-div col-sm-4 col-sm-offset-4" style={this.searchingStyle()}>
                    <div className="ajax-loader"></div>
                    <div className="loader-text"><h3>{this.props.templateLoading}</h3></div>
                </div>
                {this.renderDocError()}
                <form className="doc-form col-sm-12">
                    <div className="doc-form-inputs" style={this.formStyle()}>
                        {this.renderDocInputs()}
                    </div>
                </form>
            </div>
        );
    }

});

module.exports = DocForm;
