var DocInput = require('./doc_input.jsx');

var DocForm = React.createClass({

    renderDocInputs: function () {
        var self = this;
        return _.map(
            this.props.customFields, function (field, fieldName) {
                return (
                    <DocInput  updateFieldValue={self.props.updateCustomFieldValue} 
                        fieldName={fieldName}
                        fieldValue={field.value}
                        customMethod={field.customMethod}/>
                );
            }
        );
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
