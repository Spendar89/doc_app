var LeadDocsBlock = React.createClass({

    renderLeadDocsRow: function(doc, i) {
        var url = '/leads/' + this.props.lead["LeadsID"] + '/docs/' + doc["DocumentID"];
        return (
            <tr key={i}>
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

    renderLeadDocs: function() {
        return _.map(this.props.docs, function(doc, i) {
            return this.renderLeadDocsRow(doc, i)
        }.bind(this));
    },

    render: function () {
        return (
            <div className="block-div col-sm-12 with-table" id="leadDocsBlock">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">Saved Documents:</h4>
                    </div>
                    <div className="block-body">
                        <div className="block-body-top">
                            <p><i>These are the saved documents for the current lead.  
                                    Click to view and/or download a pdf:</i></p>
                        </div>
                        <div className="lead-table-div">
                            <table className="table table-hover">
                                <tbody>
                                    {this.renderLeadDocs()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LeadDocsBlock;
