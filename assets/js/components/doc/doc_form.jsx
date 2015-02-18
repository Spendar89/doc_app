var DocInput = require('./doc_input.jsx');

var customMethods = {
    setName: function (self) {
        var nameValue;
        if (self.state.customFields.email.value === "jakesendar@gmail.com") {
            nameValue = "Jake Sendar";
        } else {
            nameValue = "Dude Man"
        };
        self.updateFieldValue("name", nameValue);
    }
};

var DocForm = React.createClass({

    getInitialState: function () {
        return {
            customFields: {
                phone: {
                    value: "2022554618"
                },
                name: {
                    value: "Jake"
                },
                email: {
                    value: "", 
                    customMethod: "setName"
                }
            }
        };
    },

    updateFieldValue: function (fieldName, fieldValue, customMethod) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = {value: fieldValue, method: customMethod};
        this.setState({customFields: cf})
        if (customMethod) {
            customMethods[customMethod](this);
        }
    },

    renderDocInputs: function () {
        var self = this;
        return _.map(
            this.state.customFields, function (field, fieldName) {
                return (
                    <DocInput  updateFieldValue={self.updateFieldValue} 
                        fieldName={fieldName}
                        fieldValue={field.value}
                        customMethod={field.customMethod}/>
                );
            }
        );
    },

    render: function() {
        return (
            <form className="doc-form col-sm-12">
                {this.renderDocInputs()}
            </form>
        );
    }

});

module.exports = DocForm;
