var DocInput = require('./doc_input.jsx');

var DocForm = React.createClass({

    renderDocInputs: function () {
        var self = this;
        return _.map(
            this.props.customFields, function (field, fieldName) {
                return (
                    <div>
                        {self.renderDocInputHeader(field)}
                        <DocInput field={field} 
                                  updateField={self.props.updateCustomField} 
                                  callCustomMethod={self.props.callCustomMethod}
                                  fieldName={fieldName} />
                    </div>
                );
            }
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

    render: function() {
        var searchingStyle={
            visibility: (!this.props.customFields ? "visible" : "hidden")
        };
        var formStyle={
            visibility: (this.props.customFields ? "visible" : "hidden")
        };
        return (
            <div className="doc-form-inner-div">
                <div className="col-sm-12 doc-form-header-div">
                    <h2 className="col-sm-6 doc-form-header">{this.props.template.title}</h2>
                    <input disabled={!this.isValid()} className="btn-submit btn col-sm-6" 
                            type="submit" value="Generate Doc for Signing" onClick={this.handleSubmit}/>
                </div>
                <div className="ajax-loader" style={searchingStyle}></div>
                <form className="doc-form col-sm-12" style={formStyle}>
                    <div className="doc-form-inputs">
                        {this.renderDocInputs()}
                    </div>
                </form>
            </div>
        );
    }

});

module.exports = DocForm;
