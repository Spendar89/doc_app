var DocShowTemplate = React.createClass({

    render: function() {
        var id = this.props.params.signatureRequestId;
        var signatureUrl = "https://www.hellosign.com/editor/sign?guid=" + id;
        return (
            <div className="container">
                <div className="col-sm-10 col-sm-offset-1">
                    <div className="jumbotron">
                        <h1>Your Document is Ready</h1>
                        <p><b>Signature Request Id:</b> {this.props.params.signatureRequestId}</p>
                        <p><a className="btn btn-lg btn-primary" href={signatureUrl}>Click to Sign </a></p>
                    </div>
                </div>
            </div>
        )
    }

});

module.exports = DocShowTemplate;
