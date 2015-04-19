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

    //updateHeader: function(field) {
        //var oldName = field.name;
        //var newField = _.extend(field, {});
        //var a = field.name.split("%");
        //var name = a[1]

        //if (name) {
            //newField.name = name;
            //newField.header = a[0];
            //this.props.removeCustomField(oldName);
            //this.props.updateCustomField(name, newField);
        //}

    //},

    transformCustomFields: function () {
        return _.transform(this.props.customFields, function(result, field, name) {
            result[name] = field.value || " ";
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

    formStyle: function() {
        return {
            visibility: (!this.props.templateLoading ? "visible" : "hidden")
        };
    },

    componentDidMount: function() {
        setTimeout(function() {
            this.setState({loaderText: "Requesting Custom Fields"})
        }.bind(this), 2000)

        setTimeout(function() {
            this.setState({loaderText: "Building Form"})
        }.bind(this), 4000)

        console.log("mounted!!")
    },

    //componentDidUpdate: function() {
        //_.each(this.props.customFields, this.updateHeader);
    //},
    //
    renderSubmit: function() {
        if (this.props.docUrl) {
            return (
                <a  className="btn-success btn col-sm-6" 
                    href={this.props.docUrl} 
                    target="blank">
                    Click to Sign Doc
                </a>

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
