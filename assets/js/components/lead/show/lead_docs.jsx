var LeadDocs = React.createClass({

    renderDoc: function(doc, i) {
        var url = '/leads/' + this.props.lead["LeadsID"] + '/docs/' + doc["DocumentID"];
        return (
            <tr>
                <td>
                    {i + 1}
                </td>
                <td>
                    <a target="_blank" href={url}>
                        {doc["Title"] || doc["DocumentID"]}
                    </a>
                </td>
            </tr>
        );

    },

    renderDocs: function() {
        return _.map(this.props.docs, function(doc, i) {
            return this.renderDoc(doc, i)
        }.bind(this));
    },

    render: function () {
        return (
            <div className="block-div col-sm-12">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">Saved Documents:</h4>
                    </div>
                    <div className="block-body">
                        <p><i>These are the saved documents for the current lead.  
                                Click to view and/or download a pdf:</i></p>
                        <div className="lead-table-div">
                            <table className="table table-condensed">
                                <tbody>
                                    {this.renderDocs()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LeadDocs;
