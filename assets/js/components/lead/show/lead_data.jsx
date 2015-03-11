
var LeadData = React.createClass({

    renderInput: function (key, value) {
        var customField = this.props.customFields[key] || this.props.leadUpdates[key];

        var getRowClasses = function () {
            if (customField && customField.value != value) {
                return "danger";
            } else {
                return "success";
            }
        };

        return (
            <tr className={getRowClasses()}>
                <td><label>{key}</label></td>
                <td>{value}</td>
            </tr>
        )
    },

    renderInputs: function () {
        return _.map(
            this.props.lead, function (value, key) {
                if (!key.match(/UserDefined/)) {
                    return this.renderInput(key, value)
                }
            }.bind(this)
        );
    },

    render: function () {
        return (
            <div className="col-sm-12">
                <div className="form-group">
                    <h4 className="control-label">Lead Data</h4>
                    <p><i>This displays the current data for the selected lead</i></p>
                    <div className="lead-table-div">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                {this.renderInputs()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )

    }
});

module.exports = LeadData;
