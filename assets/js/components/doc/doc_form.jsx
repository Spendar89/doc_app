var DocInput = require('./doc_input.jsx');

var CustomMethods = require('./../../lib/custom_methods.js');

var DocForm = React.createClass({

    getInitialState: function () {
        return {
            customFields: {
                phone: {
                    value: "2022554618"
                },
                name: {
                    value: "Jake"
                }
                //email: {
                    //value: "", 
                    //customMethod: "setName"
                //}
            }
        };
    },

    updateFieldValue: function (fieldName, fieldValue, customMethod) {
        var cf = _.extend(this.state.customFields, {});
        cf[fieldName] = {value: fieldValue, customMethod: customMethod};
        this.setState({customFields: cf})
        if (customMethod) {
            CustomMethods[customMethod](this);
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

    transformCustomFields: function () {
        return _.transform(this.state.customFields, function(result, field, name) {
            result[name] = field.value;
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        $.post("/docs", this.transformCustomFields()).done(function (data) {
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
