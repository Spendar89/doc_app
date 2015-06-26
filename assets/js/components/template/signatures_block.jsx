var SignaturesBlock = React.createClass({

    getInitialState: function() {
        return {
            remindersSent: []
        }

    },

    renderSignature(recipient, i) {
        if (!recipient.signature) return false;
        var handleSignature = _.partial(this.props.onSignature, recipient, i),
            handleSignatureRequestReminder = _.partial(this.props.onSignatureRequestReminder, recipient, function() {
                var remindersSent =  this.state.remindersSent.concat([recipient.email]);
                this.setState({ remindersSent: remindersSent });
            }.bind(this)),
            authorized = true || recipient.authorized,
            reminderSent = _.include(this.state.remindersSent, recipient.email) ;

        return (
            <div className="col-sm-12 form-group" key={i}>
                <div className="col-sm-8 row">
                    <div className="col-sm-5">
                        <label className="signature-info-cell pull-left padded">Role</label>
                        <div className="signature-info-cell pull-left padded">{recipient.role}</div>
                    </div>
                    <div className="col-sm-7">
                        <label className="signature-info-cell pull-left padded">Email</label>
                        <div className="signature-info-cell pull-left padded">{recipient.email}</div>
                    </div>
                </div>
                <div className="col-sm-4">
                    {
                        recipient.signature.status_code !== "signed"
                            ? (
                                recipient.signature.type === "email" 
                                    ? (
                                        <div className="col-sm-12 btn-div"> 
                                            <button className="btn-success btn btn-block"
                                                onClick={handleSignatureRequestReminder}>
                                                { reminderSent
                                                    ? "Reminder Sent" 
                                                    : "Send Reminder Email"
                                                }
                                            </button>
                                        </div>
                                    )
                                        : (
                                        <div className="col-sm-12 btn-div"> 
                                            <button className="btn-success btn btn-block"
                                                disabled={!authorized}
                                                onClick={handleSignature}>
                                                {authorized ? "Click to Sign!" : "Waiting for Email Confirmation"}
                                            </button>
                                        </div>

                                        )
                            )
                            : (
                                <div className="col-sm-12 signed-div"> 
                                    <span> Signed </span> <span className="signature-icon glyphicon glyphicon-ok"></span>
                                </div>
                            )
                    }
                </div>
            </div>

        )
    },

    render: function () {
        var r = this.props.recipients[0],
            id = r && r.signature.signatureRequestId,
            type = r && r.signature.type,
            url = id && '/docs/' + id + '?pdf=true';

        return (
            <div className="signatures-block">
                <div className="signatures-header col-sm-12">
                    <h2>Your Document is Ready!</h2>
                    <h4><i>Signature Type: {type}</i></h4>
                    <h4><i>Document ID: {id}</i></h4>
                    <a className="btn btn-icon" 
                        href={url} 
                        target="_blank">
                        <h4>
                            <span className="glyphicon glyphicon-export" aria-hidden="true"></span>
                            Download PDF
                        </h4>
                    </a>
                </div>
                <div className="signatures-body row">
                    {_.map(this.props.recipients, this.renderSignature)}
                </div>
            </div>
        )
    }
});

module.exports = SignaturesBlock; 
