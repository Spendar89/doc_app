
var LeadData = React.createClass({

    renderInput: function (key, value) {
        var leadPending = this.props.leadPending;

        var getRowClasses = function () {
            if (leadPending[key] && leadPending[key] != value) {
                return "danger";
            } else {
                return "fsuccess";
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
            <div className="block-div col-sm-12">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">Lead Data</h4>
                    </div>
                    <div className="block-body">
                        <p><i>This displays the current data for the selected lead. Red Rows  will be updated when synced.</i></p>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" value={this.props.syncRemote} checked={this.props.syncRemote} onChange={this.props.handleSync} />
                                    Sync Lead Data With Server
                                </label>
                            </div>
                        <div className="lead-table-div">
                            <table className="table table-condensed">
                                <tbody>
                                    {this.renderInputs()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
});

module.exports = LeadData;
