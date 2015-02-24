var DocInput = require('./doc_input.jsx');

var DocForm = React.createClass({

    renderDocInputs: function () {
        var self = this;
        return _.map(
            this.props.customFields, function (field, fieldName) {
                return (
                    <div>
                    {self.renderDocInputHeader(field)}
                    <DocInput  field={field} updateField={self.props.updateCustomField} fieldName={fieldName} />
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
        $.post("/docs", this.transformCustomFields(), function (data) {
            console.log(data)
        });
    },

    render: function() {
        return (
            <form className="doc-form col-sm-12">
                {this.renderDocInputs()}
                <input type="submit" onClick={this.handleSubmit}/>
            </form>
        );
    }

});

module.exports = DocForm;
