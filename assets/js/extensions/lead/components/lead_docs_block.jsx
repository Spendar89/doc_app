var LeadDocsBlock = React.createClass({

    renderLeadDocsRow: function(doc, i) {
        var url = '/docs/' + doc.signature_request_id + '?pdf=true',
            signatures = doc.signatures,
            signed = _.sum(signatures, function(s) {
                return s.signed_at ? 1 : 0;
            });

        return (
            <tr key={i}>
                <td>
                    {
                        this.props.page !== "savedDocs" 
                            ? (
                                <a onClick={_.partial(this.props.onDocClick, i)} >
                                    {doc["title"]}
                                </a>
                            ) : doc["title"] 
                    }
                </td>
                <td>
                    {doc["signature_request_id"]}
                </td>
                <td>
                    {signed}/{signatures.length}
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
            if (this.props.page != "savedDocs" && doc["title"] !== this.props.template.title) return false;
            return this.renderLeadDocsRow(doc, i);
        }.bind(this));
    },

    render: function () {
        var loaderStyle = function() {
            var isLoading = _.isEmpty(this.props.docs) && this.props.isLoading; 
            return {
                display: (isLoading ? "block" : "none")
            };
        };

        return (
            <div className="block-div col-sm-12 with-table" id="leadDocsBlock">
                <div className="form-group">
                    <div className="block-header">
                        <h4 className="control-label">Saved Documents:</h4>
                    </div>
                    <div className="block-body">
                        <div className="block-body-top">
                            <p><i>Sign a saved document or view/download as a pdf:</i></p>
                        </div>
                        <div className="docs-search-div row">
                            <div className="col-sm-8 form-group">
                                <input className="form-control" onChange={this.props.onDocsEmail} value={this.props.docsEmail} />
                            </div>
                            <div className="col-sm-4">
                                <a className="btn btn-default btn-block" onClick={this.props.onSearch}>
                                    <span className="glyphicon glyphicon-search" style={{marginRight: "15px"}}></span>
                                    <b>Search For Docs</b>
                                </a>
                            </div>
                        </div>
                        <div className="lead-table-div">
                            <table className="table table-hover">
                                <thead>
                                    <th>
                                        Doc Name
                                    </th>
                                    <th>
                                        HelloSign Doc ID
                                    </th>
                                    <th>
                                        Signed/Total
                                    </th>
                                    <th>
                                        Preview
                                    </th>
                                </thead>
                                <div className="loader-div" style={loaderStyle.call(this)}>
                                    <h3 className="loader-text">Searching For Docs</h3>
                                    <Spinner />
                                </div>
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
