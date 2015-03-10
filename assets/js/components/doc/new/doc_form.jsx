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

    handleSubmit: function (e) {
        e.preventDefault();
        $.post("/docs", {
            custom_fields: this.transformCustomFields(), 
            template_id: this.props.templateId,
            lead_id: this.props.leadId,
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
            <div>
                <div className="ajax-loader" style={searchingStyle}></div>
                <form className="doc-form col-sm-12" style={formStyle}>
                    {this.renderDocInputs()}
                    <input required className="btn-submit btn col-sm-12" 
                            type="submit" onClick={this.handleSubmit}/>
                </form>
            </div>
        );
    }

});

module.exports = DocForm;
