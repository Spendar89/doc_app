var DocInput = require('./doc_input.jsx');

var DocForm = React.createClass({

    getInitialState: function () {
        return {
            customFields: {
                phone: "20232023444",
                name: "Jake"
            }
        }
    },

    updateFieldValue: function (fieldName, fieldValue) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = fieldValue;
        this.setState({customFields: cf})
    },

    renderDocInputs: function () {
        var self = this;
        return _.map(this.state.customFields, function (fieldValue, fieldName, field) {
            return <DocInput updateFieldValue={self.updateFieldValue} fieldName={fieldName} fieldValue={fieldValue} />
        });
    },

    render: function() {
        return (
            <form className="doc-form col-sm-12">
                {this.renderDocInputs()}
            </form>
        )

    }

});

module.exports = DocForm;
