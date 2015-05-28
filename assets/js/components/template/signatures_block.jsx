var SignaturesBlock = React.createClass({

    renderSignature(recipient, i) {
        var handleSignature = _.partial(this.props.onSignature, recipient, i);
        return (
            <div className="col-sm-12 form-group" key={i}>
                <div className="col-sm-12">
                    {
                        !recipient.signed
                            ? (
                                <button className="btn-default btn btn-block"
                                        onClick={handleSignature}>
                                       {"Sign For " + recipient.role}
                                </button>
                            )
                            : (
                                <p> Signed by {recipient.role}</p>
                            )
                    }
                </div>
            </div>

        )
    },

    render: function () {
        return (
            <div className="signatures-block col-sm-12">
                <div className="signatures-header col-sm-12">
                    <h4>Your Document is Ready to Sign</h4>
                </div>
                <div className="signatures-body col-sm-12">
                    {_.map(this.props.recipients, this.renderSignature)}
                </div>
            </div>
        )
    }
});

module.exports = SignaturesBlock; 
