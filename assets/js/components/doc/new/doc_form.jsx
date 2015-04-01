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
            return <h2 className="doc-input-header"> {field.header} </h2>
        }
    },

    transformCustomFields: function () {
        return _.transform(this.props.customFields, function(result, field, name) {
            result[name] = field.value;
        });
    },

    isValid: function() {
        return _.every(this.props.customFields, function(field, fieldName) {
            console.log(fieldName + ": ", field.value)
            return field.value != undefined;
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();
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
            display: (!this.props.customFields ? "block" : "none")
        };
    },

    formStyle: function() {
        return {
            visibility: (this.props.customFields ? "visible" : "hidden")
        };
    },

    componentDidMount: function() {
        setTimeout(function() {
            this.setState({loaderText: "Requesting Custom Fields"})
        }.bind(this), 2000)

        setTimeout(function() {
            this.setState({loaderText: "Building Form"})
        }.bind(this), 4000)
    },

    render: function() {
        return (
            <div className="doc-form-inner-div">
                <div className="col-sm-12 doc-form-header-div">
                    <h2 className="col-sm-6 doc-form-header">{this.props.template.title}</h2>
                    <input disabled={!this.isValid()} className="btn-success btn col-sm-6" 
                            type="submit" value="Generate Doc for Signing" onClick={this.handleSubmit}/>
                </div>
                <div className="loader-div col-sm-4 col-sm-offset-4" style={this.searchingStyle()}>
                    <div className="ajax-loader"></div>
                    <div className="loader-text"><h3>{this.state.loaderText}</h3></div>
                </div>
                <form className="doc-form col-sm-12" style={this.formStyle()}>
                    <div className="doc-form-inputs">
                        {this.renderDocInputs()}
                    </div>
                </form>
            </div>
        );
    }

});

module.exports = DocForm;
