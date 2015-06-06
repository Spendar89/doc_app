
var LeadDataBlock = React.createClass({

    renderLeadDataRow: function (key, value) {
        var leadPending = this.props.leadPending;

        var getRowClasses = function () {
            if (leadPending[key] && leadPending[key] != value) {
                return "warning";
            } else {
                return "";
            }
        };

        return (
            <tr className={"col-sm-6 " + getRowClasses()} key={key}>
                <td><label>{key}</label></td>
                <td>{value}</td>
            </tr>
        )
    },

    renderLeadDataRows: function () {
        return _.map(
            this.props.lead, function (value, key) {
                if (!key.match(/UserDefined/)) {
                    return this.renderLeadDataRow(key, value)
                }
            }.bind(this)
        );
    },

    render: function () {
        return (
            <div className="lead-data-block col-sm-12">
                <div className="block-body-top row">
                    <p>
                        <i>This displays current data for the selected lead. Highlighted rows will be updated when synced.</i>
                    </p>
                    <div className="checkbox">
                        <label>
                            <input  type="checkbox" value={this.props.syncRemote} 
                                checked={this.props.syncRemote} onChange={this.props.handleSync} />
                            Sync Lead Data With Server
                        </label>
                    </div>
                </div>
                <div className="lead-table-div row">
                    <table className="table">
                        <tbody>
                            {this.renderLeadDataRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    }
});

module.exports = LeadDataBlock;
