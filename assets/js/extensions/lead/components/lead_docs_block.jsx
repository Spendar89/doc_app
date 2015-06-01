var LeadDocsBlock = React.createClass({

    renderLeadDocsRow: function(doc, i) {
        //var url = '/leads/' + this.props.lead["LeadsID"] + '/docs/' + doc["DocumentID"];
        var url = '/docs/' + doc['signature_request_id'] + '?pdf=true'
        return (
            <tr key={i}>
                <td>
                    {i + 1}
                </td>
                <td>
                    <a onClick={_.partial(this.props.onClick, i)} >
                        {doc["title"]}
                    </a>
                </td>
                <td>
                    <a className="btn btn-icon" 
                       href={url} 
                       target="_blank">
                           <span className="glyphicon glyphicon-export" aria-hidden="true"></span>
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
                            <p><i>These are the saved documents belonging to the current lead.  
                                    Click to view and/or download a pdf:</i></p>
                        </div>
                        <div className="lead-table-div">
                            <table className="table table-hover">
                                <tbody>
                                    {this.props.isRecipientsValid()
                                        ? this.renderLeadDocs()
                                        : (
                                            <h3 className="validation-error-header">
                                                Please confirm recipient email 
                                                addresses to access saved Documents
                                            </h3>
                                            )
                                    }
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
