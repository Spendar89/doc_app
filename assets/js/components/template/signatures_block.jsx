var SignaturesBlock = React.createClass({

    renderSignature(recipient, i) {
        if (!recipient.signature) return false;
        var handleSignature = _.partial(this.props.onSignature, recipient, i);

        return (
            <div className="col-sm-12 form-group" key={i}>
                <div className="col-sm-7">
                    <h3>{recipient.role}: {recipient.email} </h3>
                </div>
                <div className="col-sm-5">
                    {
                        recipient.signature.status_code !== "signed"
                            ? (
                                <button className="btn-success btn btn-block"
                                        disabled={!recipient.authorized}
                                        onClick={handleSignature}>
                                    {recipient.authorized ? "Click to Sign!" : "Waiting for Email Confirmation"}
                                </button>
                            )
                            : (
                                <h3 className="col-sm-12"> 
                                    <span> Signed </span> <span className="signature-icon glyphicon glyphicon-ok"></span>
                                </h3>
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
                    <h2>Your Document is Ready!</h2>
                    <h4><i>Confirm Your Email Address to Sign</i></h4>
                </div>
                <div className="signatures-body col-sm-12">
                    {_.map(this.props.recipients, this.renderSignature)}
                </div>
            </div>
        )
    }
});

module.exports = SignaturesBlock; 
